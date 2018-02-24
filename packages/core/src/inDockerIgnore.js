import fs from "fs";
import globToRegExp from "glob-to-regexp";

export const isFileIgnored = (ignoreRules, filename) =>
  ignoreRules.some(rule => globToRegExp(rule).test(filename));

export const getDockerIgnoresFromFile = () =>
  fs.existsSync("./.dockerignore")
    ? fs.readFileSync("./.dockerignore", "utf-8").split("\n")
    : [];

export default filename => isFileIgnored(getDockerIgnoresFromFile(), filename);
