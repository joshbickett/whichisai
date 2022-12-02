const type = [
  "tree",
  "mountain",
  "nature",
  "flower",
  "landscape",
  "ocean",
  "forest",
  "desert",
  "water",
  "sky",
  "beach",
  "sun",
  "moon",
  "rain",
  "snow",
  "lightning",
  "road",
];
const theme = ["illustration", "painting", "photo", "drawing"];

export const getTopic = () => {
  // return { detail: "road", isPhoto: true };
  const ran = Math.round(Math.random());
  if (ran === 0) {
    const randomIndex = Math.floor(Math.random() * type.length);

    return { detail: type[randomIndex], isPhoto: true };
  } else {
    const randomIndex = Math.floor(Math.random() * theme.length);

    return { detail: theme[randomIndex], isPhoto: false };
  }
};
