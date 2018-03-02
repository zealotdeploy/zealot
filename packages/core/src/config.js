import cosmiconfig from "cosmiconfig";

const explorer = cosmiconfig("zealot", { sync: true });

const configData = explorer.load();

if (configData === null) {
  throw new Error("Zealot configuration not found");
}

export default {
  ...configData.config,
  timestamp: Date.now(),
};
