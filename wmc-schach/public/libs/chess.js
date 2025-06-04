// Chess Game Logic
class ChessGame {
    constructor() {
        this.board = this.initializeBoard();
        this.currentPlayer = 'white';
        this.selectedSquare = null;
        this.gameStatus = 'playing';
        this.moveHistory = [];
        this.inCheck = false;
        this.enPassantTarget = null; // Track en passant target square
        this.castlingRights = {
            white: { kingside: true, queenside: true },
            black: { kingside: true, queenside: true }
        };
        this.kingMoved = { white: false, black: false };
        this.rookMoved = {
            white: { kingside: false, queenside: false },
            black: { kingside: false, queenside: false }
        };
    }

    initializeBoard() {
        const board = Array(8).fill(null).map(() => Array(8).fill(null));

        // Place pawns
        for (let col = 0; col < 8; col++) {
            board[1][col] = { type: 'pawn', color: 'black' };
            board[6][col] = { type: 'pawn', color: 'white' };
        }

        // Place other pieces
        const pieceOrder = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];

        for (let col = 0; col < 8; col++) {
            board[0][col] = { type: pieceOrder[col], color: 'black' };
            board[7][col] = { type: pieceOrder[col], color: 'white' };
        }

        return board;
    }

    isValidMove(from, to, piece) {
        // Basic bounds check
        if (to.row < 0 || to.row >= 8 || to.col < 0 || to.col >= 8) {
            return false;
        }

        // Can't capture own piece
        const targetPiece = this.board[to.row][to.col];
        if (targetPiece && targetPiece.color === piece.color) {
            return false;
        }

        // Can't move to same square
        if (from.row === to.row && from.col === to.col) {
            return false;
        }

        const rowDiff = to.row - from.row;
        const colDiff = to.col - from.col;
        const absRowDiff = Math.abs(rowDiff);
        const absColDiff = Math.abs(colDiff);

        switch (piece.type) {
            case 'pawn':
                return this.isValidPawnMove(from, to, piece);
            case 'rook':
                return (rowDiff === 0 || colDiff === 0) && this.isPathClear(from, to);
            case 'bishop':
                return absRowDiff === absColDiff && this.isPathClear(from, to);
            case 'queen':
                return (rowDiff === 0 || colDiff === 0 || absRowDiff === absColDiff) && this.isPathClear(from, to);
            case 'king':
                // Normal king move
                if (absRowDiff <= 1 && absColDiff <= 1) return true;
                // Castling
                return this.isValidCastling(from, to, piece);
            case 'knight':
                return (absRowDiff === 2 && absColDiff === 1) || (absRowDiff === 1 && absColDiff === 2);
            default:
                return false;
        }
    }

    isValidPawnMove(from, to, piece) {
        const direction = piece.color === 'white' ? -1 : 1;
        const startRow = piece.color === 'white' ? 6 : 1;
        const rowDiff = to.row - from.row;
        const colDiff = to.col - from.col;

        // Forward move
        if (colDiff === 0) {
            if (rowDiff === direction && !this.board[to.row][to.col]) {
                return true;
            }
            // Two squares from start
            if (from.row === startRow && rowDiff === 2 * direction && !this.board[to.row][to.col]) {
                return true;
            }
        }

        // Diagonal capture
        if (Math.abs(colDiff) === 1 && rowDiff === direction) {
            // Normal capture
            if (this.board[to.row][to.col]) return true;
            // En passant
            if (this.enPassantTarget && to.row === this.enPassantTarget.row && to.col === this.enPassantTarget.col) {
                return true;
            }
        }

        return false;
    }

    isValidCastling(from, to, piece) {
        // Must be king
        if (piece.type !== 'king') return false;

        // King must not have moved
        if (this.kingMoved[piece.color]) return false;

        // Must be horizontal move of 2 squares
        if (Math.abs(to.col - from.col) !== 2 || to.row !== from.row) return false;

        // Must not be in check
        if (this.isInCheck(piece.color)) return false;

        const isKingside = to.col > from.col;
        const rookCol = isKingside ? 7 : 0;

        // Rook must not have moved
        if (this.rookMoved[piece.color][isKingside ? 'kingside' : 'queenside']) return false;

        // Path must be clear
        const startCol = Math.min(from.col, rookCol);
        const endCol = Math.max(from.col, rookCol);
        for (let col = startCol + 1; col < endCol; col++) {
            if (this.board[from.row][col]) return false;
        }

        // Squares king passes through must not be under attack
        const step = isKingside ? 1 : -1;
        for (let i = 1; i <= 2; i++) {
            const testCol = from.col + (i * step);
            if (this.isSquareUnderAttack({ row: from.row, col: testCol }, piece.color)) {
                return false;
            }
        }

        return true;
    }

    isSquareUnderAttack(square, colorBeingAttacked) {
        const opponentColor = colorBeingAttacked === 'white' ? 'black' : 'white';

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && piece.color === opponentColor) {
                    if (this.isValidMove({ row, col }, square, piece)) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    isPathClear(from, to) {
        const rowStep = Math.sign(to.row - from.row);
        const colStep = Math.sign(to.col - from.col);

        let currentRow = from.row + rowStep;
        let currentCol = from.col + colStep;

        while (currentRow !== to.row || currentCol !== to.col) {
            if (this.board[currentRow][currentCol]) {
                return false;
            }
            currentRow += rowStep;
            currentCol += colStep;
        }

        return true;
    }

    makeMove(from, to) {
        const piece = this.board[from.row][from.col];
        const capturedPiece = this.board[to.row][to.col];

        // Handle castling
        if (piece.type === 'king' && Math.abs(to.col - from.col) === 2) {
            const isKingside = to.col > from.col;
            const rookFromCol = isKingside ? 7 : 0;
            const rookToCol = isKingside ? 5 : 3;

            // Move rook
            this.board[from.row][rookToCol] = this.board[from.row][rookFromCol];
            this.board[from.row][rookFromCol] = null;
        }

        // Handle en passant capture
        if (piece.type === 'pawn' && this.enPassantTarget &&
            to.row === this.enPassantTarget.row && to.col === this.enPassantTarget.col) {
            const captureRow = piece.color === 'white' ? to.row + 1 : to.row - 1;
            this.board[captureRow][to.col] = null;
        }

        // Make the move
        this.board[to.row][to.col] = piece;
        this.board[from.row][from.col] = null;

        // Handle pawn promotion
        if (piece.type === 'pawn' && (to.row === 0 || to.row === 7)) {
            this.board[to.row][to.col] = { type: 'queen', color: piece.color };
        }

        // Update castling rights
        if (piece.type === 'king') {
            this.kingMoved[piece.color] = true;
        }
        if (piece.type === 'rook') {
            if (from.col === 0) this.rookMoved[piece.color].queenside = true;
            if (from.col === 7) this.rookMoved[piece.color].kingside = true;
        }

        // Set en passant target
        this.enPassantTarget = null;
        if (piece.type === 'pawn' && Math.abs(to.row - from.row) === 2) {
            this.enPassantTarget = {
                row: from.row + (to.row - from.row) / 2,
                col: from.col
            };
        }

        this.moveHistory.push({
            from: {...from},
            to: {...to},
            piece: {...piece},
            captured: capturedPiece
        });
    }

    findKing(color) {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && piece.type === 'king' && piece.color === color) {
                    return { row, col };
                }
            }
        }
        return null;
    }

    isInCheck(color) {
        const kingPos = this.findKing(color);
        if (!kingPos) return false;

        return this.isSquareUnderAttack(kingPos, color);
    }

    getAllValidMoves(color) {
        const validMoves = [];

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && piece.color === color) {
                    for (let toRow = 0; toRow < 8; toRow++) {
                        for (let toCol = 0; toCol < 8; toCol++) {
                            if (this.isValidMove({ row, col }, { row: toRow, col: toCol }, piece)) {
                                // Check if move leaves king in check
                                if (!this.wouldLeaveKingInCheck({ row, col }, { row: toRow, col: toCol })) {
                                    validMoves.push({
                                        from: { row, col },
                                        to: { row: toRow, col: toCol }
                                    });
                                }
                            }
                        }
                    }
                }
            }
        }

        return validMoves;
    }

    wouldLeaveKingInCheck(from, to) {
        // Simulate the move
        const piece = this.board[from.row][from.col];
        const originalTarget = this.board[to.row][to.col];

        this.board[to.row][to.col] = piece;
        this.board[from.row][from.col] = null;

        const inCheck = this.isInCheck(piece.color);

        // Undo the move
        this.board[from.row][from.col] = piece;
        this.board[to.row][to.col] = originalTarget;

        return inCheck;
    }

    isCheckmate(color) {
        if (!this.isInCheck(color)) return false;
        return this.getAllValidMoves(color).length === 0;
    }

    isStalemate(color) {
        if (this.isInCheck(color)) return false;
        return this.getAllValidMoves(color).length === 0;
    }

    resetGame() {
        this.board = this.initializeBoard();
        this.currentPlayer = 'white';
        this.selectedSquare = null;
        this.gameStatus = 'playing';
        this.moveHistory = [];
        this.inCheck = false;
        this.enPassantTarget = null;
        this.castlingRights = {
            white: { kingside: true, queenside: true },
            black: { kingside: true, queenside: true }
        };
        this.kingMoved = { white: false, black: false };
        this.rookMoved = {
            white: { kingside: false, queenside: false },
            black: { kingside: false, queenside: false }
        };
    }
}
