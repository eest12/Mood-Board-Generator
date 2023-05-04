import './App.css';
import { unsplashKey } from "./config";
import { useEffect, useReducer, useState } from "react";

const BOARD_MAX_SIZE = 9;
let LAST_CARD_ID = 0;

/**
 * Generates a random index for the given data.
 * @param {*} data An array to get a random index for.
 * @returns A positive integer less than the size of the data parameter, or -1 if data is empty or null.
 */
function getRandomIndex(data) {
  if (data && data.length > 0) {
    return Math.floor(Math.random() * data.length);
  }
  return -1;
}

/**
 * Generates a random color.
 * @returns A string representing a color in RGB format.
 */
function getRandomColor() {
  const rgb = [];
  for (let i = 0; i < 3; i++) {
    rgb.push(Math.floor(Math.random() * 256));
  }
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

/**
 * 
 * @param {*} setImage 
 * @param {*} setError 
 */
function fetchImage(setImage, setError) {
  fetch(`https://api.unsplash.com/photos/random?client_id=${unsplashKey}`)
    .then((res) => res.json())
    .then(setImage)
}

/**
 * Adds a quote card to quoteList, including the quote text and background image or color.
 * @param {*} quote An object containing the following keys: text, author.
 * @param {*} backgroundImg An image URL.
 * @param {*} backgroundColor A color.
 * @param {*} quoteList A stateful list to add the quote card to.
 * @param {*} setQuoteList A state updater function that will be called to update quoteList with the new quote card.
 */
function addQuote(quote, backgroundImg, backgroundColor, quoteList, setQuoteList) {
  if (quoteList && quoteList.length < BOARD_MAX_SIZE) {
    let newQuoteList;
    LAST_CARD_ID += 1;

    if (backgroundImg) {
      newQuoteList = quoteList.concat({ id: LAST_CARD_ID, quote: quote, backgroundImg: backgroundImg });
    } else {
      newQuoteList = quoteList.concat({ id: LAST_CARD_ID, quote: quote, backgroundColor: backgroundColor });
    }

    setQuoteList(newQuoteList);
    console.log(quoteList);
  }
}

/**
 * Sets the selected ID to the new ID.
 * @param {*} e Select event
 * @param {*} cardId Id of card that was selected
 * @param {*} setSelected Stateful function to change the selected ID
 */
function selectCard(e, cardId, setSelected) {
  e.stopPropagation(); // prevents deselecting by App element
  setSelected(cardId);
}

/**
 * Deletes a card from the board by removing it from quoteList.
 * @param {*} cardId Id of the card to delete
 * @param {*} quoteList Array of quote objects representing the cards in the board
 * @param {*} setQuoteList Stateful function to update quoteList
 */
function deleteCard(cardId, quoteList, setQuoteList) {
  if (cardId != null) {
    for (let i = 0; i < quoteList.length; i++) { // find the quote whose id == cardId
      if (quoteList[i].id === cardId) {
        quoteList.splice(i, 1);
        break;
      }
    }
    setQuoteList(quoteList);
  } else {
    console.log("No card selected");
  }
}

/**
 * 
 * @param {*} param0 
 * @returns 
 */
function Quote({ quote }) {
  if (quote != null) {
    return (
      <figure className="Quote Center">
        <blockquote className="Quote-text">{quote.text}</blockquote>
        <figcaption><i>&#8212;{quote.author == null ? "Unknown" : quote.author}</i></figcaption>
      </figure>
    );
  }

  return <p>Something went wrong. Try again.</p>;
}

/**
 * 
 * @param {*} param0 
 * @returns 
 */
function QuoteBlock({ quote, imageUrl, color }) {
  if (imageUrl) {
    return (
      <div className="Quote-block Center-parent" style={{ backgroundImage: `url(${imageUrl}`, backgroundSize: "cover" }}>
        <Quote quote={quote} />
      </div>
    );
  }
  if (color) {
    return (
      <div className="Quote-block Center-parent" style={{ backgroundColor: color }}>
        <Quote quote={quote} />
      </div>
    );
  }
  return (
    <div className="Quote-block Center-parent">
      <Quote quote={quote} />
    </div>
  );
}

/**
 * 
 * @param {*} param0 
 * @returns 
 */
function Board({ quoteList, selected, setSelected }) {
  if (quoteList && quoteList.length > 0) {
    return (
      <div className="Board">
        {quoteList.map((item) => (
          <BoardSlot key={item.id} id={item.id} quote={item.quote} image={item.backgroundImg} color={item.backgroundColor} selected={selected} setSelected={setSelected} />
        ))}
      </div>
    );
  } else {
    return (
      <div className="Board Center-parent">
        <span className="Center">Quotes you add to the board will appear here.</span>
      </div>
    );
  }
}

/**
 * 
 * @param {*} param0 
 * @returns 
 */
function BoardSlot({ id, quote, image, color, selected, setSelected }) {
  return (
    <div className='Board-slot' onClick={(e) => selectCard(e, id, setSelected)} style={id === selected ? { border: "5px solid orange" } : { border: "none" }}>
      <QuoteBlock quote={quote} imageUrl={image} color={color} />
      <div className='Board-slot-overlay'></div>
    </div>
  )
}

/**
 * Main function that generates the app content.
 * @returns App element, which contaings all the contents of the app.
 */
function App() {
  const [quoteData, setQuoteData] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { quotes: null, quoteIndex: 0 }
  )
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [color, setColor] = useState(getRandomColor());
  const [imgAsBackground, setImgAsBackground] = useState(true);
  const [quoteList, setQuoteList] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    console.log("here");
    setLoading(true);
    setTimeout(() => {
      fetch("https://type.fit/api/quotes")
        .then((res) => res.json())
        .then((res) => setQuoteData({ quotes: res, quoteIndex: getRandomIndex(res) }))
        .then(() => setLoading(false))
        .catch((err) => setError(err));
    }, "2000");
  }, []);

  useEffect(() => {
    fetchImage(setImage);
  }, [])

  if (error) {
    return <pre>{JSON.stringify(error)}</pre>;
  }

  return (
    <div className="App" onClick={() => setSelected(null)}>
      {/* ----- HEADER ----- */}
      <header className="App-header">
        <p>Mood Board Generator</p>
      </header>

      {/* ----- MAIN CONTENT ----- */}
      <div className="Main-content">
        <div className="Flex-section">
          {/* ----- Single Quote Block ----- */}
          <div className="Quote-current">
            {loading ? <p>Loading...</p> : <QuoteBlock
              quote={quoteData.quotes ? quoteData.quotes[quoteData.quoteIndex] : null}
              imageUrl={imgAsBackground && image ? image.urls.small : null}
              color={!imgAsBackground ? color : null} />}
          </div>

          {/* ----- Controls ----- */}

          <label className="Switch">
            <span className={"Switch-label Left " + (!imgAsBackground ? "Checked" : "")}>Color</span>
            <input type="checkbox" checked={imgAsBackground} onChange={() => setImgAsBackground(!imgAsBackground)} />
            <span className="Slider"></span>
            <span className={"Switch-label Right "  + (imgAsBackground ? "Checked" : "")}>Image</span>
          </label>

          <div>
            <button className="Button" onClick={() => { setQuoteData({ quoteIndex: getRandomIndex(quoteData.quotes) }) }}>New quote</button>
            <button className="Button" onClick={() => imgAsBackground ? fetchImage(setImage) : setColor(getRandomColor())}>New {imgAsBackground ? "image" : "color"}</button>
          </div>

          <div>
            <button className="Button" disabled={quoteList.length >= BOARD_MAX_SIZE} onClick={() => { addQuote(quoteData.quotes[quoteData.quoteIndex], imgAsBackground ? image.urls.small : null, !imgAsBackground ? color : null, quoteList, setQuoteList) }}>Add to board</button>
            <button className="Button" disabled={quoteList.length === 0} onClick={() => setQuoteList([])}>Clear board</button>
            <button className="Button" disabled={selected == null} onClick={() => deleteCard(selected, quoteList, setQuoteList)}>Delete</button>
          </div>
        </div>

        {/* ----- Mood Board ----- */}
        <div className="Flex-section">
          <Board quoteList={quoteList} selected={selected} setSelected={setSelected} />
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
