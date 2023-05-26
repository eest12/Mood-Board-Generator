import "./Board.css";
import { BoardSlot } from "../BoardSlot/BoardSlot";
import { GridContextProvider, GridDropZone, GridItem, swap } from "react-grid-dnd";

/**
 * 
 * @param {*} param0 
 * @returns 
 */
function Board({ quoteList, setQuoteList, selected, setSelected }) {
    // TODO: maybe "quoteList" and "selected" states should be declared here?

    function onChange(sourceId, sourceIndex, targetIndex, targetId) {
        const nextState = swap(quoteList, sourceIndex, targetIndex);
        setQuoteList(nextState);
    }

    if (quoteList && quoteList.length > 0) {
        return (
            <div className="Board">
            <GridContextProvider onChange={onChange}>
                <GridDropZone
                    id="quoteList"
                    boxesPerRow={3}
                    rowHeight={184} // height/rows = 552/3 = 184
                    className="Grid"
                >
                    {quoteList.map((item) => (
                        <GridItem key={item.id}>
                            <BoardSlot id={item.id} quote={item.quote} image={item.backgroundImg} color={item.backgroundColor} selected={selected} setSelected={setSelected} />
                        </GridItem>
                    ))}
                </GridDropZone>
            </GridContextProvider>
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