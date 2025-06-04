// Chessboard Display and Interaction
class ChessBoard {
    constructor(game) {
        this.game = game;
        this.boardElement = document.getElementById('chessboard');
        this.currentPlayerElement = document.getElementById('current-player');
        this.gameStatusElement = document.getElementById('game-status');
        this.movesListElement = document.getElementById('moves-list');
        this.resetButton = document.getElementById('reset-game');

        this.initializeBoard();
        this.setupEventListeners();
        this.updateDisplay();
    }

    initializeBoard() {
        this.boardElement.innerHTML = '';

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = `square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
                square.dataset.row = row;
                square.dataset.col = col;

                square.addEventListener('click', () => {
                    this.handleSquareClick({ row, col });
                });

                this.boardElement.appendChild(square);
            }
        }
    }

    updateDisplay() {
        // Update board
        const squares = this.boardElement.querySelectorAll('.square');
        squares.forEach(square => {
            const row = parseInt(square.dataset.row);
            const col = parseInt(square.dataset.col);
            const piece = this.game.board[row][col];

            // Clear previous content
            square.innerHTML = '';
            square.className = `square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;

            // Add piece if present
            if (piece) {
                const pieceElement = document.createElement('div');
                pieceElement.className = `piece ${piece.color}_${piece.type}`;
                square.appendChild(pieceElement);

                // Highlight king if in check
                if (piece.type === 'king' && this.game.isInCheck(piece.color)) {
                    square.classList.add('in-check');
                }
            }

            // Highlight selected square
            if (this.game.selectedSquare &&
                this.game.selectedSquare.row === row &&
                this.game.selectedSquare.col === col) {
                square.classList.add('selected');
            }

            // Highlight possible moves
            if (this.game.selectedSquare) {
                const selectedPiece = this.game.board[this.game.selectedSquare.row][this.game.selectedSquare.col];
                if (selectedPiece && this.game.isValidMove(this.game.selectedSquare, { row, col }, selectedPiece)) {
                    if (!this.game.wouldLeaveKingInCheck(this.game.selectedSquare, { row, col })) {
                        square.classList.add('possible-move');
                    }
                }
            }
        });

        // Update game status
        this.currentPlayerElement.textContent = `${this.game.currentPlayer.charAt(0).toUpperCase() + this.game.currentPlayer.slice(1)} to move`;

        if (this.game.gameStatus === 'checkmate') {
            const winner = this.game.currentPlayer === 'white' ? 'Black' : 'White';
            this.gameStatusElement.textContent = `Checkmate! ${winner} wins!`;
        } else if (this.game.gameStatus === 'stalemate') {
            this.gameStatusElement.textContent = 'Stalemate! Draw!';
        } else if (this.game.isInCheck(this.game.currentPlayer)) {
            this.gameStatusElement.textContent = `${this.game.currentPlayer.charAt(0).toUpperCase() + this.game.currentPlayer.slice(1)} is in check!`;
        } else {
            this.gameStatusElement.textContent = '';
        }

        // Update move history
        this.updateMoveHistory();
    }

    updateMoveHistory() {
        this.movesListElement.innerHTML = '';

        for (let i = 0; i < this.game.moveHistory.length; i += 2) {
            const moveNumber = Math.floor(i / 2) + 1;
            const whiteMove = this.game.moveHistory[i];
            const blackMove = this.game.moveHistory[i + 1];

            const moveElement = document.createElement('div');
            moveElement.innerHTML = `${moveNumber}. ${this.formatMove(whiteMove)} ${blackMove ? this.formatMove(blackMove) : ''}`;
            this.movesListElement.appendChild(moveElement);
        }
    }

    formatMove(move) {
        const fromSquare = String.fromCharCode(97 + move.from.col) + (8 - move.from.row);
        const toSquare = String.fromCharCode(97 + move.to.col) + (8 - move.to.row);

        // Special notation for castling
        if (move.piece.type === 'king' && Math.abs(move.to.col - move.from.col) === 2) {
            return move.to.col > move.from.col ? 'O-O' : 'O-O-O';
        }

        const pieceSymbol = move.piece.type === 'pawn' ? '' : move.piece.type.charAt(0).toUpperCase();
        const capture = move.captured ? 'x' : '';

        return `${pieceSymbol}${capture}${toSquare}`;
    }

    handleSquareClick(position) {
        const piece = this.game.board[position.row][position.col];

        // If no square is selected
        if (!this.game.selectedSquare) {
            // Select square if it contains current player's piece
            if (piece && piece.color === this.game.currentPlayer) {
                this.game.selectedSquare = position;
            }
            this.updateDisplay();
            return;
        }

        // If same square clicked, deselect
        if (this.game.selectedSquare.row === position.row && this.game.selectedSquare.col === position.col) {
            this.game.selectedSquare = null;
            this.updateDisplay();
            return;
        }

        // If clicking on another piece of same color, select it
        if (piece && piece.color === this.game.currentPlayer) {
            this.game.selectedSquare = position;
            this.updateDisplay();
            return;
        }

        // Try to make a move
        const selectedPiece = this.game.board[this.game.selectedSquare.row][this.game.selectedSquare.col];
        if (selectedPiece &&
            this.game.isValidMove(this.game.selectedSquare, position, selectedPiece) &&
            !this.game.wouldLeaveKingInCheck(this.game.selectedSquare, position)) {

            this.game.makeMove(this.game.selectedSquare, position);
            this.game.currentPlayer = this.game.currentPlayer === 'white' ? 'black' : 'white';

            // Check for game end conditions
            if (this.game.isCheckmate(this.game.currentPlayer)) {
                this.game.gameStatus = 'checkmate';
            } else if (this.game.isStalemate(this.game.currentPlayer)) {
                this.game.gameStatus = 'stalemate';
            }

            this.game.selectedSquare = null;
        } else {
            // Invalid move, deselect
            this.game.selectedSquare = null;
        }

        this.updateDisplay();
    }

    setupEventListeners() {
        this.resetButton.addEventListener('click', () => {
            this.game.resetGame();
            this.updateDisplay();
        });
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const game = new ChessGame();
    const board = new ChessBoard(game);
});
