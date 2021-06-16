/* eslint-disable consistent-return */
const fs = require('fs').promises;
const { v1: uuidv1 } = require('uuid');
const ejs = require('ejs');
const path = require('path');
const { users, files, report } = require('./models/index');
const config = require('./config');
const { issueToken, encyptPassword } = require('./auth');
const smartCheck = require('./smart-check');
const http = require('./http');

class MainController {
  static async userRegister(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.json({ code: 400, message: 'Validation error' });
      }
      const user = await users.findOne({ raw: true, where: { email } });
      if (user && user.id) {
        return res.json({ code: 400, message: 'User already exsits' });
      }
      const userCreated = await users.create({
        email, password: encyptPassword(password), role: 1,
      });
      const token = issueToken({
        id: userCreated.id,
        email: userCreated.email,
      });
      const resp = {
        ...user,
        token,
      };
      return res.json({ code: 200, message: 'User registered successfully', result: resp });
    } catch (error) {
      next(error);
    }
  }

  static async userLogin(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.json({ code: 400, message: 'Validation error' });
      }
      const user = await users.findOne({ raw: true, where: { email } });
      if (!user) {
        return res.json({ code: 400, message: 'Invalid email or password' });
      }

      if (user.password !== encyptPassword(password)) {
        return res.json({ code: 400, message: 'Invalid email or password' });
      }

      const token = issueToken({
        id: user.id,
        email: user.email,
      });
      const resp = {
        ...user,
        token,
      };
      return res.json({ code: 200, message: 'User logged in successfully', result: resp });
    } catch (error) {
      next(error);
    }
  }

  static async runDataModelAnalysis(csvString) {
    const reentrancy = await http.getRequest(`${config.dmApi}/reentrancy?csv=${csvString}`);
    const arithmetic = await http.getRequest(`${config.dmApi}/arithmetic?csv=${csvString}`);
    const unchecked = await http.getRequest(`${config.dmApi}/unchecked?csv=${csvString}`);
    return { reentrancy, arithmetic, unchecked };
  }

  static async createTest(req, res, next) {
    try {
      const { file } = req;
      const re = /(?:\.([^.]+))?$/;
      const ext = re.exec(file.originalname)[1];
      if (ext !== 'sol') {
        return res.json({ code: 400, message: 'Invalid file type' });
      }
      const fileName = `uploads/${uuidv1()}.sol`;
      await fs.writeFile(fileName, file.buffer, 'binary');
      const smartCheckResult = await smartCheck.run(fileName);
      const { csvString } = smartCheckResult;

      const access = await http.getRequest(`${config.dmApi}/access?csv=${csvString}`);
      const dos = await http.getRequest(`${config.dmApi}/dos?csv=${csvString}`);
      const unchecked = await http.getRequest(`${config.dmApi}/unchecked?csv=${csvString}`);

      const fileCreated = await files.create({
        userId: req.loggedUser.id,
        fileName: file.originalname,
        filePath: fileName,
      });
      const reportCreated = await report.create({
        userId: req.loggedUser.id,
        fileId: fileCreated.id,
        isAccess: access.response.result,
        isDos: dos.response.result,
        isUnchecked: unchecked.response.result,

        accessPerc: access.response.percentage,
        dosPerc: dos.response.percentage,
        uncheckedPerc: unchecked.response.percentage,
      });

      if (fileCreated && reportCreated) {
        return res.json({ code: 200, message: 'User logged in successfully', result: true });
      }
      return res.json({ code: 400, message: 'Something went wrong' });
    } catch (error) {
      next(error);
    }
  }

  static async getTests(req, res, next) {
    try {
      const filesAll = await files.findAll({
        userId: req.loggedUser.id,
      });
      if (filesAll) {
        return res.json({ code: 200, message: 'Request successfull', result: filesAll });
      }
      return res.json({ code: 400, message: 'Something went wrong' });
    } catch (error) {
      next(error);
    }
  }

  static async adminGetUsers(req, res, next) {
    try {
      const usersAll = await users.findAll();
      if (usersAll) {
        return res.json({ code: 200, message: 'Request successfull', result: usersAll });
      }
      return res.json({ code: 400, message: 'Something went wrong' });
    } catch (error) {
      next(error);
    }
  }

  static async adminGetAllTests(req, res, next) {
    try {
      const filesAll = await files.findAll();
      if (filesAll) {
        return res.json({ code: 200, message: 'Request successfull', result: filesAll });
      }
      return res.json({ code: 400, message: 'Something went wrong' });
    } catch (error) {
      next(error);
    }
  }

  static async adminProcessActivation(req, res, next) {
    try {
      const { userId, value } = req.body;
      const userUpdated = await users.update({ isActive: value }, { where: { id: userId } });
      if (userUpdated) {
        return res.json({ code: 200, message: 'Request successfull', result: userUpdated });
      }
      return res.json({ code: 400, message: 'Something went wrong' });
    } catch (error) {
      next(error);
    }
  }

  static async downloadReport(req, res, next) {
    try {
      const { jobId } = req.params;
      const file = await files.findByPk(jobId);
      const reportDb = await report.findOne({ where: { fileId: file.id } });
      if (file && reportDb) {
        const data = {
          fileName: file.fileName,
          createdAt: file.createdAt,

          isAccess: reportDb.isAccess,
          accessPercentage: reportDb.accessPerc,

          isDos: reportDb.isDos,
          dosPercentage: reportDb.dosPerc,

          isUnchecked: reportDb.isUnchecked,
          uncheckedPercentage: reportDb.uncheckedPerc,
        };
        const html = await ejs.renderFile(
          path.join(__dirname, './template/report-template.ejs'),
          data,
        );
        return res.send(html);
      }
    } catch (error) {
      next(error);
    }
  }

  static async userDashboard(req, res) {
    try {
      const filesAll = await files.count({ raw: true, where: { userId: req.loggedUser.id } });
      const reportsAll = await report.count({ raw: true, where: { userId: req.loggedUser.id } });
      return res.json({
        code: 200,
        message: 'Request successfull',
        result: {
          totalTests: filesAll,
          totalReports: reportsAll,
        },
      });
    } catch (error) {
      return res.json({ code: 400, message: 'Something went wrong' });
    }
  }

  static async adminDashboard(req, res) {
    try {
      const usersAll = await users.count();
      const filesAll = await files.count();
      const reportsAll = await report.count();
      return res.json({
        code: 200,
        message: 'Request successfull',
        result: {
          totalUsers: usersAll,
          totalTests: filesAll,
          totalReports: reportsAll,
        },
      });
    } catch (error) {
      return res.json({ code: 400, message: 'Something went wrong' });
    }
  }
}

module.exports = MainController;
