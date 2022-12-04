const topics = [
  { type: "tree", isPhoto: true },
  { type: "mountain", isPhoto: true },
  { type: "nature", isPhoto: true },
  { type: "flower", isPhoto: true },
  { type: "landscape", isPhoto: true },
  { type: "ocean", isPhoto: true },
  { type: "forest", isPhoto: true },
  { type: "desert", isPhoto: true },
  { type: "water", isPhoto: true },
  { type: "sky", isPhoto: true },
  { type: "beach", isPhoto: true },
  { type: "sun", isPhoto: true },
  { type: "moon", isPhoto: true },
  { type: "rain", isPhoto: true },
  { type: "snow", isPhoto: true },
  { type: "lightning", isPhoto: true },
  { type: "road", isPhoto: true },
  { type: "window", isPhoto: true },
  { type: "door", isPhoto: true },
  { type: "illustration", isPhoto: false },
  { type: "painting", isPhoto: false },
  { type: "photo", isPhoto: false },
  { type: "drawing", isPhoto: false },
];

export const getTopic = () => {
  // uncomment this line below to test a new topic
  // return { detail: "door", isPhoto: true };
  // select a random topic
  const randomTopic = topics[Math.floor(Math.random() * topics.length)];
  console.log("randomTopic", randomTopic);

  return randomTopic;
};
