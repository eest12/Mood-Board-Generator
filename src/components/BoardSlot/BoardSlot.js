import "./BoardSlot.css";
import { Card } from "../Card/Card";

/**
 * 
 * @param {*} param0 
 * @returns 
 */
function BoardSlot({ id, quote, image, color, selected, setSelected }) {
    /**
     * Sets the selected ID to the new ID.
     * @param {*} e Select event
     */
    const selectCard = (e) => {
        e.stopPropagation(); // prevents deselecting by App element
        setSelected(id);
    }

    return (
        <div
            className={'Board-slot' + (id === selected ? ' Board-slot-selected' : '')}
            onClick={selectCard}
        >
            <Card
                quote={quote}
                imageUrl={image}
                color={color}
            />
            <div className='Board-slot-overlay'></div>
        </div>
    )
}

export { BoardSlot };