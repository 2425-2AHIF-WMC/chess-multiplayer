const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const ranks = ['8', '7', '6', '5', '4', '3', '2', '1']; // reversed for visual representation

let pieces = {
  'a1': 'white_rook', 'b1': 'white_knight', 'c1': 'white_bishop', 'd1': 'white_queen',
  'e1': 'white_king', 'f1': 'white_bishop', 'g1': 'white_knight', 'h1': 'white_rook',
  'a2': 'white_pawn', 'b2': 'white_pawn', 'c2': 'white_pawn', 'd2': 'white_pawn',
  'e2': 'white_pawn', 'f2': 'white_pawn', 'g2': 'white_pawn', 'h2': 'white_pawn',
  'a8': 'black_rook', 'b8': 'black_knight', 'c8': 'black_bishop', 'd8': 'black_queen',
  'e8': 'black_king', 'f8': 'black_bishop', 'g8': 'black_knight', 'h8': 'black_rook',
  'a7': 'black_pawn', 'b7': 'black_pawn', 'c7': 'black_pawn', 'd7': 'black_pawn',
  'e7': 'black_pawn', 'f7': 'black_pawn', 'g7': 'black_pawn', 'h7': 'black_pawn'
};

let selectedSquare = null;
let validMoves = [];
let currentPlayer = 'white'; // White starts
let moveHistory = [];
let castlingRights = {
  white: { kingside: true, queenside: true },
  black: { kingside: true, queenside: true }
};
let enPassantTarget = null; // e.g. 'e3' square where en passant is possible

const chessboard = document.getElementById('chessboard');
const moveHistoryList = document.getElementById('move-history-list');
const currentPlayerText = document.getElementById('current-player-text');
const currentPlayerIndicator = document.getElementById('current-player-indicator');
const resetButton = document.getElementById('reset-game');

// Create chess board
const createBoard = () => {
  chessboard.innerHTML = '';

  for (const rank of ranks) {
    for (const file of files) {
      const square = document.createElement('div');
      const position = file + rank;

      square.className = 'square ' + ((files.indexOf(file) + ranks.indexOf(rank)) % 2 === 0 ? 'black' : 'white');
      square.dataset.position = position;

      if (pieces[position]) {
        const piece = document.createElement('div');
        piece.className = `piece ${pieces[position]}`;
        piece.dataset.piece = pieces[position];
        square.appendChild(piece);
      }

      square.addEventListener('click', handleSquareClick);
      chessboard.appendChild(square);
    }
  }
};

// Handle square clicking
const handleSquareClick = (event) => {
  const square = event.currentTarget;
  const position = square.dataset.position;
  const piece = square.querySelector('.piece');

  clearHighlights();

  if (!selectedSquare) {
    if (piece && isPieceOfCurrentPlayer(piece.dataset.piece)) {
      selectedSquare = position;
      square.classList.add('highlight');
      validMoves = calculateValidMoves(position, piece.dataset.piece);
      // Highlight castling moves if king is selected
      if (piece.dataset.piece.endsWith('king')) {
        const castleMoves = getCastlingMoves(position, piece.dataset.piece);
        castleMoves.forEach(m => {
          if (!validMoves.includes(m)) validMoves.push(m);
        });
      }
      showValidMoves(validMoves);
    }
    return;
  }

  if (selectedSquare === position) {
    selectedSquare = null;
    return;
  }

  const selectedPieceElement = document.querySelector(`[data-position="${selectedSquare}"] .piece`);
  if (selectedPieceElement && validMoves.includes(position)) {
    const pieceType = selectedPieceElement.dataset.piece.split('_')[1];
    let notation = '';

    // Handle castling notation
    if (isCastlingMove(selectedSquare, position, selectedPieceElement.dataset.piece)) {
      notation = position[0] === 'g' ? 'O-O' : 'O-O-O';
      performCastling(selectedSquare, position, selectedPieceElement.dataset.piece);
    }
    else {
      notation = `${pieceType.charAt(0).toUpperCase()}${selectedSquare}-${position}`;

      // Handle en passant
      if (isEnPassant(selectedSquare, position, selectedPieceElement.dataset.piece)) {
        notation += ' e.p.';
        handleEnPassant(selectedSquare, position);
      }

      // Handle promotion
      if (isPromotion(position, selectedPieceElement.dataset.piece)) {
        notation += '=Q';
        handlePromotion(position, selectedPieceElement.dataset.piece);
      }

      movePiece(selectedSquare, position);
    }

    addMoveToHistory(notation);

    updateCastlingRights(selectedSquare, selectedPieceElement.dataset.piece);
    updateEnPassantTarget(selectedSquare, position, selectedPieceElement.dataset.piece);

    // Switch player
    switchPlayer();
    selectedSquare = null;

    // After move checks
    if (isInCheck(currentPlayer)) {
      alert(`${capitalize(currentPlayer)} is in check!`);
    }
    if (isCheckmate(currentPlayer)) {
      alert(`Checkmate! ${capitalize(opponent(currentPlayer))} wins!`);
    }
    else if (isStalemate(currentPlayer)) {
      alert("Stalemate! The game is a draw.");
    }
  } else {
    if (piece && isPieceOfCurrentPlayer(piece.dataset.piece)) {
      selectedSquare = position;
      square.classList.add('highlight');
      validMoves = calculateValidMoves(position, piece.dataset.piece);
      if (piece.dataset.piece.endsWith('king')) {
        const castleMoves = getCastlingMoves(position, piece.dataset.piece);
        castleMoves.forEach(m => {
          if (!validMoves.includes(m)) validMoves.push(m);
        });
      }
      showValidMoves(validMoves);
    } else {
      selectedSquare = null;
    }
  }
};

const isPieceOfCurrentPlayer = (pieceClass) => {
  return pieceClass.startsWith(currentPlayer);
};

const clearHighlights = () => {
  document.querySelectorAll('.square.highlight, .square.valid-move').forEach(square => {
    square.classList.remove('highlight', 'valid-move');
  });
};

const showValidMoves = (validMoves) => {
  validMoves.forEach(position => {
    const square = document.querySelector(`[data-position="${position}"]`);
    if (square) {
      square.classList.add('valid-move');
    }
  });
};

// Calculate valid moves for a piece, including en passant possibility but excluding castling here
const calculateValidMoves = (position, pieceType) => {
  const [color, type] = pieceType.split('_');
  const [file, rank] = [position.charAt(0), position.charAt(1)];
  const fileIdx = files.indexOf(file);
  const rankIdx = ranks.indexOf(rank);
  const moves = [];

  // Pawn movement
  if (type === 'pawn') {
    const direction = color === 'white' ? -1 : 1;
    const startRank = color === 'white' ? '2' : '7';

    // Forward
    const oneAhead = file + ranks[rankIdx + direction];
    if (ranks[rankIdx + direction] && !pieces[oneAhead]) {
      moves.push(oneAhead);

      // Two squares on first move
      if (rank === startRank) {
        const twoAhead = file + ranks[rankIdx + 2 * direction];
        if (!pieces[twoAhead]) moves.push(twoAhead);
      }
    }

    // Captures diagonal
    for (const df of [-1, 1]) {
      const newFileIdx = fileIdx + df;
      const newRankIdx = rankIdx + direction;
      if (newFileIdx >= 0 && newFileIdx < 8 && newRankIdx >= 0 && newRankIdx < 8) {
        const diagPos = files[newFileIdx] + ranks[newRankIdx];
        if (pieces[diagPos] && !pieces[diagPos].startsWith(color)) {
          moves.push(diagPos);
        }
        // En passant
        if (enPassantTarget === diagPos) {
          moves.push(diagPos);
        }
      }
    }
  }

  // Knight movement
  if (type === 'knight') {
    const knightMoves = [
      [-2, -1], [-2, 1], [-1, -2], [-1, 2],
      [1, -2], [1, 2], [2, -1], [2, 1]
    ];

    for (const [df, dr] of knightMoves) {
      const nf = fileIdx + df;
      const nr = rankIdx + dr;
      if (nf >= 0 && nf < 8 && nr >= 0 && nr < 8) {
        const pos = files[nf] + ranks[nr];
        if (!pieces[pos] || !pieces[pos].startsWith(color)) moves.push(pos);
      }
    }
  }

  // Bishop and queen diagonal moves
  if (type === 'bishop' || type === 'queen') {
    const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
    directions.forEach(([df, dr]) => {
      let nf = fileIdx, nr = rankIdx;
      while (true) {
        nf += df; nr += dr;
        if (nf < 0 || nf >= 8 || nr < 0 || nr >= 8) break;
        const pos = files[nf] + ranks[nr];
        if (!pieces[pos]) {
          moves.push(pos);
        } else {
          if (!pieces[pos].startsWith(color)) moves.push(pos);
          break;
        }
      }
    });
  }

  // Rook and queen straight moves
  if (type === 'rook' || type === 'queen') {
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    directions.forEach(([df, dr]) => {
      let nf = fileIdx, nr = rankIdx;
      while (true) {
        nf += df; nr += dr;
        if (nf < 0 || nf >= 8 || nr < 0 || nr >= 8) break;
        const pos = files[nf] + ranks[nr];
        if (!pieces[pos]) {
          moves.push(pos);
        } else {
          if (!pieces[pos].startsWith(color)) moves.push(pos);
          break;
        }
      }
    });
  }

  // King moves (normal)
  if (type === 'king') {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];
    directions.forEach(([df, dr]) => {
      const nf = fileIdx + df;
      const nr = rankIdx + dr;
      if (nf >= 0 && nf < 8 && nr >= 0 && nr < 8) {
        const pos = files[nf] + ranks[nr];
        if (!pieces[pos] || !pieces[pos].startsWith(color)) moves.push(pos);
      }
    });
  }

  return moves;
};

// Castling moves, returns squares king can move to for castling if allowed
const getCastlingMoves = (position, pieceType) => {
  const color = pieceType.split('_')[0];
  if (!position || !pieceType.endsWith('king')) return [];
  const rank = color === 'white' ? '1' : '8';
  const castlingMoves = [];

  if (currentPlayer !== color) return [];

  if (castlingRights[color].kingside) {
    // Squares between king and rook on kingside must be empty
    const fSquare = 'f' + rank;
    const gSquare = 'g' + rank;
    const hSquare = 'h' + rank;
    if (!pieces[fSquare] && !pieces[gSquare] && pieces[hSquare] === color + '_rook') {
      // King and rook have not moved and no squares attacked
      if (!isSquareAttacked(position, opponent(color)) &&
        !isSquareAttacked(fSquare, opponent(color)) &&
        !isSquareAttacked(gSquare, opponent(color))) {
        castlingMoves.push(gSquare);
      }
    }
  }

  if (castlingRights[color].queenside) {
    const dSquare = 'd' + rank;
    const cSquare = 'c' + rank;
    const bSquare = 'b' + rank;
    const aSquare = 'a' + rank;
    if (!pieces[dSquare] && !pieces[cSquare] && !pieces[bSquare] && pieces[aSquare] === color + '_rook') {
      if (!isSquareAttacked(position, opponent(color)) &&
        !isSquareAttacked(dSquare, opponent(color)) &&
        !isSquareAttacked(cSquare, opponent(color))) {
        castlingMoves.push(cSquare);
      }
    }
  }

  return castlingMoves;
};

// Check if a move is a castling move
const isCastlingMove = (from, to, pieceType) => {
  if (!pieceType.endsWith('king')) return false;
  const color = pieceType.split('_')[0];
  const rank = color === 'white' ? '1' : '8';
  const kingsideTo = 'g' + rank;
  const queensideTo = 'c' + rank;
  return to === kingsideTo || to === queensideTo;
};

// Perform castling move by moving king and rook
const performCastling = (from, to, pieceType) => {
  const color = pieceType.split('_')[0];
  const rank = color === 'white' ? '1' : '8';
  if (to === 'g' + rank) {
    // Kingside
    const rookFrom = 'h' + rank;
    const rookTo = 'f' + rank;
    movePiece(from, to);
    movePiece(rookFrom, rookTo);
  } else if (to === 'c' + rank) {
    // Queenside
    const rookFrom = 'a' + rank;
    const rookTo = 'd' + rank;
    movePiece(from, to);
    movePiece(rookFrom, rookTo);
  }
  castlingRights[color].kingside = false;
  castlingRights[color].queenside = false;
};

// Check if a move is en passant legal
const isEnPassant = (from, to, pieceType) => {
  if (!pieceType.endsWith('pawn')) return false;
  if (!enPassantTarget) return false;
  return to === enPassantTarget;
};

// Handle en passant capture
const handleEnPassant = (from, to) => {
  const fromFile = from.charAt(0);
  const toFile = to.charAt(0);
  const toRank = to.charAt(1);
  // Remove the captured pawn
  const capturedPawnPos = toFile + (currentPlayer === 'white' ? (parseInt(toRank) + 1) : (parseInt(toRank) - 1));
  delete pieces[capturedPawnPos];
  const capturedPawnSquare = document.querySelector(`[data-position="${capturedPawnPos}"]`);
  if (capturedPawnSquare) {
    const capturedPiece = capturedPawnSquare.querySelector('.piece');
    if (capturedPiece) capturedPawnSquare.removeChild(capturedPiece);
  }
};

// Check if a pawn move leads to promotion
const isPromotion = (position, pieceType) => {
  if (!pieceType.endsWith('pawn')) return false;
  if (currentPlayer === 'white' && position.charAt(1) === '8') return true;
  if (currentPlayer === 'black' && position.charAt(1) === '1') return true;
  return false;
};

// Handle pawn promotion automatically to queen
const handlePromotion = (position, pieceType) => {
  pieces[position] = currentPlayer + '_queen';
  const square = document.querySelector(`[data-position="${position}"]`);
  if (square) {
    const oldPiece = square.querySelector('.piece');
    if (oldPiece) square.removeChild(oldPiece);
    const queenPiece = document.createElement('div');
    queenPiece.className = `piece ${currentPlayer}_queen`;
    queenPiece.dataset.piece = currentPlayer + '_queen';
    square.appendChild(queenPiece);
  }
};

// Move piece and update board DOM and pieces object
const movePiece = (from, to) => {
  const fromSquare = document.querySelector(`[data-position="${from}"]`);
  const toSquare = document.querySelector(`[data-position="${to}"]`);
  const piece = fromSquare.querySelector('.piece');

  if (toSquare.querySelector('.piece')) {
    toSquare.removeChild(toSquare.querySelector('.piece'));
  }

  toSquare.appendChild(piece);

  pieces[to] = pieces[from];
  delete pieces[from];
};

// Update castling rights on king or rook move
const updateCastlingRights = (from, pieceType) => {
  const color = pieceType.split('_')[0];
  if (pieceType.endsWith('king')) {
    castlingRights[color].kingside = false;
    castlingRights[color].queenside = false;
  }
  if (pieceType.endsWith('rook')) {
    const rank = color === 'white' ? '1' : '8';
    // Rook start positions
    if (from === 'a' + rank) castlingRights[color].queenside = false;
    if (from === 'h' + rank) castlingRights[color].kingside = false;
  }
};

// Update en passant target square after pawn double move
const updateEnPassantTarget = (from, to, pieceType) => {
  enPassantTarget = null;
  if (!pieceType.endsWith('pawn')) return;
  const fromRank = parseInt(from.charAt(1));
  const toRank = parseInt(to.charAt(1));
  if (Math.abs(toRank - fromRank) === 2) {
    const file = from.charAt(0);
    const enPassantRank = (fromRank + toRank) / 2;
    enPassantTarget = file + enPassantRank;
  }
};

// Check if color is in check by any opponent piece attacking their king
const isInCheck = (color) => {
  const kingPos = findKing(color);
  if (!kingPos) return false;
  return isSquareAttacked(kingPos, opponent(color));
};

// Find king position of given color
const findKing = (color) => {
  for (const pos in pieces) {
    if (pieces[pos] === color + '_king') return pos;
  }
  return null;
};

// Check if a square is attacked by any piece of attackerColor
const isSquareAttacked = (square, attackerColor) => {
  for (const pos in pieces) {
    if (pieces[pos].startsWith(attackerColor)) {
      const pieceType = pieces[pos].split('_')[1];
      const moves = calculateValidMoves(pos, pieces[pos]);
      if (moves.includes(square)) {
        // But for pawns, we need to ensure that pawn attacks (capture moves) match square
        if (pieceType === 'pawn') {
          const fileFrom = pos.charAt(0);
          const rankFrom = pos.charAt(1);
          const fileTo = square.charAt(0);
          const rankTo = square.charAt(1);
          const fileDiff = Math.abs(files.indexOf(fileFrom) - files.indexOf(fileTo));
          const rankDiff = parseInt(rankTo) - parseInt(rankFrom);
          if (attackerColor === 'white' && rankDiff === -1 && fileDiff === 1) return true;
          if (attackerColor === 'black' && rankDiff === 1 && fileDiff === 1) return true;
        } else {
          return true;
        }
      }
    }
  }
  return false;
};

// Check for checkmate: current player is in check and no legal move gets out of check
const isCheckmate = (color) => {
  if (!isInCheck(color)) return false;
  return !hasLegalMoves(color);
};

// Check for stalemate: not in check but no legal moves available
const isStalemate = (color) => {
  if (isInCheck(color)) return false;
  return !hasLegalMoves(color);
};

// Check if player has any legal move to get out of check or make a move
const hasLegalMoves = (color) => {
  for (const pos in pieces) {
    if (pieces[pos].startsWith(color)) {
      const pieceType = pieces[pos];
      let moves = calculateValidMoves(pos, pieceType);
      if (pieceType.endsWith('king')) {
        const castleMoves = getCastlingMoves(pos, pieceType);
        moves = moves.concat(castleMoves);
      }
      for (const move of moves) {
        if (wouldBeInCheckAfterMove(pos, move, color)) continue;
        return true;
      }
    }
  }
  return false;
};

// Determine if after a hypothetical move, player is still in check (used for legality)
const wouldBeInCheckAfterMove = (from, to, color) => {
  const originalFromPiece = pieces[from];
  const originalToPiece = pieces[to];

  // Move temporarily
  pieces[to] = pieces[from];
  delete pieces[from];

  const inCheck = isInCheck(color);

  // Revert move
  pieces[from] = originalFromPiece;
  if (originalToPiece) pieces[to] = originalToPiece;
  else delete pieces[to];

  return inCheck;
};

// Switch current player
const switchPlayer = () => {
  currentPlayer = opponent(currentPlayer);
  currentPlayerText.textContent = `${capitalize(currentPlayer)}'s turn`;
  currentPlayerIndicator.className = `player-indicator ${currentPlayer}`;
};

// Opponent color helper
const opponent = (color) => color === 'white' ? 'black' : 'white';

// Capitalize string helper
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// Add move to history
const addMoveToHistory = (notation) => {
  moveHistory.push(notation);

  const moveEntry = document.createElement('div');
  moveEntry.className = 'history-item';
  moveEntry.textContent = `${moveHistory.length}. ${notation}`;

  moveHistoryList.appendChild(moveEntry);
  moveHistoryList.scrollTop = moveHistoryList.scrollHeight;
};

// Reset game to initial state
const resetGame = () => {
  pieces = {
    'a1': 'white_rook', 'b1': 'white_knight', 'c1': 'white_bishop', 'd1': 'white_queen',
    'e1': 'white_king', 'f1': 'white_bishop', 'g1': 'white_knight', 'h1': 'white_rook',
    'a2': 'white_pawn', 'b2': 'white_pawn', 'c2': 'white_pawn', 'd2': 'white_pawn',
    'e2': 'white_pawn', 'f2': 'white_pawn', 'g2': 'white_pawn', 'h2': 'white_pawn',
    'a8': 'black_rook', 'b8': 'black_knight', 'c8': 'black_bishop', 'd8': 'black_queen',
    'e8': 'black_king', 'f8': 'black_bishop', 'g8': 'black_knight', 'h8': 'black_rook',
    'a7': 'black_pawn', 'b7': 'black_pawn', 'c7': 'black_pawn', 'd7': 'black_pawn',
    'e7': 'black_pawn', 'f7': 'black_pawn', 'g7': 'black_pawn', 'h7': 'black_pawn'
  };


  selectedSquare = null;
  validMoves = [];
  currentPlayer = 'white';
  moveHistory = [];
  castlingRights = {
    white: { kingside: true, queenside: true },
    black: { kingside: true, queenside: true }
  };
  enPassantTarget = null;

  createBoard();

  moveHistoryList.innerHTML = '';

  currentPlayerText.textContent = "White's turn";
  currentPlayerIndicator.className = "player-indicator white";
};

createBoard();
resetButton.addEventListener('click', resetGame);

document.addEventListener('DOMContentLoaded', function() {
  // Add language toggle button
  let currentLang = localStorage.getItem('chessWorldLang') || 'en';

  // Create language toggle button if it doesn't exist
  if (!document.getElementById('lang-toggle')) {
    const nav = document.querySelector('nav ul');
    const langToggle = document.createElement('li');
    langToggle.innerHTML = `<button id="lang-toggle" class="lang-btn">${currentLang === 'en' ? 'Deutsch' : 'English'}</button>`;
    nav.appendChild(langToggle);

    // Add event listener to the language toggle button
    document.getElementById('lang-toggle').addEventListener('click', toggleLanguage);
  }

  // Apply translations on page load
  applyTranslations();

  // Function to toggle language
  function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'de' : 'en';
    localStorage.setItem('chessWorldLang', currentLang);

    // Update button text
    const langBtn = document.getElementById('lang-toggle');
    langBtn.textContent = currentLang === 'en' ? 'Deutsch' : 'English';

    // Apply translations
    applyTranslations();

    // Update player turn text (chess specific)
    updatePlayerTurnText();
  }

  // Function to apply translations
  function applyTranslations() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (translations[currentLang][key]) {
        element.textContent = translations[currentLang][key];
      }
    });
  }

  // Function to update the player turn text based on the current player
  function updatePlayerTurnText() {
    const playerText = document.getElementById('current-player-text');
    const currentPlayer = playerText.getAttribute('data-current-player') || 'white';
    const key = currentPlayer === 'white' ? 'white_turn' : 'black_turn';
    playerText.textContent = translations[currentLang][key];
  }
});