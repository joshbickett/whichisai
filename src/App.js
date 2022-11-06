import logo from "./assets/robot.png";
import "./App.css";
import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { getAIImage } from "./api";

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

  const startGame = async () => {
    setShowButton(false);
    console.log("Button clicked");
    const img = await getAIImage();
    console.log("images123", images);
    setImages(img);
  };

  const [images, setImages] = useState([]);

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
      }, 20);
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
      {!showButton &&
        images &&
        images.map((image, index) => (
          <img
            src={image.src}
            key={index}
            alt="logo"
            style={{ width: "100px", borderRadius: "35px" }}
          />
        ))}
    </div>
  );
};

export default App;
