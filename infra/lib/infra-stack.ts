import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as path from 'path';

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1.1 Define DynamoDB table
    const vehicleTable = new dynamodb.Table(this, 'VehicleTable', {
      tableName: 'carspec-vehicles',
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'sk', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // 1.2 Create S3 buckets
    const rawDataBucket = new s3.Bucket(this, 'RawDataBucket', {
      versioned: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    const processedDataBucket = new s3.Bucket(this, 'ProcessedDataBucket', {
      versioned: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // 1.3 Define SQS work queue
    const scraperQueue = new sqs.Queue(this, 'ScraperQueue', {
      visibilityTimeout: cdk.Duration.minutes(15),
      retentionPeriod: cdk.Duration.days(14),
    });

    // 1.4 Setup IAM roles / Lambda functions
    
    // Orchestrator: Sitemap -> SQS
    const orchestratorLambda = new lambdaNodejs.NodejsFunction(this, 'OrchestratorLambda', {
      entry: path.join(__dirname, '../src/lambdas/orchestrator.ts'),
      runtime: lambda.Runtime.NODEJS_20_X,
      timeout: cdk.Duration.minutes(5),
      environment: {
        QUEUE_URL: scraperQueue.queueUrl,
      },
    });
    scraperQueue.grantSendMessages(orchestratorLambda);

    // Scraper: SQS -> Taco API -> S3 Raw
    const scraperLambda = new lambdaNodejs.NodejsFunction(this, 'ScraperLambda', {
      entry: path.join(__dirname, '../src/lambdas/scraper.ts'),
      runtime: lambda.Runtime.NODEJS_20_X,
      timeout: cdk.Duration.minutes(15),
      memorySize: 512,
      environment: {
        RAW_BUCKET_NAME: rawDataBucket.bucketName,
      },
    });
    scraperQueue.grantConsumeMessages(scraperLambda);
    rawDataBucket.grantWrite(scraperLambda);

    // Transformer: S3 Raw -> Normalization -> DynamoDB
    const transformerLambda = new lambdaNodejs.NodejsFunction(this, 'TransformerLambda', {
      entry: path.join(__dirname, '../src/lambdas/transformer.ts'),
      runtime: lambda.Runtime.NODEJS_20_X,
      timeout: cdk.Duration.minutes(5),
      environment: {
        TABLE_NAME: vehicleTable.tableName,
        PROCESSED_BUCKET_NAME: processedDataBucket.bucketName,
      },
    });
    rawDataBucket.grantRead(transformerLambda);
    processedDataBucket.grantWrite(transformerLambda);
    vehicleTable.grantReadWriteData(transformerLambda);

    // Index Generator: DynamoDB -> S3 Index
    const indexGeneratorLambda = new lambdaNodejs.NodejsFunction(this, 'IndexGeneratorLambda', {
      entry: path.join(__dirname, '../src/lambdas/index-generator.ts'),
      runtime: lambda.Runtime.NODEJS_20_X,
      timeout: cdk.Duration.minutes(10),
      environment: {
        TABLE_NAME: vehicleTable.tableName,
        PROCESSED_BUCKET_NAME: processedDataBucket.bucketName,
      },
    });
    vehicleTable.grantReadData(indexGeneratorLambda);
    processedDataBucket.grantWrite(indexGeneratorLambda);

    // 6.2 Monitoring & Alarms
    new cloudwatch.Alarm(this, 'ScraperErrorAlarm', {
      metric: scraperLambda.metricErrors(),
      threshold: 1,
      evaluationPeriods: 1,
      alarmDescription: 'Scraper Lambda experienced an error.',
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
    });

    // SQS DLQ (Recommended for production, though not explicitly in tasks)
    const deadLetterQueue = new sqs.Queue(this, 'ScraperDLQ', {
      retentionPeriod: cdk.Duration.days(14),
    });

    new cloudwatch.Alarm(this, 'SQSDLQAlarm', {
      metric: deadLetterQueue.metricApproximateNumberOfMessagesVisible(),
      threshold: 1,
      evaluationPeriods: 1,
      alarmDescription: 'Messages in Scraper DLQ - investigation required.',
    });
  }
}
