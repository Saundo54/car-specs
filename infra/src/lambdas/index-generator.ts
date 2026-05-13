import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { CloudFrontClient, CreateInvalidationCommand } from "@aws-sdk/client-cloudfront";
import { VehicleSpec } from "../types";

const s3Client = new S3Client({});
const dbClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const cfClient = new CloudFrontClient({});

const TABLE_NAME = process.env.TABLE_NAME!;
const PROCESSED_BUCKET_NAME = process.env.PROCESSED_BUCKET_NAME!;
const DISTRIBUTION_ID = process.env.DISTRIBUTION_ID;

export const handler = async (event: any) => {
  console.log("Generating vehicle index...");

  try {
    // 5.1 Scan DynamoDB for summary records
    let lastEvaluatedKey: any = undefined;
    const indexRecords: any[] = [];

    do {
      const result = await dbClient.send(new ScanCommand({
        TableName: TABLE_NAME,
        ProjectionExpression: "pk, sk, make, model, year, variant, body_type, fuel_type, drivetrain, seats, ancap_rating",
        ExclusiveStartKey: lastEvaluatedKey,
      }));

      if (result.Items) {
        indexRecords.push(...result.Items);
      }
      lastEvaluatedKey = result.LastEvaluatedKey;
    } while (lastEvaluatedKey);

    const index = {
      version: new Date().toISOString().split("T")[0],
      generated: new Date().toISOString(),
      count: indexRecords.length,
      vehicles: indexRecords.map(r => ({
        id: `${r.pk}#${r.sk}`,
        make: r.make,
        model: r.model,
        year: r.year,
        variant: r.variant,
        body_type: r.body_type,
        fuel_type: r.fuel_type,
        drivetrain: r.drivetrain,
        seats: r.seats,
        ancap_rating: r.ancap_rating,
      })),
    };

    // 5.2 Store to S3
    const indexData = JSON.stringify(index);
    await s3Client.send(new PutObjectCommand({
      Bucket: PROCESSED_BUCKET_NAME,
      Key: "index/vehicles.json",
      Body: indexData,
      ContentType: "application/json",
      // Cache-control for CloudFront
      CacheControl: "public, max-age=3600",
    }));

    console.log(`Successfully generated index with ${index.count} vehicles.`);

    // 5.3 Invalidate CloudFront (if distribution ID is provided)
    if (DISTRIBUTION_ID) {
      await cfClient.send(new CreateInvalidationCommand({
        DistributionId: DISTRIBUTION_ID,
        InvalidationBatch: {
          CallerReference: `index-gen-${Date.now()}`,
          Paths: {
            Quantity: 1,
            Items: ["/index/vehicles.json"],
          },
        },
      }));
      console.log("CloudFront invalidation triggered.");
    }

    return { status: "success", count: index.count };
  } catch (error) {
    console.error("Index generation failed:", error);
    throw error;
  }
};
