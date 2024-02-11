const process = require('process');
const { exec } = require('child_process');
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

async function getCommitsByDate(username, year, commit = 'fix: last commit') {
    const reposRes = await fetch(`https://github.com/users/${username}/contributions?from=${year}-11-30&to=${year}-12-30`);
    const repos = await reposRes.text();
    const regex = />No contributions on (\w+\s\w+)\.</
    const result = regex.exec(repos)[1];
    // result is in the format 'August 18th'
    // the year is in the format '2023'
    // convert it into a date object
    const [monthName, dayName] = result.split(' ');
    const day = /(\d+)/.exec(dayName)[1];
    const month = months.indexOf(monthName);
    const date = new Date(year, month, day);
    const today = new Date();
    const differenceInDays = Math.floor((today - date) / (1000 * 60 * 60 * 24));
    const message = `git commit --date "${differenceInDays} day ago" -m "${commit}"`
    exec("git add .")
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
}

const commitMessageRegex = /index\.js\s(.+)/
const args = process.argv.join(" ")
const message = commitMessageRegex.exec(args)[1];
getCommitsByDate('ThiagoRAD', 2024, message)
