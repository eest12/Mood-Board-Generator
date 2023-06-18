import './App.css';
import { useEffect, useReducer, useState } from "react";
import tinycolor from "tinycolor2";
import { Card } from "./components/Card/Card.js";
import { Board, BOARD_MAX_SIZE, downloadScreenshot } from "./components/Board/Board.js";

let LAST_CARD_ID = 0; // increments when a card is added to the board

/**
 * Main function that generates the app content.
 * @returns App element, which contaings all the contents of the app.
 */
function App() {
  const ColorGroups = Object.freeze({
    Any: "any",
    Pastel: "pastel",
    Bright: "bright",
    Dull: "dull",
    Gray: "gray"
  });

  const netlifyFuncPath = "/.netlify/functions/fetch-unsplash";

  const [quoteData, setQuoteData] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { quotes: null, quoteIndex: 0 }
  ); // set consisting of a list of all quotes and a quote index for the quote currently being previewed

  const [error, setError] = useState(null); // error message from any fetch call
  const [loading, setLoading] = useState(false); // whether data is being fetched
  const [image, setImage] = useState(null); // card background image
  const [color, setColor] = useState(null); // card background color
  const [isImgBG, setIsImgBG] = useState(true); // whether card background is an image (vs. solid color)
  const [colorGroup, setColorGroup] = useState(ColorGroups.Any);
  const [boardCards, setBoardCards] = useState([]); // cards added to the board
  const [selectedCard, setSelectedCard] = useState(null); // card selected in the board by the user

  // Requests an image from the Unsplash API
  const fetchImage = () => {
    const apiImageId = "image";
    fetch(`${netlifyFuncPath}?id=${apiImageId}`)
      .then((res) => res.json())
      .then((res) => setImage(res["data"]))
      .catch((err) => setError(err));
  };

  // Triggers a download as required by the Unsplash API Guidelines.
  // Calls an event endpoint to increment the number of downloads a photo has.
  const unsplashDownload = () => {
    const apiDownloadId = "download";
    fetch(`${netlifyFuncPath}?id=${apiDownloadId}&downloadLocation=${image.links.download_location}`)
      .then((res) => console.log(res));
  }

  /**
 * Generates a random index for the given data.
 * @param {*} data An array to get a random index for.
 * @returns A positive integer less than the size of the data parameter, or -1 if data is empty or null.
 */
  const getRandomIndex = (data) => {
    if (data && data.length > 0) {
      return Math.floor(Math.random() * data.length);
    }
    return -1;
  };

  /**
 * Generates a random color.
 * @returns A string representing a color in RGB format.
 */
  const getRandomColor = () => {
    const getRandomRgbInt = () => Math.floor(Math.random() * 256);
    let colorObj;

    switch (colorGroup) {
      case ColorGroups.Any:
        return `rgb(${getRandomRgbInt()}, ${getRandomRgbInt()}, ${getRandomRgbInt()})`;

      case ColorGroups.Pastel:
        colorObj = tinycolor({ r: getRandomRgbInt(), g: getRandomRgbInt(), b: getRandomRgbInt() });
        colorObj.saturate(10);
        colorObj = tinycolor.mix(colorObj, tinycolor("white"));
        return colorObj.toRgbString();

      case ColorGroups.Bright:
        colorObj = tinycolor({ h: getRandomRgbInt(), s: 100, l: 50 });
        return colorObj.toRgbString();

      case ColorGroups.Dull:
        colorObj = tinycolor({ r: getRandomRgbInt(), g: getRandomRgbInt(), b: getRandomRgbInt() });
        colorObj = tinycolor.mix(colorObj, tinycolor("black")).desaturate(10);
        return colorObj.toRgbString();

      case ColorGroups.Gray:
        let randomNum = getRandomRgbInt();
        colorObj = tinycolor({ r: randomNum, g: randomNum, b: randomNum});
        return colorObj.toRgbString();

      default:
        return "rgb(0, 0, 0)";
    }
  };

  // Toggles between image and color type
  const handleBackgroundType = () => setIsImgBG(!isImgBG);

  // Sets the color group to the one selected by the user
  const handleColorGroup = (e) => setColorGroup(e.target.value);

  // Displays a new quote by changing the index of the quote to preview
  const handleNewQuote = () => {
    setQuoteData({
      quoteIndex: getRandomIndex(quoteData.quotes)
    });
  };

  // Fetches a new image or sets a new color
  const handleNewBackground = () => {
    if (isImgBG) {
      fetchImage();
    } else {
      setColor(getRandomColor());
    }
  };

  // Adds a card to boardCards, including the quote text and background image or color.
  const handleAddCard = () => {
    if (boardCards && boardCards.length < BOARD_MAX_SIZE) {
      let quote = quoteData.quotes[quoteData.quoteIndex];
      let backgroundImg = isImgBG ? image.urls.small : null;
      let backgroundColor = !isImgBG ? color : null;
      let newQuoteList;
      LAST_CARD_ID += 1;

      if (backgroundImg) {
        newQuoteList = boardCards.concat({ id: LAST_CARD_ID, quote: quote, backgroundImg: backgroundImg });
        unsplashDownload();
      } else {
        newQuoteList = boardCards.concat({ id: LAST_CARD_ID, quote: quote, backgroundColor: backgroundColor });
      }

      setBoardCards(newQuoteList);
    }
  };

  // Deletes a card from the board by removing it from quoteList.
  const handleDeleteCard = () => {
    if (selectedCard != null) {
      for (let i = 0; i < boardCards.length; i++) { // find the quote whose id == cardId
        if (boardCards[i].id === selectedCard) {
          boardCards.splice(i, 1);
          break;
        }
      }
      setBoardCards(boardCards);
    } else {
      console.log("No card selected");
    }
  };

  // Empties contents of boardCards
  const handleClearBoard = () => setBoardCards([]);

  // fetch all quotes on page load
  useEffect(() => {
    setLoading(true);
    setTimeout(() => { // TODO: remove timeout
      fetch("https://type.fit/api/quotes")
        .then((res) => res.json())
        .then((res) => setQuoteData({ quotes: res, quoteIndex: getRandomIndex(res) }))
        .then(() => setLoading(false))
        .catch((err) => setError(err));
    }, "2000");
  }, []);

  // fetch an image on page load
  useEffect(() => {
    setLoading(true);
    fetchImage();
  }, []);

  // get a background color on page load
  useEffect(() => {
    setColor(getRandomColor());
  }, []);

  if (error) {
    return <pre>{JSON.stringify(error)}</pre>;
  }

  return (
    <div className="App" onClick={() => setSelectedCard(null)}>

      {/* ----- HEADER ----- */}
      <header className="App-header">
        <p>
          <span className="Header-line">MOOD BOARD</span><br />
          <span className="Header-line">GENERATOR</span>
        </p>
      </header>

      {/* ----- MAIN CONTENT ----- */}
      <div className="Main-content">

        {/* ----- Left Column: Preview and Controls ----- */}
        <div className="Flex-section">

          {/* ----- Current Card Preview ----- */}
          <div className="Quote-current">
            {loading ? <p>Loading...</p> : <Card
              quote={quoteData.quotes ? quoteData.quotes[quoteData.quoteIndex] : null}
              imageUrl={isImgBG && image ? image.urls.small : null}
              color={!isImgBG ? color : null}
            />}
          </div>

          {/* ----- Color/Image Switch ----- */}
          <label className="Switch">
            <span
              className={"Switch-label Left" + (isImgBG ? " Checked" : "")}
            >
              Image
            </span>

            <input
              type="checkbox"
              checked={!isImgBG}
              onChange={handleBackgroundType}
            />

            <span className="Slider"></span>

            <span
              className={"Switch-label Right" + (!isImgBG ? " Checked" : "")}
            >
              Color
            </span>
          </label>

          {/* ----- Color Group Radio Buttons ----- */}
          <div className="Radio">
            <input
              type="radio"
              id="any"
              name="color"
              value={ColorGroups.Any}
              checked={colorGroup === ColorGroups.Any}
              onChange={handleColorGroup}
              disabled={isImgBG}
            />

            <label htmlFor="any">Any Color</label>

            <input
              type="radio"
              id="pastel"
              name="color"
              value={ColorGroups.Pastel}
              checked={colorGroup === ColorGroups.Pastel}
              onChange={handleColorGroup}
              disabled={isImgBG}
            />

            <label htmlFor="pastel">Pastel</label>

            <input
              type="radio"
              id="bright"
              name="color"
              value={ColorGroups.Bright}
              checked={colorGroup === ColorGroups.Bright}
              onChange={handleColorGroup}
              disabled={isImgBG}
            />

            <label htmlFor="bright">Bright</label>

            <input
              type="radio"
              id="dull"
              name="color"
              value={ColorGroups.Dull}
              checked={colorGroup === ColorGroups.Dull}
              onChange={handleColorGroup}
              disabled={isImgBG}
            />

            <label htmlFor="dull">Dull</label>

            <input
              type="radio"
              id="gray"
              name="color"
              value={ColorGroups.Gray}
              checked={colorGroup === ColorGroups.Gray}
              onChange={handleColorGroup}
              disabled={isImgBG}
            />
            
            <label htmlFor="gray">Gray</label>
          </div>

          {/* ----- Button Row 1 ----- */}
          <div>
            <button
              className="Button"
              onClick={handleNewQuote}
            >
              New quote
            </button>

            <button
              className="Button"
              onClick={handleNewBackground}
            >
              New {isImgBG ? "image" : "color"}
            </button>
          </div>

          {/* ----- Button Row 2 ----- */}
          <div>
            <button
              className="Button"
              disabled={boardCards.length >= BOARD_MAX_SIZE}
              onClick={handleAddCard}
            >
              Add to board
            </button>

            <button
              className="Button"
              disabled={selectedCard == null}
              onClick={handleDeleteCard}
            >
              Delete
            </button>

            <button
              className="Button"
              disabled={boardCards.length === 0}
              onClick={handleClearBoard}
            >
              Clear board
            </button>

            <button
              className="Button"
              disabled={boardCards.length === 0}
              onClick={downloadScreenshot}
            >
              Download
            </button>
          </div>
        </div>

        {/* ----- Right Column: Mood Board Grid ----- */}
        <div className="Flex-section">
          <Board
            cardList={boardCards}
            setCardList={setBoardCards}
            selected={selectedCard}
            setSelected={setSelectedCard}
          />
        </div>
      </div>

      {/* ----- FOOTER ----- */}
      <div className="App-footer">
        <p>&#169; 2023 by Erika Estrada. :-)</p>
      </div>
    </div>
  );
}

export default App;
