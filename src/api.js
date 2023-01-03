const lexica_key = process.env.REACT_APP_LEXICA_KEY;
const unsplash_key = process.env.REACT_APP_UNSPASH_KEY;

const DEBUG = true;
export const getAIImage = async (search) => {
  return new Promise(async (resolve, reject) => {
    if (DEBUG) console.log("[api] search", search);
    let searchTerm = search.isPhoto ? "Photo of " + search.type : search.type;
    if (DEBUG) console.log("[api] searchTerm", searchTerm);

    const url = `https://lexica.art/api/v1/search?q=${searchTerm}`;

    try {
      let cookies = { secret: lexica_key };
      const cookieString = Object.entries(cookies)
        .map(([key, value]) => `${key}=${value}`)
        .join("; ");

      const response = await fetch(url, {
        method: "GET",
        credentials: "same-origin",
        headers: {
          // Set the "Cookie" header to the cookie string
          Cookie: cookieString,
        },
      });

      const data = await response.json();

      const images = data.images;
      // filter nsfw images
      const filteredImages = images
        .filter((img) => !img.nsfw)
        .filter((img) => !img.grid);

      if (DEBUG) console.log("[api] ai images", filteredImages);

      resolve({ status: "success", images: filteredImages });
    } catch (error) {
      console.log("[api] error", error);
      resolve({ status: "error", images: [] });
    }
  });
};

export const getNormalImages = async (search) => {
  if (DEBUG) console.log("[api] search.type", search.type);

  const url = `https://api.unsplash.com/search/photos?query=${search.type}&client_id=${unsplash_key}&content_filter=high&per_page=30`;

  // const url = `https://api.unsplash.com/search/photos?query=${search} cartoon&client_id=${key}`;
  // const url = `https://api.unsplash.com/search/photos?query=${search}&client_id=${key}`;
  return new Promise(async (resolve, reject) => {
    const response = await fetch(url);
    if (DEBUG) console.log("[api] response", response);
    let images;
    let status;
    try {
      const data = await response.json();
      images = data.results;
      status = "success";
    } catch (error) {
      console.log("[api] error", error);
      images = [];
      status = "error";
    }

    if (DEBUG) console.log("[api] normal images", images);
    resolve({ status, images });
  });
};

export const triggerUnsplashDownload = (endpoint) => {
  return new Promise(async (resolve, reject) => {
    const response = await fetch(endpoint + `&client_id=${unsplash_key}`);
    const data = await response.json();
    resolve(data);
  });
};
