import logo from "./assets/robot.png";
import loadingImg from "./assets/loading.png";
import "./App.css";
import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { getAIImage, getNormalImages } from "./api";

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

  const startGame = async () => {
    setShowButton(false);
    setLoading(true);
    console.log("Button clicked");
    let normalImgs = await getNormalImages();
    let aiImages = await getAIImage();
    console.log("ai images", aiImages);

    const imgs = createImgArray(normalImgs, aiImages);
    console.log("updated imgs", imgs);

    setTimeout(() => {
      setLoading(false);
      setImages(imgs);
    }, 2000);
  };

  const createImgArray = (normalImgs, aiImages) => {
    console.log("createImgArray");
    // pick one of the aiImages at random
    let randomIndex = Math.floor(Math.random() * aiImages.length);
    let randomAIImage = aiImages[randomIndex];
    // reformat normalImg array
    let imgArr = normalImgs.map((img) => {
      return {
        url: img.urls.small,
        isAI: false,
      };
    });
    imgArr.push({
      url: randomAIImage.srcSmall,
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
        margin: "100px 20px",
      }}
    >
      <img
        src={logo}
        alt="logo"
        style={{ width: "100px", borderRadius: "35px" }}
      />
      <h1 style={{ margin: 0, padding: 0 }}>Weird Web</h1>
      <h3 style={{ margin: "15px", padding: 0 }}>The game</h3>
      <p style={{ margin: 0, padding: 0 }}>
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
              class="App-loading"
              style={{ width: "100px", height: "100px", border: "50%" }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default App;
