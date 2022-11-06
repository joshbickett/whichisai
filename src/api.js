const key = process.env.REACT_APP_UNSPASH_KEY;

export const getAIImage = async (search) => {
  return new Promise(async (resolve, reject) => {
    const url = `https://lexica.art/api/v1/search?q=${search}`;

    const response = await fetch(url);
    const data = await response.json();
    console.log("data", data);

    const images = data.images;
    resolve(images);
  });
};

export const getNormalImages = async (search) => {
  console.log("key", key);

  const url = `https://api.unsplash.com/search/photos?query=${search}&client_id=${key}`;
  return new Promise(async (resolve, reject) => {
    const response = await fetch(url);
    const data = await response.json();
    console.log("data", data);

    const images = data.results;
    resolve(images);
  });
};
