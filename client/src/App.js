import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [json, setJson] = useState([]);
  //const questionId = 10;
  const [imageUrl1, setImageUrl1] = useState("");
  const [imageUrl2, setImageUrl2] = useState("");
  const [clickedImage, setClickedImage] = useState(null);

  const fetchImage = async (fileUrl, id) => {
    try {
      const response = await fetch("http://localhost:8000/api/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: fileUrl }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch image");
      }
      console.log(response);
      const blob = await response.blob();
      id === 1
        ? setImageUrl1(URL.createObjectURL(blob))
        : setImageUrl2(URL.createObjectURL(blob));
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  const setImage = (choice) => {
    if (choice === "Yes") {
      debugger;
      fetchImage(json["Card URL Download"], 1);
      fetchImage(json["No Card URL Download"], 2);
    } else {
      fetchImage(json["Card URL Download"], 1);
      fetchImage(json["No Card URL Download"], 2);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    console.log(urlParams);
    const id = urlParams.get("question_id");

    const fetchDriveLink = async (id) => {
      try {
        const response = await fetch(
          "https://hook.eu2.make.com/euacc8b4yjgdg7586h71nulounbju967",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ question_id: id }),
          }
        );

        const data = await response.json();
        setJson(data);
      } catch (error) {
        console.error("Error fetching the Google Drive link:", error);
      }
    };

    fetchDriveLink(id);
  }, []);

  useEffect(() => {
    if (json["Card URL Download"]) {
      fetchImage(json["QCardYesDirect"], 1);
      fetchImage(json["QCardNoDirect"], 2);
    }
  }, [json]);

  return (
    <div className="App">
      {imageUrl1 && imageUrl2 ? (
        <div className="cards">
          <img
            className={clickedImage === 1 ? "imageClicked" : "Image"}
            src={imageUrl1}
            alt="Google Drive Image"
            onClick={() => {
              setImage("Yes");
              setClickedImage(1);
            }}
          />
          <img
            className={clickedImage === 2 ? "imageClicked" : "Image"}
            src={imageUrl2}
            alt="Google Drive Image"
            onClick={() => {
              setImage("No");
              setClickedImage(2);
            }}
          />
        </div>
      ) : (
        <p>Loading images...</p>
      )}
    </div>
  );
}

export default App;
