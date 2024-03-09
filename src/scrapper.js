const TIME_OUT = 1000000;

async function scrapper(accountName) {
  
  console.log("Scrapping account : @", accountName);
  const url = "https://www.tiktok.com/@" + accountName;

  const script = require("./script")(url);

  let webpage = await script.create();

  // let videoArray = await webpage.start(); // Do this without async, so that the page starts scrolling
  setTimeout(async () => {
    await webpage.getUntil();
  }, 5000);

  // Check if videoArray is resolved (handles potential errors):
  let videoArray;
  try {
    videoArray = await webpage.start();
  } catch (error) {
    console.error("Error retrieving video array:", error);
    // Handle the error appropriately (e.g., retry, notify user)
    return null; // Exit the function if an error occurs
  }

  if (videoArray && videoArray.length > 0) {
    // videoArray has values, process them
    console.log("Video array:", videoArray);
    return videoArray
  } else {
    // videoArray is empty or not yet resolved
    console.log("Waiting for videos...");

    // Consider using a loop with a timeout or a more sophisticated waiting mechanism:
    const timeout = TIME_OUT; // Adjust timeout as needed
    let hasVideos = false;

    const checkForVideos = async () => {
      try {
        // Re-check for video array
        if (videoArray && videoArray.length > 0) {
          hasVideos = true;
          console.log("Video array:", videoArray);
          
        } else {
          console.log("Waiting for videos...");
        }
      } catch (error) {
        console.error("Error retrieving video array:", error);
      }
    };

    const intervalId = setInterval(checkForVideos, 3000); // Check every 3 second

    await new Promise((resolve) => {
      setTimeout(() => {
        clearInterval(intervalId);
        resolve(
          hasVideos ? "Videos found!" : "No videos found within timeout."
        );
      }, timeout);
    });
  }
}

module.exports = scrapper;