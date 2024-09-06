const script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js';
document.head.appendChild(script);

console.log("Content script loaded");

const container = document.querySelector('div.thumbnails.scroll-hide.svelte-1b19cri[data-testid="container_el"]');
console.log("Container:", container);

if (container) {
  const images = container.querySelectorAll('img.svelte-1b19cri');
  console.log("Found images:", images);

  const imageUrls = Array.from(images).map(img => img.src);
  console.log("Image URLs:", imageUrls);

  if (imageUrls.length > 0) {
    chrome.runtime.sendMessage({ action: "downloadImages", urls: imageUrls });
    console.log("Image URLs sent to background script");
  } else {
    console.error('No images found in the container.');
  }
} else {
  console.error('Container not found.');
}
