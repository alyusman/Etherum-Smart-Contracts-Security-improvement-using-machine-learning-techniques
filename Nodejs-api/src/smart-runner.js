#! /usr/bin/env node
/* eslint-disable no-undef */
/* eslint-disable no-var */
/* eslint-disable vars-on-top */
/* eslint-disable no-use-before-define */
const fail = (reason) => {
  console.error(reason);
  process.exit(1);
};
function getJavaVersion() {
  try {
    // eslint-disable-next-line no-undef
    const javaVersionProc = exec('java  -version', { silent: true });
    if (javaVersionProc.code !== 0) {
      return false;
    }
    const stdout = javaVersionProc.stderr;
    // console.log(javaVersionProc);
    // console.log("stdout is "+stdout);
    const regexp = /version "(.*?)"/;
    const match = regexp.exec(stdout);
    const parts = match[1].split('.');
    let join = '.';
    let versionStr = '';
    parts.forEach((v) => {
      versionStr += v;
      if (join !== null) {
        versionStr += join;
        join = null;
      }
    });
    versionStr = versionStr.replace('_', '');
    // console.log("Java version string "+versionStr)
    return parseFloat(versionStr);
  } catch (e) {
    return false;
  }
}

const getDirectories = (dirPath) => fs.readdirSync(dirPath).filter(
  (file) => fs.statSync(path.join(dirPath, file)).isDirectory(),
);

function getEmbeddedJavaDir() {
  let _platform = os.platform();
  let _driver;
  switch (_platform) {
    case 'darwin': _platform = 'macosx'; _driver = `Contents${path.sep}Home${path.sep}bin`; break;
    case 'win32': _platform = 'windows'; _driver = 'bin'; break;
    case 'linux': _driver = 'bin'; break;
    default:
      fail(`unsupported platform: ${_platform}`);
  }

  const jreDir = `${getJdeploySupportDir() + path.sep}node_modules${path.sep}node-jre${path.sep}jre`;

  try {
    return jreDir + path.sep + getDirectories(jreDir)[0] + path.sep + _driver;
  } catch (e) {
    // console.log(e);
    return jreDir;
  }
}

function getJdeploySupportDir() {
  return `${os.homedir() + path.sep}.jdeploy`;
}
var fs = require('fs');
var os = require('os');
var path = require('path');

const jarName = 'smartcheck-2.0-jar-with-dependencies.jar';
const mainClass = '{{MAIN_CLASS}}';
let classPath = '{{CLASSPATH}}';
const port = '0';
const warPath = '';
classPath = classPath.split(':');
let classPathStr = '';
let first = true;
classPath.forEach((part) => {
  if (!first) classPathStr += path.delimiter;
  first = false;
  classPathStr += `${__dirname}/${part}`;
});
classPath = classPathStr;
// eslint-disable-next-line no-unused-vars
const shell = require('shelljs/global');

const userArgs = process.argv.slice(2);
const javaArgs = [];
javaArgs.push(`-Djdeploy.base=${__dirname}`);
javaArgs.push(`-Djdeploy.port=${port}`);
javaArgs.push(`-Djdeploy.war.path=${warPath}`);
const programArgs = [];
userArgs.forEach((arg) => {
  if (arg.startsWith('-D') || arg.startsWith('-X')) {
    javaArgs.push(arg);
  } else {
    programArgs.push(arg);
  }
});
let cmd = 'java';

env.PATH = getEmbeddedJavaDir() + path.delimiter + env.PATH;
if (env.JAVA_HOME) {
  env.PATH = `${env.JAVA_HOME + path.sep}bin${path.delimiter}${env.PATH}`;
}

const javaVersion = getJavaVersion();
if (javaVersion === false || javaVersion < 1.8 || env.JDEPLOY_USE_NODE_JRE) {
  if (!test('-e', getJdeploySupportDir())) {
    mkdir(getJdeploySupportDir());
  }
  const packageJson = `${getJdeploySupportDir() + path.sep}package.json`;
  if (!test('-e', packageJson)) {
    fs.writeFileSync(packageJson, JSON.stringify({ name: 'jdeploy-support', version: '1.0.0' }), 'utf8');
  }
  if (!test('-e', getEmbeddedJavaDir())) {
    const currDir = pwd();
    cd(getJdeploySupportDir());
    console.log(`Installing/Updating JRE in ${getJdeploySupportDir()}...`);
    exec('npm install node-jre --save');
    cd(currDir);
  }
  env.PATH = getEmbeddedJavaDir() + path.delimiter + env.PATH;
  /*
    // System java either not on path or too old
    if (!test('-e', getEmbeddedJavaDir())) {
        // Could not find embedded java dir
        // We need to install it.
        fail("Could not find embedded java at "+getEmbeddedJavaDir());

    } else {
        // Found the embedded version.  Add it to the PATH
        env['PATH'] = getEmbeddedJavaDir() + path.delimiter + env['PATH']
        console.log("Now java version is "+getJavaVersion());
        fail("Path is now "+env['PATH']);
    }
    */
}
// console.log("Java version is "+getJavaVersion());

javaArgs.forEach((arg) => {
  cmd += ` "${arg}"`;
});
if (jarName !== '{' + '{JAR_NAME}}') {
  cmd += ` -jar "${__dirname}/${jarName}" `;
} else {
  cmd += ` -cp "${classPath}" ${mainClass} `;
}

programArgs.forEach((arg) => {
  cmd += ` "${arg}"`;
});

const getResult = (filePath) => new Promise((resolve, reject) => {
  console.log(cmd);
  exec(`${cmd} "-p" "${filePath}"`, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      reject(stderr);
      return;
    }
    resolve(stdout);
    // console.log(`stdout: ${stdout}`);
  });
});
module.exports = {
  getResult,
};
