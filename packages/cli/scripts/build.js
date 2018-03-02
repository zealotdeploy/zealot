/* eslint-disable import/no-extraneous-dependencies */
const rollup = require("rollup");
const resolve = require("rollup-plugin-node-resolve");
const commonjs = require("rollup-plugin-commonjs");
const replace = require("rollup-plugin-replace");
const builtins = require("rollup-plugin-node-builtins");
const globals = require("rollup-plugin-node-globals");
const json = require("rollup-plugin-json");

const inputOptions = {
  input: "src/index.js",
  acorn: {
    allowHashBang: true,
  },
  plugins: [
    globals(),
    builtins(),
    replace({
      "#! /usr/bin/env node": "",
    }),
    json(),
    resolve({
      jsnext: true,
      main: true,
      preferBuiltins: true,
    }),
    commonjs(),
  ],
  external: ["aws-sdk", "@zealotdeploy/core"],
};

const outputOptions = {
  format: "umd",
  file: "bin/zealot.js",
  name: "zealot",
  banner: "#!/usr/bin/env node",
};

async function build() {
  try {
    const bundle = await rollup.rollup(inputOptions);
    await bundle.write(outputOptions);
  } catch (e) {
    console.log(e);
  }
}

build();
