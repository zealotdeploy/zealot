const tasks = [
  {
    name: "app",
    logs: true, // default
    default: true, // only necessary for multiple
    memoryReservation: 5,
    buildFlags: () => {
      if (process.env.NODE_ENV === "production") {
        return ["-f Dockerfile-production"];
      }
      return null;
    },
  },
];

module.exports = {
  tasks,
  stackName: "Zealot",
  slug: "testing",
  domain: "example.com",
  region: "us-east-2",
  port: 80,
  www: true, // default true
};

/*
const tasks = [
  {
    name: "php",
    default: true,
    memoryReservation: 5,
    buildFlags: [
      "--build-arg SERVER_NAME=example.com",
      "-f .craft.php.dockerfile",
    ],
  },
];
*/
