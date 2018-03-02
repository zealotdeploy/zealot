export default {
  "AWSTemplateFormatVersion":"2010-09-09",
  "Resources":{
    "CloudwatchLogsGroup":{
      "Type":"AWS::Logs::LogGroup",
      "Properties":{
        "LogGroupName":{
          "Fn::Join":[
            "-",
            [
              "ECSLogGroup",
              {
                "Ref":"AWS::StackName"
              }
            ]
          ]
        },
        "RetentionInDays":14
      }
    },
    "ALBListener":{
      "Type":"AWS::ElasticLoadBalancingV2::Listener",
      "DependsOn":"ECSServiceRole",
      "Properties":{
        "DefaultActions":[
          {
            "Type":"forward",
            "TargetGroupArn":{
              "Ref":"ECSTG"
            }
          }
        ],
        "LoadBalancerArn":{
          "Ref":"ECSALB"
        },
        "Port":{
          "Ref":"ALBPORT"
        },
        "Protocol":{
          "Ref":"ALBPROTO"
        }
      }
    },
    "ECSALBListenerRule":{
      "Type":"AWS::ElasticLoadBalancingV2::ListenerRule",
      "DependsOn":"ALBListener",
      "Properties":{
        "Actions":[
          {
            "Type":"forward",
            "TargetGroupArn":{
              "Ref":"ECSTG"
            }
          }
        ],
        "Conditions":[
          {
            "Field":"host-pattern",
            "Values":[{
              "Ref":"HOST"
            }]
          }
        ],
        "ListenerArn":{
          "Ref":"ALBListener"
        },
        "Priority":{
          "Ref":"ALBPRIORITY"
        }
      }
    },
    "ECSTG":{
      "Type":"AWS::ElasticLoadBalancingV2::TargetGroup",
      "Properties":{
        "HealthCheckIntervalSeconds":10,
        "HealthCheckPath":{
          "Ref":"HEALTHCHECKPATH"
        },
        "HealthCheckProtocol":"HTTP",
        "HealthCheckTimeoutSeconds":5,
        "HealthyThresholdCount":2,
        "Name":"ECSTG",
        "UnhealthyThresholdCount":2,
        "VpcId":{
          "Ref":"VPCID"
        }
      }
    },
    "service":{
      "Type":"AWS::ECS::Service",
      "DependsOn":"ALBListener",
      "Properties":{
        "Cluster":{
          "Ref":"ECSCLUSTER"
        },
        "DesiredCount":"1",
        "LoadBalancers":[
          {
            "ContainerName":{
              "Ref": "CONTAINERNAME"
            },
            "ContainerPort":{
              "Ref": "CONTAINERPORT"
            },
            "TargetGroupArn":{
              "Ref":"ECSTG"
            }
          }
        ],
        "Role":{
          "Ref":"ECSServiceRole"
        },
        "TaskDefinition":{
          "Ref":"TASKDEFINITION"
        }
      }
    },
    "ECSServiceRole":{
      "Type":"AWS::IAM::Role",
      "Properties":{
        "AssumeRolePolicyDocument":{
          "Statement":[
            {
              "Effect":"Allow",
              "Principal":{
                "Service":[
                  "ecs.amazonaws.com"
                ]
              },
              "Action":[
                "sts:AssumeRole"
              ]
            }
          ]
        },
        "Path":"/",
        "Policies":[
          {
            "PolicyName":"ecs-service",
            "PolicyDocument":{
              "Statement":[
                {
                  "Effect":"Allow",
                  "Action":[
                    "elasticloadbalancing:DeregisterTargets",
                    "elasticloadbalancing:Describe*",
                    "elasticloadbalancing:RegisterTargets",
                    "ec2:Describe*",
                  ],
                  "Resource":"*"
                }
              ]
            }
          }
        ]
      }
    },
    "ServiceScalingTarget":{
      "Type":"AWS::ApplicationAutoScaling::ScalableTarget",
      "DependsOn":"service",
      "Properties":{
        "MaxCapacity":2,
        "MinCapacity":1,
        "ResourceId":{
          "Fn::Join":[
            "",
            [
              "service/",
              {
                "Ref":"ECSCLUSTER"
              },
              "/",
              {
                "Fn::GetAtt":[
                  "service",
                  "Name"
                ]
              }
            ]
          ]
        },
        "RoleARN":{
          "Fn::GetAtt":[
            "AutoscalingRole",
            "Arn"
          ]
        },
        "ScalableDimension":"ecs:service:DesiredCount",
        "ServiceNamespace":"ecs"
      }
    },
    "ServiceScalingPolicy":{
      "Type":"AWS::ApplicationAutoScaling::ScalingPolicy",
      "Properties":{
        "PolicyName":"AStepPolicy",
        "PolicyType":"StepScaling",
        "ScalingTargetId":{
          "Ref":"ServiceScalingTarget"
        },
        "StepScalingPolicyConfiguration":{
          "AdjustmentType":"PercentChangeInCapacity",
          "Cooldown":60,
          "MetricAggregationType":"Average",
          "StepAdjustments":[
            {
              "MetricIntervalLowerBound":0,
              "ScalingAdjustment":200
            }
          ]
        }
      }
    },
    "EC2Role":{
      "Type":"AWS::IAM::Role",
      "Properties":{
        "AssumeRolePolicyDocument":{
          "Statement":[
            {
              "Effect":"Allow",
              "Principal":{
                "Service":[
                  "ec2.amazonaws.com"
                ]
              },
              "Action":[
                "sts:AssumeRole"
              ]
            }
          ]
        },
        "Path":"/",
        "Policies":[
          {
            "PolicyName":"ecs-service",
            "PolicyDocument":{
              "Statement":[
                {
                  "Effect":"Allow",
                  "Action":[
                    "ecs:CreateCluster",
                    "ecs:DeregisterContainerInstance",
                    "ecs:DiscoverPollEndpoint",
                    "ecs:Poll",
                    "ecs:RegisterContainerInstance",
                    "ecs:StartTelemetrySession",
                    "ecs:Submit*",
                    "logs:CreateLogStream",
                    "logs:PutLogEvents"
                  ],
                  "Resource":"*"
                }
              ]
            }
          }
        ]
      }
    },
    "AutoscalingRole":{
      "Type":"AWS::IAM::Role",
      "Properties":{
        "AssumeRolePolicyDocument":{
          "Statement":[
            {
              "Effect":"Allow",
              "Principal":{
                "Service":[
                  "application-autoscaling.amazonaws.com"
                ]
              },
              "Action":[
                "sts:AssumeRole"
              ]
            }
          ]
        },
        "Path":"/",
        "Policies":[
          {
            "PolicyName":"service-autoscaling",
            "PolicyDocument":{
              "Statement":[
                {
                  "Effect":"Allow",
                  "Action":[
                    "application-autoscaling:*",
                    "cloudwatch:DescribeAlarms",
                    "cloudwatch:PutMetricAlarm",
                    "ecs:DescribeServices",
                    "ecs:UpdateService"
                  ],
                  "Resource":"*"
                }
              ]
            }
          }
        ]
      }
    }
  },
  "Parameters" : {
    "ALBPORT" : {
      "Type" : "Number",
      "Description" : "The port number on the ALB. Defaults to 80.",
      "AllowedValues" : [80,443],
      "Default": 80
    },
    "CONTAINERPORT" : {
      "Type" : "Number",
      "Description" : "The port number on the container to connect to. Defaults to 80.",
      "MaxValue": 32767,
      "Default": 80
    },
    "ALBPROTO" : {
      "Type" : "String",
      "Description" : "The Protocol for the Load Balancer. Defaults to HTTPS.",
      "AllowedValues" : ["HTTP","HTTPS"],
      "Default": "HTTP"
    },
    "ECSALB" : {
      "Type" : "String",
      "Description" : "The ARN for the Application Load Balancer used to route traffic to the container"
    },
    "HOST" : {
      "Type" : "String",
      "Description" : "The hostname the ALB will listen for traffic on."
    },
    "ALBPRIORITY" : {
      "Type" : "Number",
      "Description" : "The priority of this rule (1-100)",
      "MaxValue" : 100
    },
    "HEALTHCHECKPATH" : {
      "Type" : "String",
      "Description" : "The path to use for health checks on the container",
    },
    "VPCID" : {
      "Type" : "String",
      "Description" : "The VPCID this container will belong to",
    },
    "CONTAINERNAME" : {
      "Type" : "String",
      "Description" : "The container name",
      "AllowedPattern": "[a-z0-9\-]",
      "ConstraintDescription": "CONTAINERNAME must match [a-z0-9\-]"
    },
  },
  "Outputs":{
    "ecsservice":{
      "Value":{
        "Ref":"service"
      }
    },
    "taskdef":{
      "Value":{
        "Ref":"TASKDEFINITION"
      }
    }
  }
}
