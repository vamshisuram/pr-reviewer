const simpleGit = require("simple-git");
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

const git = simpleGit();

const [, , base, head] = process.argv;

(async () => {
  const diff = await git.diff([`${base}...${head}`]);

  const changedFiles = new Set();
  diff.split("\n").forEach((line) => {
    const match = line.match(/^diff --git a\/(.+?) b\//);
    if (match) changedFiles.add(match[1]);
  });

  console.log(chalk.blue(`\nChanged Files:\n`));
  [...changedFiles].forEach((f) => console.log(` - ${f}`));

  console.log(chalk.yellow(`\nRunning ESLint...\n`));
  try {
    const output = execSync(`npx eslint ${[...changedFiles].join(" ")}`, {
      encoding: "utf-8",
    });
    console.log(output);
  } catch (err) {
    console.error(chalk.red(err.stdout || err.message));
  }
})();
