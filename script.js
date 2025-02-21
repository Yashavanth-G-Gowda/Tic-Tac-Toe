let boxes = document.querySelectorAll(".box");
let newGameButton = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let container = document.querySelector(".container");
let winnerMsg = document.querySelector("#winner-msg");
let count = 0;
let turnO = false;
const winPatterns = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [3, 4, 5],
    [6, 7, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6]
];

const startGame = (firstMoveByHuman) => {
    document.getElementById("choice-modal").style.display = "none";
    resetGame(firstMoveByHuman);
};

const resetGame = (firstMoveByHuman) => {
    turnO = firstMoveByHuman;
    enableBoxes();
    winnerMsg.textContent = ""; 
    msg.textContent = `Turn: ${turnO ? "You (X)" : "AI (O)"}`;
    if (!firstMoveByHuman) {
        aiMove();
    }
};

const enableBoxes = () => {
    for (let box of boxes) {
        box.disabled = false;
        box.innerText = "";
    }
};

const disableBoxes = () => {
    for (let box of boxes) {
        box.disabled = true;
    }
};

const showWinner = (winner) => {
    msg.innerText = `Winner is ${winner}`;
    disableBoxes();
};

const drawGame = () => {
    if (!checkWinner(getBoard())) {
        msg.innerText = "This Game is a Draw.";
        disableBoxes();
    }
};

const checkWinner = (board) => {
    for (let pattern of winPatterns) {
        let pos1Val = board[pattern[0]];
        let pos2Val = board[pattern[1]];
        let pos3Val = board[pattern[2]];

        if (pos1Val !== "" && pos1Val === pos2Val && pos2Val === pos3Val) {
            return pos1Val;
        }
    }
    return null;
};

const isBoardFull = (board) => {
    return !board.includes("");
};

const getBoard = () => {
    return Array.from(boxes).map(box => box.innerText);
};

const aiMove = () => {
    const board = getBoard();
    const move = bestMove(board);

    boxes[move].innerText = "O";
    boxes[move].style.color = "white";
    boxes[move].disabled = true;
    turnO = true;
    count++;

    const updatedBoard = getBoard();
    const winner = checkWinner(updatedBoard);
    if (winner === "O") {
        showWinner("O");
        return;
    }

    if (count === 9) {
        drawGame();
    }
};

const bestMove = (board) => {
    let bestVal = -Infinity;
    let move = -1;
    for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
            board[i] = "O";
            let moveVal = minimax(board, 0, false);
            board[i] = "";
            if (moveVal > bestVal) {
                move = i;
                bestVal = moveVal;
            }
        }
    }
    return move;
};

const minimax = (board, depth, isMaximizing) => {
    const winner = checkWinner(board);
    if (winner === "O") return 10 - depth;
    if (winner === "X") return -10 + depth;
    if (isBoardFull(board)) return 0;

    if (isMaximizing) {
        let best = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "O";
                best = Math.max(best, minimax(board, depth + 1, false));
                board[i] = "";
            }
        }
        return best;
    } else {
        let best = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "X";
                best = Math.min(best, minimax(board, depth + 1, true));
                board[i] = "";
            }
        }
        return best;
    }
};

boxes.forEach((box, index) => {
    box.addEventListener("click", () => {
        if (count === 9 || checkWinner(getBoard())) {
            return;
        }
        if (turnO) {
            box.innerText = "X";
            box.disabled = true;
            turnO = false;
            count++;
            const board = getBoard();
            const winner = checkWinner(board);
            if (winner === "X") {
                showWinner("X");
                return;
            }
            if (count === 9) {
                drawGame();
                return;
            }
            aiMove();
        }
    });
});

newGameButton.addEventListener("click", () => {
    location.reload();
});