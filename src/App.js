import logo from "./assets/robot.png";
import "./App.css";

function App() {
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
    "#000000",
  ];

  const updateButton = () => {
    console.log("Button clicked");
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
      <h1 style={{ margin: "10px 0", padding: 0 }}>Weird Web</h1>
      <h3 style={{ margin: 0, padding: 0 }}>The game</h3>

      <p>Find the AI-generated image out of the images displayed</p>
      <div style={{ fontsize: "25px", margin: "50px 0" }} id="play-button">
        PLAY
      </div>
    </div>
  );
}

export default App;
