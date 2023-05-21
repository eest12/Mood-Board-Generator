import "./Board.css";
import { BoardSlot } from "../BoardSlot/BoardSlot";

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

export { Board };