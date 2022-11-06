const key = process.env.UNSPASH_KEY;
const secret = process.env.UNSPASH_SECRET;

export const getAIImage = async (search) => {
  // make a GET request to the following endpoint => https://lexica.art/api/v1/search?q=apples
  // const url = `https://lexica.art/api/v1/search?q=${search}`;
  return new Promise(async (resolve, reject) => {
    const url = `https://lexica.art/api/v1/search?q=books`;

    const response = await fetch(url);
    const data = await response.json();
    console.log("data", data);

    const images = data.images;
    resolve(images);
  });
};

export const getNormalImages = async (search) => {
  console.log("key", key);
  console.log("secret", secret);
  // GET /search/photos
  const url = `https://api.unsplash.com/search/photos?query=books&client_id=${key}`;
  return new Promise(async (resolve, reject) => {
    const response = await fetch(url);
    const data = await response.json();
    console.log("data", data);

    const images = data.results;
    resolve(images);
  });
};
