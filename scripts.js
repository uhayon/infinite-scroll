const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');

let loadedFinished = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];

// Unsplash API
let imagesCountToFetch = 5;
const API_KEY = 'zWP9NA50NnJTd3LvRHdj1XzmXRvcFrOCbogIB_Weavo';
const COLLECTIONS = 'travel,food-drink';
const API_URL = `https://api.unsplash.com/photos/random/?client_id=${API_KEY}&collections=${COLLECTIONS}`;

// Check if all images where loaded
function imageLoaded() {
  imagesLoaded++;
  loadedFinished = imagesLoaded === totalImages;
  loader.hidden = loadedFinished;

  // After making the first request, we fetch 30 photos instead of 5
  // The initial amount (5) was selected by performance issues
  imagesCountToFetch = 30;
}

// Helper function to set attributes on DOM elements
function setAttributes(element, attributes) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

// Create Elements for Links & Photos, add to DOM
function displayPhotos() {
  totalImages = photosArray.length;
  imagesLoaded = 0;

  photosArray.forEach(photo => {
    // Create the anchor tag
    const item = document.createElement('a');
    setAttributes(item, {
      href: photo.links.html,
      target: '_blank',
    });

    // Create the image
    const img = document.createElement('img');
    setAttributes(img, {
      src: photo.urls.regular,
      alt: photo.alt_description,
      title: photo.alt_description,
    });

    // Event listener, check when each is finished loading
    img.addEventListener('load', imageLoaded);

    // Put <img> inside <a>, then both inside the imageContainer
    item.appendChild(img);
    imageContainer.appendChild(item);
  });
}

// Get photos from Unsplash API
async function getPhotos() {
  try {
    const response = await fetch(`${API_URL}&count=${imagesCountToFetch}`);
    photosArray = await response.json();
    displayPhotos();
  } catch (err) {
    console.log(err);
  }
}

// Check to see if scrolling near bottom of page, load more photos
window.addEventListener('scroll', () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 &&
    loadedFinished
  ) {
    loadedFinished = false;
    getPhotos();
  }
});

// On Load
getPhotos();
