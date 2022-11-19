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
  const ran = Math.round(Math.random());
  if (ran === 0) {
    const randomIndex = Math.floor(Math.random() * type.length);
    return { detail: type[randomIndex], isPhoto: true };
  } else {
    const randomIndex = Math.floor(Math.random() * theme.length);
    return { detail: theme[randomIndex], isPhoto: false };
  }
};
