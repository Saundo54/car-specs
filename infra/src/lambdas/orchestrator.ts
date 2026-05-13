import { SQSClient, SendMessageBatchCommand } from "@aws-sdk/client-sqs";
import axios from "axios";
import { XMLParser } from "fast-xml-parser";

const sqsClient = new SQSClient({});
const QUEUE_URL = process.env.QUEUE_URL!;

export const handler = async (event: any) => {
  console.log("Starting orchestrator...");

  try {
    // 2.1 Fetch Research Sitemap Index
    const sitemapIndexUrl = "https://www.carsales.com.au/sitemaps/carsales/ResearchMakeModelPage.xml";
    const indexResponse = await axios.get(sitemapIndexUrl);
    const parser = new XMLParser();
    const indexData = parser.parse(indexResponse.data);

    // Get the latest sitemap (usually just one in this case)
    const sitemaps = Array.isArray(indexData.sitemapindex.sitemap) 
      ? indexData.sitemapindex.sitemap 
      : [indexData.sitemapindex.sitemap];

    for (const sitemap of sitemaps) {
      console.log(`Processing sitemap: ${sitemap.loc}`);
      const sitemapResponse = await axios.get(sitemap.loc);
      const sitemapData = parser.parse(sitemapResponse.data);

      const urls = Array.isArray(sitemapData.urlset.url)
        ? sitemapData.urlset.url
        : [sitemapData.urlset.url];

      // 2.2 Filter URLs for depth 9 and years >= 2018
      const variantUrls = urls
        .map((u: any) => u.loc)
        .filter((url: string) => {
          const parts = url.split("/");
          // Depth 9 = 8 slashes (e.g., https://www.carsales.com.au/research/make/model/year/variant/)
          if (parts.length !== 9) return false;

          const year = parseInt(parts[6]);
          return !isNaN(year) && year >= 2018;
        });

      console.log(`Found ${variantUrls.length} variant URLs to process.`);

      // 2.3 Enqueue URLs to SQS in batches
      // Note: We use batches to be efficient, and the SQS visibility timeout/drip-feed
      // handles the overall rate limiting.
      for (let i = 0; i < variantUrls.length; i += 10) {
        const batch = variantUrls.slice(i, i + 10).map((url, index) => ({
          Id: `msg-${i}-${index}`,
          MessageBody: url,
        }));

        await sqsClient.send(new SendMessageBatchCommand({
          QueueUrl: QUEUE_URL,
          Entries: batch,
        }));
      }
    }

    return { status: "success", message: "All URLs enqueued" };
  } catch (error) {
    console.error("Orchestrator failed:", error);
    throw error;
  }
};
