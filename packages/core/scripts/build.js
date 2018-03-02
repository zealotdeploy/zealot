/* eslint-disable */
const execSync = require("child_process").execSync;
const rimraf = require("rimraf");

const exec = (command, extraEnv) =>
  execSync(command, {
    stdio: "inherit",
    env: Object.assign({}, process.env, extraEnv),
  });

const clearDist = () => {
  console.log("\nCleaning ...");
  try {
    rimraf.sync(`./dist`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

function buildEs() {
  console.log("\nBuilding ES modules ...");

  exec(
    `./node_modules/.bin/babel ./src/ -d ./dist/es --ignore '**/*-test.js'`,
    {
      BABEL_ENV: "es",
    },
  );
}

function buildCjs({ input, file }) {
  console.log(`\nBuilding CJS module ${input}...`);

  exec("babel src/ -d dist/cjs --ignore '**/*-test.js'", {
    BABEL_ENV: "cjs",
  });
}

clearDist();
buildEs();
buildCjs({
  input: "src/index.js",
  file: "dist/cjs/index.js",
});
