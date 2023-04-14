import './App.css';
import { unsplashKey } from "./config";
import { useEffect, useReducer, useState } from "react";

function getRandomIndex(data) {
  if (data && data.length > 0) {
    return Math.floor(Math.random() * data.length);
  }
  return -1;
}

function getRandomColor() {
  const rgb = [];
  for (let i = 0; i < 3; i++) {
    rgb.push(Math.floor(Math.random() * 256));
  }
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

function fetchImage(setImage, setError) {
  fetch(`https://api.unsplash.com/photos/random?client_id=${unsplashKey}`)
    .then((res) => res.json())
    .then(setImage)
}

function addQuote(quote, background, quoteList, setQuoteList) {
  console.log(quoteList);
  const newQuoteList = quoteList.concat({ id: quoteList.length, quote: quote, background: background });
  setQuoteList(newQuoteList);
}

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

function QuoteBlock({ quote, imageUrl, color, setColor }) {
  if (imageUrl) {
    return (
      <div className="Quote-block Center-parent" style={{ backgroundImage: `url(${imageUrl}`, backgroundSize: "cover" }}>
        <Quote quote={quote} />
      </div>
    );
  }
  if (color && setColor) {
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

function Board({ quoteList }) {
  if (quoteList && quoteList.length > 0) {
    return (
      <div className="Board">
        <div className="Board-slot">
          {quoteList.map((item) => (
            // I need to account for how to pass along an image vs. a color
            <QuoteBlock key={item.id} quote={item.quote} imageUrl={item.background} />
          ))}
        </div>
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
    <div className="App">
      <header className="App-header">
        <p>Mood Board Generator</p>
      </header>

      <div className="Main-content">
        {loading ? <p>Loading...</p> : <QuoteBlock
                                          quote={quoteData.quotes ? quoteData.quotes[quoteData.quoteIndex] : null}
                                          imageUrl={imgAsBackground && image ? image.urls.small : null}
                                          color={!imgAsBackground ? color : null}
                                          setColor={!imgAsBackground ? setColor : null} />}

        <div className="Buttons">
          <button className="Button" onClick={() => { setQuoteData({ quoteIndex: getRandomIndex(quoteData.quotes) }) }}>New quote</button>
          <button className="Button" onClick={() => imgAsBackground ? fetchImage(setImage) : setColor(getRandomColor())}>New {imgAsBackground ? "image" : "color"}</button>
        </div>

        <div className="Radio-buttons">
          <input type="radio" id="image" name="background_type" value="Image" onChange={() => setImgAsBackground(true)} checked={imgAsBackground} />
          <label htmlFor="image">Image</label>
          <input type="radio" id="color" name="background_type" value="Color" onChange={() => setImgAsBackground(false)} checked={!imgAsBackground} />
          <label htmlFor="color">Color</label>
        </div>

        <button onClick={() => { addQuote(quoteData.quotes[quoteData.quoteIndex], imgAsBackground ? image.urls.small : color, quoteList, setQuoteList) }}>Add to board</button>

        <Board quoteList={quoteList} />
      </div>

      <div className="App-footer">
        <p>&#169; 2023 by Erika Estrada. :-)</p>
      </div>
    </div>
  );
}

export default App;
