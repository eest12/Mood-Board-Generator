import "./BoardSlot.css";
import { QuoteBlock } from "../QuoteBlock/QuoteBlock";

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

export { BoardSlot };