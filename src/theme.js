const themes = [
  "anime",
  "cartoon",
  "illustration",
  "vector",
  "photo",
  "drawing",
  "painting",
  "digital",
  "art",
  "graphic",
  "design",
  "line art",
  "sketch",
];

export const getTheme = () => {
  // return a random topic
  let theme = themes[Math.floor(Math.random() * themes.length)];
  return theme;
};
