'use strict';

process.on('unhandledRejection', err => {
    throw err;
});

const program = require('commander');
const spawn = require('cross-spawn');
const chalk = require('chalk');
const rimraf = require('rimraf');
const fs = require('fs-extra');

const validateLibName = require('./utils/validateLibName');
const cloneRepository = require('./utils/cloneRepository');
const updatePackageJson = require('./utils/updatePackageJson');
const isYarnInstalled = require('./utils/isYarnInstalled');

const packageJson = require('./package.json');

let projectName;

program
    .version(packageJson.version)
    .arguments('<project-directory>')
    .usage(`${chalk.green('<project-directory>')}`)
    .action(name => {
        projectName = name;
    })
    .on('--help', () => {
        console.log();
        console.log(`Only ${chalk.green('<project-directory>')} is required.`);
    });

program.parse(process.argv);

const createLibrary = () => {
    validateLibName(projectName, program);

    if (!cloneRepository(projectName)) {
        console.log();
        console.log(chalk.red('Error: Cloning of the repository failed.'));
        process.exit(1);
    }

    rimraf.sync(`${projectName}/.git`);
    rimraf.sync(`${projectName}/lib`);

    rimraf.sync(`${projectName}/LICENSE.md`);
    rimraf.sync(`${projectName}/CONTRIBUTING.md`);
    rimraf.sync(`${projectName}/CODE_OF_CONDUCT.md`);
    rimraf.sync(`${projectName}/CHANGELOG.md`);
    rimraf.sync(`${projectName}/UPGRADE.md`);
    rimraf.sync(`${projectName}/README.md`);

    rimraf.sync(`${projectName}/.github`);

    console.log('1');

    fs.moveSync(`${projectName}/template/src`, `${projectName}/src`);

    console.log('2');

    fs.moveSync(`${projectName}/template/public`, `${projectName}/public`);

    console.log('3');

    fs.moveSync(`${projectName}/template/.npmignore`, `${projectName}/.npmignore`);

    console.log('4');
/*
    fs.moveSync(`${projectName}/template/.gitignore`, `${projectName}/.gitignore`);
/*
    console.log('5');

    fs.moveSync(`${projectName}/template/yarn.lock`, `${projectName}/yarn.lock`);

    console.log('6');

    fs.moveSync(`${projectName}/template/package.json`, `${projectName}/package.json`);

    console.log('7');

    fs.moveSync(`${projectName}/template/index.js`, `${projectName}/index.js`);

    console.log('8');
*/

    fs.moveSync(`${projectName}/template`, `${projectName}/.`);

    rimraf.sync(`${projectName}/template`);

    updatePackageJson(`${projectName}/package.json`, projectName);

    const packageManager = isYarnInstalled() ? 'yarn' : 'npm';

    console.log();
    console.log('Installing dependencies');
    console.log();
    spawn.sync(packageManager, ['install'], {
        cwd: `${projectName}`,
        stdio: 'inherit',
    });

    console.log();
    console.log(
        chalk.green('Success!'),
        `Created ${projectName} at ${process.cwd()}`
    );
    console.log();

    console.log(
        `To start the application, ${chalk.cyan(
            'cd'
        )} inside the newly created project and run ${chalk.cyan(
            packageManager + ' start'
        )} `
    );
    console.log();
    console.log(chalk.cyan(`    cd ${projectName}`));
    console.log(chalk.cyan(`    ${packageManager} start`));
    console.log();
};

createLibrary();
