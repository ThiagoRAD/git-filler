const process = require('process');
const { exec } = require('child_process');

const getRandomYear = () => {
  const currentYear = new Date().getFullYear();
  return Math.floor(Math.random() * (currentYear - 2018 + 1)) + 2018;
}

const getRandomFromList = (list) => {
  return list[Math.floor(Math.random() * list.length)];
}

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

async function getCommitsByDate(username, year, commit = 'fix: last commit') {
    const reposRes = await fetch(`https://github.com/users/${username}/contributions?from=${year}-11-30&to=${year}-12-30`);
    const repos = await reposRes.text();
    const regex = />No contributions on (\w+\s\w+)\.</g
    const match = repos.match(regex)
    const randomMatch = getRandomFromList(match)
    const result = regex.exec(randomMatch)[1]
    const [monthName, dayName] = result.split(' ');
    const day = /(\d+)/.exec(dayName)[1];
    const month = months.indexOf(monthName);
    const date = new Date(year, month, day);
    const today = new Date();
    const differenceInDays = Math.floor((today - date) / (1000 * 60 * 60 * 24));
    const message = `git commit --date "${differenceInDays} day ago" -m "${commit}"`
    exec("git add .", () => {
      exec(message, {env: { ...process.env, GIT_COMMITER_DATE: date.toISOString()}},(error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing command: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`Error: ${stderr}`);
          return;
        }
        console.log(stdout)
        exec("git push")
      });
    })
}

const commitMessageRegex = /version1\.js\s(.+)/
const args = process.argv.join(" ")
const message = commitMessageRegex.exec(args)[1];



getCommitsByDate('ThiagoRAD', getRandomYear(), message)
