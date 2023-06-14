import "./Board.css";
import { BoardSlot } from "../BoardSlot/BoardSlot";
import { createRef } from "react";
import { GridContextProvider, GridDropZone, GridItem, swap } from "react-grid-dnd";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";

const BOARD_MAX_SIZE = 9; // total amount of cards a board can hold
const canvasRef = createRef(null); // a reference to the element to be turned into a canvas

/**
 * Downloads a screenshot of the current board as a jpg.
 */
function downloadScreenshot() {
    html2canvas(canvasRef.current, { logging: true, letterRendering: 1, useCORS: true })
        .then(canvas => {
            canvas.toBlob(function (blob) {
                saveAs(blob, 'mood-board.jpg');
            });
        });
}

/**
 * 
 * @param {*} param0 
 * @returns 
 */
function Board({ cardList, setCardList, selected, setSelected }) {
    /* Note: The boardHeight variable is used to calculate and set the grid row height,
       but if the CSS property --height is changed during development,
       the grid row height won't be updated without refreshing the page manually.
       For now this is not a problem because the Board size cannot be changed during production.
       If in the future the Board size is made responsive and the --height property changes dynamically,
       stateful variables will be needed to react to a window resize event. */
    const boardHeight = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--height")
    );

    // Moves grid item to a new position and shifts other cards to accomodate it
    const handleGridChange = (sourceId, sourceIndex, targetIndex, targetId) => {
        const reorderedList = swap(cardList, sourceIndex, targetIndex);
        setCardList(reorderedList);
    }

    if (cardList && cardList.length > 0) {
        return (
            <div className="Board" ref={canvasRef}>
                <GridContextProvider onChange={handleGridChange}>
                    <GridDropZone
                        id="quoteList"
                        boxesPerRow={3}
                        rowHeight={boardHeight / 3} // height/rows
                        className="Grid"
                    >
                        {cardList.map((item) => (
                            <GridItem key={item.id}>
                                <BoardSlot
                                    id={item.id}
                                    quote={item.quote}
                                    image={item.backgroundImg}
                                    color={item.backgroundColor}
                                    selected={selected}
                                    setSelected={setSelected}
                                />
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

export { Board, BOARD_MAX_SIZE, downloadScreenshot };