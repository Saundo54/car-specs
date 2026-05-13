import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import axios from "axios";
import { SQSEvent } from "aws-lambda";

const s3Client = new S3Client({});
const RAW_BUCKET_NAME = process.env.RAW_BUCKET_NAME!;

const USER_AGENT = "Gemini-Deep-Research"; // 3.2 Whitelisted User-Agent

export const handler = async (event: SQSEvent) => {
  console.log(`Processing batch of ${event.Records.length} messages...`);

  for (const record of event.Records) {
    const variantUrl = record.body;
    console.log(`Scraping: ${variantUrl}`);

    // 3.1 Derive Taco API URL from Research URL
    // Pattern: https://www.carsales.com.au/research/make/model/year/variant/
    // API: https://www.carsales.com.au/_api/taco-makemodel/research/make/model/year/variant/
    const apiUrl = variantUrl.replace(
      "https://www.carsales.com.au/research/",
      "https://www.carsales.com.au/_api/taco-makemodel/research/"
    );

    try {
      // 3.4 Implement retries with back-off
      const response = await fetchWithRetry(apiUrl, variantUrl);
      
      // 3.3 Store raw JSON to S3
      const key = `raw/${variantUrl.replace("https://www.carsales.com.au/research/", "")}data.json`;
      await s3Client.send(new PutObjectCommand({
        Bucket: RAW_BUCKET_NAME,
        Key: key,
        Body: JSON.stringify(response.data),
        ContentType: "application/json",
      }));

      console.log(`Successfully stored raw data to s3://${RAW_BUCKET_NAME}/${key}`);
    } catch (error: any) {
      console.error(`Failed to scrape ${variantUrl}:`, error.message);
      // In a real SQS consumer, we might want to throw to trigger a retry via SQS visibility timeout
      // but for this MVP, we'll log and move on to the next message in the batch.
    }
  }
};

async function fetchWithRetry(url: string, referer: string, retries = 3): Promise<any> {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await axios.get(url, {
        headers: {
          "User-Agent": USER_AGENT,
          "Referer": referer,
        },
        timeout: 10000,
      });
    } catch (error: any) {
      attempt++;
      if (error.response?.status === 429 && attempt < retries) {
        const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
        console.warn(`Rate limited (429). Retrying in ${Math.round(delay)}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
}
