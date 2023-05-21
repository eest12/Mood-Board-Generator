import "./Quote.css";

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

export { Quote };