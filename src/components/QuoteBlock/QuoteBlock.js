import "./QuoteBlock.css";
import { Quote } from "../Quote/Quote.js";

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

export { QuoteBlock };