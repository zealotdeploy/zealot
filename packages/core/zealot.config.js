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
    },
  },
];

module.exports = {
  tasks,
  slug: "testing",
  domain: "example.com",
  cluster: "blend-staging-east",
  region: "us-east-1",
  port: 80,
  vpc: "vpc-cf3588b6",
  logGroup: "DockerStagingEast",
  elb:
    "arn:aws:elasticloadbalancing:us-east-1:545046381935:loadbalancer/app/Blend-Staging-East/bfee18798d300334",
  healthCheck: "/alb",
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
