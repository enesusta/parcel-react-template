const spawn = require('cross-spawn');
const path = require('path');
const chalk = require('chalk');

const clone = (url, projectName) => {
    const clone = spawn.sync('git', ['clone', url, projectName], {
        stdio: 'inherit',
    });

    return clone;
};

/**
 * Clones the parcel-react-template repository
 * @param {string} projectName
 */
module.exports = projectName => {
    const httpsUrl = 'https://github.com/enesusta/parcel-react-template.git';
    const sshUrl = 'git@github.com:enesusta/parcel-react-template.git';
    const root = path.resolve(projectName);

    console.log();
    console.log(`Creating a new Library in ${chalk.green(root)}`);
    console.log();

    const cloneHttps = clone(httpsUrl, projectName);
    if (cloneHttps.status === 0) {
        return true;
    }

    const cloneSsh = clone(sshUrl, projectName);
    return cloneSsh.status === 0;
};
