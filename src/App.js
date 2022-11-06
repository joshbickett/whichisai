import logo from "./assets/robot.png";
import "./App.css";
import { useEffect, useState } from "react";

const App = () => {
  console.log("app");
  const gradient = [
    "#000000",
    "#191919",
    "#161616",
    "#141414",
    "#121212",
    "#0f0f0f",
    "#0d0d0d",
    "#0b0b0b",
    "#090909",
    "#070707",
    "#050505",
    "#030303",
    "#010101",
  ];

  const updateButton = () => {
    console.log("Button clicked");
  };

  const [buttonColor, setButtonColor] = useState(gradient[0]);

  useEffect(() => {
    // updateButtonColor(0, "up");
    console.log("test");
  }, []);

  const updateButtonColor = (index, direction) => {
    console.log("index", index);
    console.log("direction", direction);
    const newColor = gradient[index];
    console.log("newColor", newColor);
    setButtonColor(gradient[index]);
    if (index === gradient.length - 1) {
      console.log("updating direction to *down*");
      direction = "down";
    } else if (index === 0) {
      console.log("updating direction to *up*");
      direction = "up";
    }

    setTimeout(() => {
      if (direction === "up") {
        updateButtonColor(index + 1, "up");
      } else {
        // updateButtonColor(index - 1, "down");
      }
    }, 1000);
  };

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

      <div
        style={{
          fontSize: "50px",
          margin: "50px 0",
          padding: "25px",
          background: buttonColor,
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
      >
        PLAY
      </div>
    </div>
  );
};

export default App;
