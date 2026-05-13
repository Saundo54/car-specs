import axios from "axios";

async function verify() {
  const targetUrl = "https://www.carsales.com.au/research/toyota/camry/2023/ascent/";
  const apiUrl = targetUrl.replace(
    "https://www.carsales.com.au/research/",
    "https://www.carsales.com.au/_api/taco-makemodel/research/"
  );

  console.log(`Verifying scraper path for: ${targetUrl}`);
  console.log(`Targeting API: ${apiUrl}`);

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        "User-Agent": "Gemini-Deep-Research",
        "Referer": targetUrl,
      },
    });

    console.log("SUCCESS: Received response from Taco API.");
    console.log(`Status: ${response.status}`);
    
    // Check for some expected data
    const raw = response.data;
    const title = raw.root.children[1].child.children[0].children[0].children[0].children[0].value;
    console.log(`Page Title: ${title}`);
    
    if (title.toLowerCase().includes("toyota camry ascent")) {
      console.log("VERIFICATION PASSED: Data matches expected vehicle.");
    } else {
      console.warn("VERIFICATION WARNING: Title doesn't match perfectly. Check manual logs.");
    }
  } catch (error: any) {
    console.error("VERIFICATION FAILED:");
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Data: ${JSON.stringify(error.response.data)}`);
    } else {
      console.error(error.message);
    }
  }
}

verify();
