import logo from "./assets/robot.png";
import loadingImg from "./assets/loading.png";
import "./App.css";
import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { getAIImage, getNormalImages, triggerUnsplashDownload } from "./api";
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
  const [realImgOpacity, setRealImgOpacity] = useState(0);
  const [aiImgOpacity, setAiImgOpacity] = useState(0);
  const [scoreBackgroundColor, setScoreBackgroundColor] = useState("#76A5BE");
  const [scoreScale, setScoreScale] = useState("1.0");

  const [showWhy, setShowWhy] = useState(false);
  const [error, setError] = useState(false);

  const play = async () => {
    setShowButton(false);
    setLoading(true);
    setImages([]);
    setRealImgOpacity(0);
    setAiImgOpacity(0);
    setScoreBackgroundColor("#76A5BE");
    const topic = getTopic();

    let normalImgs = await tryForRealImages(topic, 3);
    console.log("got them back", normalImgs);

    let aiImages = await tryForAIImages(topic, 3);

    const imgs = createImgArray(normalImgs, aiImages);

    setTheme(topic.type);

    setImages(imgs);

    setTimeout(() => {
      setLoading(false);
      setRealImgOpacity(1);
      setAiImgOpacity(1);
    }, 200);
  };

  const tryForRealImages = async (topic, tries) => {
    let response = await getNormalImages(topic);
    console.log("[APP] response: ", response);
    if (response.status === "success") {
      return response.images;
    } else {
      if (tries > 0) {
        setTimeout(() => {
          tryForRealImages(topic, tries - 1);
        }, 2000);
      } else {
        setError(true);
        return [];
      }
    }
  };

  const tryForAIImages = async (topic, tries) => {
    let response = await getAIImage(topic);
    console.log("[APP] response: ", response);
    if (response.status === "success") {
      return response.images;
    } else {
      if (tries > 0) {
        setTimeout(() => {
          tryForAIImages(topic, tries - 1);
        }, 2000);
      } else {
        setError(true);
        return [];
      }
    }
  };

  const unspashUTM = "?utm_source=Which_Is_AI&utm_medium=referral";

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
        originalSrc: img.links.html,
        unspashUser: img.user.name,
        unspashUserSrc: img.user.links.html,
        downloadEndpoint: img.links.download_location,
      };
    });

    const imageSmall = randomAIImage.srcSmall;
    const lexica = randomAIImage.gallary;
    const imageLarge = randomAIImage.src;

    imgArr.push({
      url: imageSmall,
      isAI: true,
      lexica: lexica,
      originalSrc: imageLarge,
    });
    imgArr = imgArr.sort(() => Math.random() - 0.5);

    return imgArr;
  };

  const [showFooter, setShowFooter] = useState(false);

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
    // updateButtonColor(0);
  }, [updateButtonColor]);

  const scored = () => {
    const scoreMessage = ["You got it!", "Correct!", "Nice!", "Good job!"];
    // select a message at random
    const randomIndex = Math.floor(Math.random() * scoreMessage.length);
    const message = scoreMessage[randomIndex];
    setResultMessage(message);
    setScore(score + 1);
    setScoreScale("1.1");
    setTimeout(() => {
      setScoreScale("1.0");
    }, 500);
  };
  const disappearingScoreScale = (i) => {
    const scales = [
      "1.0",
      "0.9",
      "0.8",
      "0.7",
      "0.6",
      "0.5",
      "0.4",
      "0.3",
      "0.2",
      "0.1",
      "0.0",
      "1.0",
    ];
    const scale = scales[i];
    setScoreScale(scale);
    if (i < scales.length - 1) {
      setTimeout(() => {
        disappearingScoreScale(i + 1);
      }, 50);
    }
  };

  const downloadImage = async (e, downloadEndpoint, visitURL) => {
    e.preventDefault();
    const imgObj = await triggerUnsplashDownload(downloadEndpoint);
    console.log("[APP] image: ", imgObj);
    const imgUrl = imgObj.url;
    // visit the imgUrl
    window.open(imgUrl, "_blank");
  };

  const lose = () => {
    const loseMessage = ["Wrong!", "Nope!", "Incorrect!"];
    // select a message at random
    const randomIndex = Math.floor(Math.random() * loseMessage.length);
    let message = loseMessage[randomIndex];
    message += " start over!!";
    setResultMessage(message);
    setScore(0);
    disappearingScoreScale(0);
    setScoreBackgroundColor("#FF5733");
    setScoreScale("0.9");
  };

  return (
    <div>
      {!error && (
        <div>
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
                style={{
                  width: "75px",
                  borderRadius: "35px",
                  margin: "20px 0",
                }}
              />
              <h1 style={{ margin: 0, padding: 0 }}>Which Is AI</h1>
              <h3 style={{ margin: "15px", padding: 0 }}>The game</h3>
              <p style={{ margin: "5px 0", padding: 0, textAlign: "center" }}>
                Find the AI-generated image out of the images displayed
              </p>{" "}
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
            <div class="game-bar">
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
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
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={logo}
                  alt="logo"
                  style={{
                    width: "60px",
                    borderRadius: "35px",
                    margin: "5px 0",
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    backgroundColor: scoreBackgroundColor,
                    color: "white",
                    padding: "10px 20px",
                    borderRadius: "10px",
                    margin: "5px",
                    scale: scoreScale,
                  }}
                >
                  {score}
                </div>
                Score
              </div>
            </div>
          )}

          {!showButton && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}
              className="images-container"
            >
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
              <div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <h3 style={{ margin: "2px" }}>{resultMessage}</h3>
                  <div
                    onClick={() => {
                      setResultMessage(null);
                      play();
                    }}
                    onMouseOver={() => {
                      const button = document.getElementById("next-button");
                      button.style.scale = "1.1";
                    }}
                    onMouseLeave={() => {
                      const button = document.getElementById("next-button");
                      button.style.scale = "1";
                    }}
                    // add a nice blue  background
                    style={{
                      borderRadius: "10px",
                      textAlign: "center",
                      cursor: "pointer",
                      padding: "10px 20px",
                      margin: "5px",
                      backgroundColor: score > 0 ? "#325668" : "#FF5733",
                      color: "white",
                      opacity: resultMessage ? "1" : "0",
                    }}
                    id="next-button"
                  >
                    {score > 0 ? "NEXT IMAGE" : "PLAY AGAIN"}
                  </div>
                </div>
                {resultMessage ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexWrap: "wrap",
                      flexDirection: "row",
                    }}
                  >
                    {images.map((image, index) => (
                      <div key={index}>
                        <img
                          src={image.url}
                          key={index}
                          alt="winner"
                          style={{
                            margin: "10px",
                            position: "relative",
                            zIndex: 1,
                            opacity: 0.4,
                            padding: image.isAI ? "5px" : "0",
                            border: image.isAI ? "5px solid black" : "none",
                          }}
                          class="result-image"
                          id={`img-${index}`}
                        />

                        {image.isAI && (
                          <div
                            style={{
                              position: "absolute",
                              zIndex: 2,
                              top: document
                                .getElementById(`img-${index}`)
                                .getClientRects()[0].top,
                              left: document
                                .getElementById(`img-${index}`)
                                .getClientRects()[0].left,
                              width: document
                                .getElementById(`img-${index}`)
                                .getClientRects()[0].width,
                              height: document
                                .getElementById(`img-${index}`)
                                .getClientRects()[0].height,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexDirection: "column",
                            }}
                            class="image-info"
                          >
                            <p style={{ textAlign: "center" }}>
                              See <a href={image.originalSrc}>AI image</a> on{" "}
                              <a href="https://lexica.art/">Lexica.art</a>
                            </p>
                          </div>
                        )}
                        {!image.isAI && (
                          <div
                            style={{
                              position: "absolute",
                              zIndex: 2,
                              top: document
                                .getElementById(`img-${index}`)
                                .getClientRects()[0].top,
                              left: document
                                .getElementById(`img-${index}`)
                                .getClientRects()[0].left,
                              width: document
                                .getElementById(`img-${index}`)
                                .getClientRects()[0].width,
                              height: document
                                .getElementById(`img-${index}`)
                                .getClientRects()[0].height,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexDirection: "column",
                              opacity: 0.0,
                            }}
                            class="image-info"
                            id={`image-info-${index}`}
                            onMouseEnter={() => {
                              const info = document.getElementById(
                                `image-info-${index}`
                              );
                              info.style.opacity = "1";
                            }}
                            onMouseLeave={() => {
                              const info = document.getElementById(
                                `image-info-${index}`
                              );
                              info.style.opacity = "0";
                            }}
                          >
                            <p style={{ textAlign: "center", margin: "3px" }}>
                              See <a href={image.originalSrc}>image</a> (
                              <a
                                href={"_"}
                                onClick={(e) =>
                                  downloadImage(
                                    e,
                                    image.downloadEndpoint,
                                    image.originalSrc
                                  )
                                }
                              >
                                high quality
                              </a>
                              )
                            </p>
                            <p style={{ textAlign: "center", margin: "3px" }}>
                              By{" "}
                              <a href={image.unspashUserSrc + unspashUTM}>
                                {image.unspashUser}
                              </a>{" "}
                              on{" "}
                              <a href={"https://unsplash.com/" + unspashUTM}>
                                Unspash
                              </a>
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexWrap: "wrap",
                      flexDirection: "row",
                    }}
                  >
                    {images.map((image, index) => (
                      <img
                        src={image.url}
                        key={index}
                        alt="a game asset"
                        className="game-image"
                        style={{
                          margin: "10px",
                          cursor: "pointer",
                          opacity: image.isAI ? aiImgOpacity : realImgOpacity,
                        }}
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
                          setRealImgOpacity(0);

                          setTimeout(() => {
                            if (image.isAI) scored();
                            else lose();
                          }, 1000);
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {!showFooter && (
            <div
              style={{
                position: "fixed",
                width: "100%",
                bottom: 0,
                backgroundColor: "#ededed",
                fontSize: "12px",
                cursor: "pointer",
              }}
              onClick={() => {
                setShowFooter(true);
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "5px",
                }}
              >
                ^_^
              </div>
            </div>
          )}
          {showFooter && (
            <div
              style={{
                position: "fixed",
                width: "100%",
                bottom: 0,
                backgroundColor: "#ededed",
              }}
              onClick={(e) => {
                if (e.target.nodeName === "A") return;
                if (e.target.id === "follow") return;
                if (e.target.id === "why-game") return;
                if (e.target.id === "about-the-images") return;
                setShowFooter(false);
                setShowWhy(false);
              }}
            >
              <div>
                {true && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    {!showWhy && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          flexDirection: "row",
                          margin: "2px 0",
                          fontSize: "12px",
                        }}
                      >
                        <div
                          style={{
                            backgroundColor: "#76A5BE",
                            color: "white",
                            padding: "10px",
                            borderRadius: "10px",
                            margin: "5px 15px",
                            cursor: "pointer",
                            width: "100px",
                            textAlign: "center",
                          }}
                          onClick={() => {
                            setShowWhy(true);
                          }}
                          id="why-game"
                        >
                          Why a game?
                        </div>
                        <div
                          style={{
                            backgroundColor: "#76A5BE",
                            color: "white",
                            padding: "10px",
                            borderRadius: "10px",
                            margin: "5px 15px",
                            cursor: "pointer",
                            width: "100px",
                            textAlign: "center",
                          }}
                          onClick={() => {
                            window.open(
                              "https://twitter.com/josh_bickett/status/1594502446025277441?s=20&t=hdHNXW417Sw6VbAdw5_8Mg",
                              "_blank"
                            );
                          }}
                          id="follow"
                        >
                          Follow on Twitter
                        </div>
                      </div>
                    )}

                    {showWhy && (
                      <div>
                        <p style={{ textAlign: "center" }}>
                          Such an AI game can be more than it first appears...it
                          offers benchmarks for AI-generated content. <br />
                          <br />
                          We may imagine a future where people will not be able
                          to decipher AI generate content.
                          <br />
                          <br /> While we head to that future, games can track
                          the yard post for text, image, video, and music{" "}
                        </p>
                      </div>
                    )}

                    <div>⬇</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      {error && (
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
            style={{
              width: "75px",
              borderRadius: "35px",
              margin: "20px 0",
            }}
          />
          <h5 style={{ margin: 0, padding: 0 }}>Which Is AI</h5>

          <p style={{ margin: "5px 0", padding: 0, textAlign: "center" }}>
            We are currently experiencing technical issues. We are working on
            fixing it now!
          </p>
        </div>
      )}
    </div>
  );
};

export default App;
