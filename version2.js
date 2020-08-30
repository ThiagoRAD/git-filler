const process = require('process');
const {exec} = require('child_process');

getRandomDate = () => {
  const start = new Date(2018, 0, 1);
  const end = new Date();
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

async function doCommits(commit = 'update') {
  const date = getRandomDate();
  const today = new Date();
  const differenceInDays = Math.floor((today - date) / (1000 * 60 * 60 * 24));
  const message = `git commit --date "${differenceInDays} day ago" -m "${commit}"`;
  exec('git ls-files --others --exclude-standard', (error, stdout, stderr) => {
    const files = stdout.split('\n').filter((f) => f);
    for (const file of files) {
      exec(`git add ${file}`, () => {
        exec(message, {env: {...process.env, GIT_COMMITER_DATE: date.toISOString()}}, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error executing command: ${error.message}`);
            return;
          }
          if (stderr) {
            console.error(`Error: ${stderr}`);
            return;
          }
          exec('git push');
        });
      });
    }
  });
}

const commitMessageRegex = /version2\.js\s(.+)/;
const args = process.argv.join(' ');
const message = commitMessageRegex.exec(args)[1];

doCommits(message);
