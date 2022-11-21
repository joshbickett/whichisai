import logo from "./assets/robot.png";
import loadingImg from "./assets/loading.png";
import "./App.css";
import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { getAIImage, getNormalImages } from "./api";
import { getTopic } from "./topic";

const App = () => {
  const gradient = useMemo(
    () => [
      "#000000",
      "#0a0a0a",
      "#141414",
      "#1f1f1f",
      "#292929",
      "#333333",
      "#3d3d3d",
      "#474747",
      "#515151",
      "#5b5b5b",
      "#666666",
      "#707070",
      "#7a7a7a",
      "#848484",
      "#8e8e8e",
      "#999999",
    ],
    []
  );

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState("");
  const [resultMessage, setResultMessage] = useState(null);

  const play = async () => {
    setShowButton(false);
    setLoading(true);
    setImages([]);
    const topic = getTopic();

    let normalImgs = await getNormalImages(topic);
    let aiImages = await getAIImage(topic);

    const imgs = createImgArray(normalImgs, aiImages);

    setTimeout(() => {
      setTheme(topic.detail);
      setLoading(false);
      setImages(imgs);
    }, 2000);
  };

  const createImgArray = (normalImages, aiImages) => {
    let randomIndex = Math.floor(Math.random() * aiImages.length);
    let randomAIImage = aiImages[randomIndex];

    // add 10 of the random normal images into an array and don't allow duplicates
    let normalImgs = [];
    for (let i = 0; i < 5; i++) {
      let randomIndex = Math.floor(Math.random() * normalImages.length);
      let randomNormalImage = normalImages[randomIndex];

      if (!normalImgs.includes(randomNormalImage)) {
        normalImgs.push(randomNormalImage);
      }
    }

    let imgArr = normalImgs.map((img) => {
      return {
        url: img.urls.small,
        isAI: false,
      };
    });

    const imageSmall = randomAIImage.srcSmall;

    imgArr.push({
      url: imageSmall,
      isAI: true,
    });
    imgArr = imgArr.sort(() => Math.random() - 0.5);

    return imgArr;
  };

  const [showButton, setShowButton] = useState(true);
  const [score, setScore] = useState(0);
  const showButtonRef = useRef(showButton);
  showButtonRef.current = showButton;

  const directionRef = useRef("up");

  const updateButtonColor = useCallback(
    (index) => {
      if (!showButtonRef.current) return;
      const newColor = gradient[index];

      document.getElementById("play-button").style.backgroundColor = newColor;

      if (index === gradient.length - 1) directionRef.current = "down";
      else if (index === 0) directionRef.current = "up";

      setTimeout(() => {
        if (directionRef.current === "up") updateButtonColor(index + 1);
        else updateButtonColor(index - 1);
      }, 50);
    },
    [gradient]
  );

  useEffect(() => {
    updateButtonColor(0);
  }, [updateButtonColor]);

  const scored = () => {
    const scoreMessage = ["You got it!", "Correct!", "Nice!", "Good job!"];
    // select a message at random
    const randomIndex = Math.floor(Math.random() * scoreMessage.length);
    const message = scoreMessage[randomIndex];
    setResultMessage(message);
    setScore(score + 1);
  };

  const lose = () => {
    const loseMessage = ["Wrong!", "Nope!", "Incorrect!"];
    // select a message at random
    const randomIndex = Math.floor(Math.random() * loseMessage.length);
    let message = loseMessage[randomIndex];
    message += " start over!!";
    setResultMessage(message);
    setScore(0);
  };

  return (
    <div style={{ height: "1000px" }}>
      {showButton && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            margin: "30px 10px",
          }}
        >
          <img
            src={logo}
            alt="logo"
            style={{ width: "75px", borderRadius: "35px", margin: "20px 0" }}
          />

          <h1 style={{ margin: 0, padding: 0 }}>WhichIsAI</h1>
          <h3 style={{ margin: "15px", padding: 0 }}>The game</h3>

          <p style={{ margin: "5px 0", padding: 0, textAlign: "center" }}>
            Find the AI-generated image out of the images displayed
          </p>

          <button
            style={{
              fontSize: "50px",
              margin: "50px 0",
              padding: "25px",
              backgroundColor: gradient[0],
              color: "white",
              borderRadius: "10px",
              cursor: "pointer",
            }}
            onMouseEnter={() => {
              const button = document.getElementById("play-button");
              button.style.scale = "1.1";
            }}
            onMouseLeave={() => {
              const button = document.getElementById("play-button");
              button.style.scale = "1";
            }}
            id="play-button"
            onClick={() => play()}
          >
            PLAY
          </button>
        </div>
      )}
      {theme && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-around",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            Theme
            <div
              style={{
                backgroundColor: "#181D20",
                color: "white",
                padding: "10px 20px",
                borderRadius: "10px",
                margin: "5px",
              }}
            >
              {theme}
            </div>
          </div>
          <img
            src={logo}
            alt="logo"
            style={{ width: "75px", borderRadius: "35px", margin: "20px 0" }}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            Score
            <div
              style={{
                backgroundColor: "#76A5BE",
                color: "white",
                padding: "10px 20px",
                borderRadius: "10px",
                margin: "5px",
              }}
            >
              {score}
            </div>
          </div>
        </div>
      )}

      {!showButton && !resultMessage && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
          className="images-container"
        >
          {images.map((image, index) => (
            <img
              src={image.url}
              key={index}
              alt="logo"
              style={{ width: "150px", margin: "10px", cursor: "pointer" }}
              onMouseEnter={() => {
                const img = document.getElementById(`img-${index}`);
                img.style.scale = "1.1";
              }}
              onMouseLeave={() => {
                const img = document.getElementById(`img-${index}`);
                img.style.scale = "1";
              }}
              id={`img-${index}`}
              onClick={() => {
                console.log("clicked");
                console.log("image", image);

                if (image.isAI) scored();
                else lose();
              }}
            />
          ))}
          {loading && (
            <img
              src={loadingImg}
              alt="loading"
              className="App-loading"
              style={{
                width: "100px",
                height: "100px",
                border: "50%",
                margin: "50px",
              }}
            />
          )}
        </div>
      )}
      {resultMessage && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h3>{resultMessage}</h3>
          {images
            .filter((image) => image.isAI)
            .map((image, index) => (
              <img
                src={image.url}
                key={index}
                alt="winner"
                style={{ width: "150px", margin: "10px" }}
              />
            ))}

          <div
            onClick={() => {
              setResultMessage(null);
              play();
            }}
            // add a nice blue  background
            style={{
              borderRadius: "10px",
              cursor: "pointer",
              padding: "10px",
              backgroundColor: "black",
              color: "white",
            }}
          >
            Next
          </div>
        </div>
      )}
      <div
        style={{
          position: "fixed",
          width: "100%",
          bottom: 0,
          backgroundColor: "#D3D3D3",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "10px 0",
            fontSize: "12px",
          }}
        >
          <p style={{ textAlign: "center" }}>
            Side project by <a href="https://bickett.ai/">Josh Bickett</a>.
            Follow on Twitter
            <a href="https://twitter.com/josh_bickett"> @josh_bickett</a>. Real
            images provided by Unsplash under the
            <a href="https://unsplash.com/license"> Unsplash License</a>. AI
            images from <a href="https://lexica.art/">Lexica.art</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
