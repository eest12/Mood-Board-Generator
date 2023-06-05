import "./Card.css";
import { Quote } from "../Quote/Quote.js";

/**
 * 
 * @param {*} props Component properties.
 * @param {string} props.quote An object containing "text" and "title" properties.
 * @param {string} props.imageUrl An image address.
 * @param {string} props.color A string representing a color, such as in RGB format.
 * @returns Component
 */
function Card({ quote, imageUrl, color }) {
    let style = {};

    if (imageUrl) {
        style = {
            backgroundImage: `url(${imageUrl}`,
            backgroundSize: "cover"
        };
    } else if (color) {
        style = { backgroundColor: color };
    }

    return (
        <div
            className="Card Center-parent"
            style={style}
        >
            <Quote quote={quote} />
        </div>
    );
}

export { Card };