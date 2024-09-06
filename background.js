chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "downloadImages" && message.urls) {
    console.log("Downloading images:", message.urls);

    message.urls.forEach((url, index) => {
      chrome.downloads.download({
        url: url,
        filename: `image_${index + 1}.png`,
        conflictAction: 'uniquify',
        saveAs: false
      }, (downloadId) => {
        if (chrome.runtime.lastError) {
          console.error('Download failed:', chrome.runtime.lastError.message);
        } else {
          console.log('Download started with ID:', downloadId);
        }
      });
    });
  }
});
