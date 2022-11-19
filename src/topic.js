// const themes = [
//   "anime",
//   "cartoon",
//   "illustration",
//   "vector",
//   "photo",
//   "drawing",
//   "painting",
//   "digital",
//   "art",
//   "graphic",
//   "design",
//   "line art",
//   "sketch",
// ];

const type = ["city", "tree"];
const theme = ["illustration", "painting", "anime"];

export const getTopic = () => {
  // choose between 1 and 0 randomly.

  const ran = Math.round(Math.random());
  if (ran === 0) {
    const randomIndex = Math.floor(Math.random() * type.length);
    return type[randomIndex];
  } else {
    const randomIndex = Math.floor(Math.random() * theme.length);
    return theme[randomIndex];
  }
};
