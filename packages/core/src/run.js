import getStackOutputs from "./getStackOutputs";

const outputs = async () => {
  console.log(await getStackOutputs("Zealot"));
};
outputs();
