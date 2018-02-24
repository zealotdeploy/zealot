import cosmiconfig from "cosmiconfig";

const explorer = cosmiconfig("zealot", { sync: true });

const config = {
  ...explorer.load().config,
  timestamp: Date.now(),
};

export default config;
