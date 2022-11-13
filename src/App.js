import logo from "./assets/robot.png";
import loadingImg from "./assets/loading.png";
import "./App.css";
import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { getAIImage, getNormalImages } from "./api";
import { getTheme } from "./theme";

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

  const startGame = async () => {
    setShowButton(false);
    setLoading(true);
    const newTheme = getTheme();

    let normalImgs = await getNormalImages(newTheme);
    let aiImages = await getAIImage(newTheme);

    const imgs = createImgArray(normalImgs, aiImages);

    setTimeout(() => {
      setTheme(newTheme);
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

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        margin: "50px 20px",
      }}
    >
      <img
        src={logo}
        alt="logo"
        style={{ width: "100px", borderRadius: "35px", margin: "15px 0" }}
      />

      <h1 style={{ margin: 0, padding: 0 }}>WhichAI</h1>
      {showButton && <h3 style={{ margin: "15px", padding: 0 }}>The game</h3>}

      <p style={{ margin: "5px 0", padding: 0 }}>
        Find the AI-generated image out of the images displayed
      </p>

      {showButton && (
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
          onClick={() => startGame()}
        >
          PLAY
        </button>
      )}
      {theme && (
        <div
          style={{
            backgroundColor: "gray",
            color: "white",
            padding: "10px 20px",
            borderRadius: "10px",
            margin: "25px 0",
          }}
        >
          {theme}
        </div>
      )}
      {!showButton && (
        <div
          style={{
            margin: "50px 100px",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
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
                if (image.isAI) {
                  alert("You win!");
                } else {
                  alert("You lose!");
                }
              }}
            />
          ))}
          {loading && (
            <img
              src={loadingImg}
              alt="loading"
              className="App-loading"
              style={{ width: "100px", height: "100px", border: "50%" }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default App;
