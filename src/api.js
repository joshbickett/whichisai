const key = process.env.REACT_APP_UNSPASH_KEY;

const DEBUG = true;
export const getAIImage = async (search) => {
  return new Promise(async (resolve, reject) => {
    if (DEBUG) console.log("[api] search", search);
    let searchTerm = search.isPhoto ? "Photo of " + search.type : search.type;
    if (DEBUG) console.log("[api] searchTerm", searchTerm);

    const url = `https://lexica.art/api/v1/search?q=${searchTerm}`;

    const response = await fetch(url);
    const data = await response.json();

    const images = data.images;
    // filter nsfw images
    const filteredImages = images.filter((img) => !img.nsfw);
    if (DEBUG) console.log("[api] ai images", filteredImages);

    resolve(filteredImages);
  });
};

export const getNormalImages = async (search) => {
  if (DEBUG) console.log("[api] search.type", search.type);

  const url = `https://api.unsplash.com/search/photos?query=${search.type}&client_id=${key}&content_filter=high&per_page=30`;

  // const url = `https://api.unsplash.com/search/photos?query=${search} cartoon&client_id=${key}`;
  // const url = `https://api.unsplash.com/search/photos?query=${search}&client_id=${key}`;
  return new Promise(async (resolve, reject) => {
    const response = await fetch(url);
    const data = await response.json();

    const images = data.results;
    if (DEBUG) console.log("[api] normal images", images);
    resolve(images);
  });
};
