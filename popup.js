document.getElementById('downloadImages').addEventListener('click', () => {
  console.log("Download Images button clicked in popup");

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ['content.js']
      }, () => {
        if (chrome.runtime.lastError) {
          console.error("Script injection failed: " + chrome.runtime.lastError.message);
        } else {
          console.log("Content script injected successfully");
        }
      });
    } else {
      console.error('No active tab found.');
    }
  });
});
  
document.getElementById('downloadZip').addEventListener('click', () => {
  console.log("Download Images as Zip button clicked in popup");

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: downloadImagesAsZip,
        args: [], // No additional arguments required
      });
    } else {
      console.error('No active tab found.');
    }
  });
});

// Function to be injected and run in the content script
function downloadImagesAsZip() {
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js';
  script.onload = () => {
    console.log("JSZip library loaded");

    console.log("Content script for Zip started");

    const container = document.querySelector('div.thumbnails.scroll-hide.svelte-1b19cri[data-testid="container_el"]');
    console.log("Container:", container);

    if (container) {
      const images = container.querySelectorAll('img.svelte-1b19cri');
      console.log("Found images:", images);

      const imageUrls = Array.from(images).map(img => img.src);
      console.log("Image URLs:", imageUrls);

      if (imageUrls.length > 0) {
        const zip = new JSZip();
        const imgFolder = zip.folder("images");

        const promises = imageUrls.map((url, index) =>
          fetch(url)
            .then(response => response.blob())
            .then(blob => {
              imgFolder.file(`image_${index + 1}.png`, blob);
              console.log(`Added image_${index + 1}.png to zip`);
            })
        );

        Promise.all(promises).then(() => {
          zip.generateAsync({ type: "blob" }).then((content) => {
            const zipUrl = URL.createObjectURL(content);
            const a = document.createElement("a");
            a.href = zipUrl;
            a.download = "images.zip";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(zipUrl);
            console.log("Zip file created and download started");
          });
        });
      } else {
        console.error('No images found in the container.');
      }
    } else {
      console.error('Container not found.');
    }
  };
  document.head.appendChild(script);
}
