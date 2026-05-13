import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { S3Event } from "aws-lambda";
import { VehicleSpec } from "../types";

const s3Client = new S3Client({});
const dbClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const TABLE_NAME = process.env.TABLE_NAME!;

export const handler = async (event: S3Event) => {
  for (const record of event.Records) {
    const bucket = record.s3.bucket.name;
    const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));

    console.log(`Processing ${bucket}/${key}`);

    try {
      const response = await s3Client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
      const rawData = JSON.parse(await response.Body?.transformToString() || "{}");

      // 4.1 & 4.2 Extract and Map
      const vehicleSpec = transformRawToSpec(rawData, key);

      // 4.3 Upsert to DynamoDB
      await dbClient.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: vehicleSpec,
      }));

      console.log(`Successfully upserted ${vehicleSpec.pk} / ${vehicleSpec.sk}`);
    } catch (error) {
      console.error(`Error processing ${key}:`, error);
    }
  }
};

function transformRawToSpec(raw: any, key: string): VehicleSpec {
  // Derive make, model, year, variant from key: raw/make/model/year/variant/data.json
  const parts = key.split("/");
  const make = parts[1];
  const model = parts[2];
  const year = parseInt(parts[3]);
  const variant = parts[4];

  const spec: VehicleSpec = {
    pk: `${make.toLowerCase()}#${model.toLowerCase()}`,
    sk: `${year}#${variant.toLowerCase()}`,
    make,
    model,
    year,
    variant: variant.replace(/-/g, " ").toUpperCase(), // Simple normalization
    body_type: "unknown", // To be extracted from tree
    fuel_type: "unknown", // To be extracted from tree
    drivetrain: "unknown", // To be extracted from tree
    seats: 0,
    specs: {
      mechanical: {},
      dimensions: {},
      exterior: {},
      interior: {},
      safety: {},
      technology: {},
    },
    source_url: `https://www.carsales.com.au/research/${make}/${model}/${year}/${variant}/`,
    last_updated: new Date().toISOString(),
    schema_version: "1.0",
  };

  // Helper to find components by ID/Title
  const findComponents = (root: any, predicate: (node: any) => boolean): any[] => {
    let results: any[] = [];
    if (predicate(root)) results.push(root);
    if (root.children && Array.isArray(root.children)) {
      for (const child of root.children) {
        results = results.concat(findComponents(child, predicate));
      }
    }
    if (root.child) {
      results = results.concat(findComponents(root.child, predicate));
    }
    return results;
  };

  // Extract specs from AccordionItems
  const accordions = findComponents(raw.root, (node) => node.type === "AccordionItem");
  
  for (const acc of accordions) {
    const category = acc.id.toLowerCase();
    const rows = findComponents(acc, (node) => node.type === "Stack" && node.direction === "vertical");

    for (const row of rows) {
      const labels = findComponents(row, (node) => node.type === "Text" && node.color === "foreground-extrasubtle");
      const values = findComponents(row, (node) => node.type === "Text" && node.color === "foreground-default");

      if (labels.length > 0 && values.length > 0) {
        const label = labels[0].value;
        const value = values[0].value;

        // Map to our categories
        if (category.includes("engine") || category.includes("transmission") || category.includes("mechanical")) {
          spec.specs.mechanical[label] = value;
          if (label === "Fuel type") spec.fuel_type = value.toLowerCase();
          if (label === "Drivetrain") spec.drivetrain = value.toLowerCase();
        } else if (category.includes("dimensions")) {
          spec.specs.dimensions[label] = value;
        } else if (category.includes("interior")) {
          spec.specs.interior[label] = value;
          if (label === "Seating capacity") spec.seats = parseInt(value);
        } else if (category.includes("exterior")) {
          spec.specs.exterior[label] = value;
        } else if (category.includes("safety")) {
          spec.specs.safety[label] = value;
        } else if (category.includes("technology")) {
          spec.specs.technology[label] = value;
        }
      }
    }
  }

  // Extract body type from breadcrumbs or title
  const titleNodes = findComponents(raw.root, (node) => node.type === "Text" && node.variant === "heading-1");
  if (titleNodes.length > 0) {
    const title = titleNodes[0].value.toLowerCase();
    if (title.includes("sedan")) spec.body_type = "sedan";
    else if (title.includes("suv")) spec.body_type = "suv";
    else if (title.includes("hatch")) spec.body_type = "hatch";
    else if (title.includes("ute")) spec.body_type = "ute";
    else if (title.includes("wagon")) spec.body_type = "wagon";
  }

  return spec;
}
