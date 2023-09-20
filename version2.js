const process = require('process');
const {exec} = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

getRandomDate = () => {
  const start = new Date(2018, 0, 1);
  const end = new Date();
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

async function doCommits(commit = 'update') {
  try {
    const date = getRandomDate();
    const today = new Date();
    const differenceInDays = Math.floor((today - date) / (1000 * 60 * 60 * 24));
    const message = `git commit --date "${differenceInDays} day ago" -m "${commit}"`;
    
    // Get list of modified files
    const {stdout} = await execAsync('git ls-files --others --modified --deleted --exclude-standard');
    const files = stdout.split('\n').filter((f) => f);
    
    // Add and commit each file
    for (const file of files) {
      await execAsync(`git add ${file}`);
      await execAsync(message, {env: {...process.env, GIT_COMMITER_DATE: date.toISOString()}});
    }
    
    // Push changes
    await execAsync('git push');
    console.log('All commits completed successfully');
    
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

const commitMessageRegex = /version2\.js\s(.+)/;
const args = process.argv.join(' ');
const message = commitMessageRegex.exec(args)[1];

doCommits(message);
