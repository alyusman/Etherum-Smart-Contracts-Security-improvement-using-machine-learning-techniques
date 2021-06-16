const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
const multer = require('multer');
const MainController = require('./ctrl');
const { authMiddleware, adminMiddleware } = require('./auth');

const app = express();
const storage = multer.memoryStorage();

app.server = http.createServer(app);

app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(
  bodyParser.json({
    limit: '2000kb',
  }),
);

app.use(compression());

app.disable('x-powered-by');

// cors
app.use(cors());
app.post('/user/login', MainController.userLogin);
app.post('/user/register', MainController.userRegister);
app.post('/user/createTest', authMiddleware,
  multer({ storage, limits: { fileSize: 1024 * 1024 * 20 } }).single('file'),
  MainController.createTest);
app.get('/user/downloadTestReport/:jobId', MainController.downloadReport);
app.get('/user/getTests', authMiddleware, MainController.getTests);
app.get('/user/dashboard', authMiddleware, MainController.userDashboard);

app.get('/admin/allUsers', authMiddleware, adminMiddleware, MainController.adminGetUsers);
app.get('/admin/allTests', authMiddleware, adminMiddleware, MainController.adminGetAllTests);
app.post('/admin/processActivation', authMiddleware, adminMiddleware, MainController.adminProcessActivation);
app.get('/admin/dashboard', authMiddleware, adminMiddleware, MainController.adminDashboard);

app.server.listen(1337, () => { console.log('live at port 1337'); });

module.exports = { app };
