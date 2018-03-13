export default {
  AWSTemplateFormatVersion: "2010-09-09",
  Resources: {
    ECSALBListenerRule: {
      Type: "AWS::ElasticLoadBalancingV2::ListenerRule",
      DependsOn: "ECSTG",
      Properties: {
        Actions: [
          {
            Type: "forward",
            TargetGroupArn: {
              Ref: "ECSTG",
            },
          },
        ],
        Conditions: [
          {
            Field: "host-header",
            Values: [
              {
                Ref: "HOST",
              },
            ],
          },
        ],
        ListenerArn: {
          Ref: "ALBLISTENER",
        },
        Priority: {
          Ref: "ALBPRIORITY",
        },
      },
    },
    ECSTG: {
      Type: "AWS::ElasticLoadBalancingV2::TargetGroup",
      Properties: {
        HealthCheckIntervalSeconds: 10,
        HealthCheckPath: {
          Ref: "HEALTHCHECKPATH",
        },
        Port: 80,
        Protocol: "HTTP",
        HealthCheckProtocol: "HTTP",
        HealthCheckTimeoutSeconds: 5,
        HealthyThresholdCount: 2,
        Name: "CONTAINERNAME",
        UnhealthyThresholdCount: 2,
        VpcId: {
          Ref: "VPCID",
        },
      },
    },
    service: {
      Type: "AWS::ECS::Service",
      Properties: {
        Cluster: {
          Ref: "ECSCLUSTER",
        },
        DesiredCount: "1",
        LoadBalancers: [
          {
            ContainerName: {
              Ref: "CONTAINERNAME",
            },
            ContainerPort: {
              Ref: "CONTAINERPORT",
            },
            TargetGroupArn: {
              Ref: "ECSTG",
            },
          },
        ],
        Role: {
          Ref: "ECSServiceRole",
        },
        TaskDefinition: {
          Ref: "TASKDEFINITION",
        },
      },
    },
  },
  Parameters: {
    ALBPORT: {
      Type: "Number",
      Description: "The port number on the ALB. Defaults to 80.",
      AllowedValues: [80, 443],
      Default: 80,
    },
    CONTAINERPORT: {
      Type: "Number",
      Description:
        "The port number on the container to connect to. Defaults to 80.",
      MaxValue: 32767,
      Default: 80,
    },
    ALBPROTO: {
      Type: "String",
      Description: "The Protocol for the Load Balancer. Defaults to HTTPS.",
      AllowedValues: ["HTTP", "HTTPS"],
      Default: "HTTP",
    },
    ECSALB: {
      Type: "String",
      Description:
        "The ARN for the Application Load Balancer used to route traffic to the container",
    },
    ALBLISTENER: {
      Type: "String",
      Description:
        "The ARN for the Application Load Balancer used to route traffic to the container",
    },
    HOST: {
      Type: "String",
      Description: "The hostname the ALB will listen for traffic on.",
    },
    ALBPRIORITY: {
      Type: "Number",
      Description: "The priority of this rule (1-100)",
      MaxValue: 100,
    },
    HEALTHCHECKPATH: {
      Type: "String",
      Description: "The path to use for health checks on the container",
    },
    VPCID: {
      Type: "String",
      Description: "The VPCID this container will belong to",
    },
    ECSCLUSTER: {
      Type: "String",
      Description: "The cluster for this stack",
    },
    TASKDEFINITION: {
      Type: "String",
      Description: "The Tesk Definition arn",
    },
    ECSServiceRole: {
      Type: "String",
      Description: "The VPCID this container will belong to",
    },
    CONTAINERNAME: {
      Type: "String",
      Description: "The container name",
      ConstraintDescription: "CONTAINERNAME must match [a-z0-9-]",
    },
  },
};
