// block 1-6 + 7-8 also vollständig
// game.js - Vollständige refaktorierte Logik (Multiplayer mit Socket.IO, en passant, Rochade, Fesselungsschutz, UI-Feedback)

// === Globale Variablen und Konstanten ===
const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

let pieces = {};
let selectedSquare = null;
let validMoves = [];
let currentPlayer = 'white';
let moveHistory = [];
let castlingRights = {
  white: { kingside: true, queenside: true },
  black: { kingside: true, queenside: true }
};
let enPassantTarget = null;
let playerColor = null;
let currentRoom = null;

// === DOM-Elemente ===
const chessboard = document.getElementById('chessboard');
const moveHistoryList = document.getElementById('move-history-list');
const currentPlayerText = document.getElementById('current-player-text');
const currentPlayerIndicator = document.getElementById('current-player-indicator');
const resetButton = document.getElementById('reset-game');
const statusMessage = document.getElementById('status-message');

// === Socket.IO Setup ===
const socket = io();
socket.emit('joinRoom');

socket.on('joinedRoom', (room) => {
  currentRoom = room;
  logStatus(`Verbunden mit Raum: ${room}`, 'info');
});

socket.on('gameStart', (players) => {
  playerColor = players.white === socket.id ? 'white' : 'black';
  logStatus(`Spielstart! Du spielst ${playerColor}.`, 'success');
  resetGame();
});

socket.on('move', ({ from, to, notation }) => {
  logStatus(`${notation}`, 'move');
  movePiece(from, to);
  addMoveToHistory(notation);
  switchPlayer();
});

socket.on('resetGame', () => {
  logStatus("Spiel wurde zurückgesetzt.", 'warn');
  resetGame();
});

// === Statusanzeige ===
const showStatus = (msg, type = 'info') => {
  statusMessage.textContent = msg;
  statusMessage.className = 'status-message ' + type;
  setTimeout(() => statusMessage.textContent = '', 4000);
};

const logStatus = (msg, type = 'log') => {
  console.log(`[CLIENT ${type.toUpperCase()}] ${msg}`);
  showStatus(msg, type);
};

const createBoard = () => {
  chessboard.innerHTML = '';
  const displayRanks = playerColor === 'black' ? [...ranks].reverse() : ranks;
  const displayFiles = playerColor === 'black' ? [...files].reverse() : files;

  for (const rank of displayRanks) {
    for (const file of displayFiles) {
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

const clearHighlights = () => {
  document.querySelectorAll('.square.highlight, .square.valid-move').forEach(sq => {
    sq.classList.remove('highlight', 'valid-move');
  });
};

const showValidMoves = (validMoves) => {
  validMoves.forEach(position => {
    const square = document.querySelector(`[data-position="${position}"]`);
    if (square) square.classList.add('valid-move');
  });
};

const handleSquareClick = (event) => {
  if (playerColor !== currentPlayer) return;

  const square = event.currentTarget;
  const position = square.dataset.position;
  const piece = square.querySelector('.piece');

  clearHighlights();

  if (!selectedSquare) {
    if (piece && isPieceOfCurrentPlayer(piece.dataset.piece)) {
      selectedSquare = position;
      square.classList.add('highlight');
      validMoves = getLegalMoves(position, piece.dataset.piece);
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
    let notation = `${pieceType[0].toUpperCase()}${selectedSquare}-${position}`;

    // Rochade
    if (isCastlingMove(selectedSquare, position, selectedPieceElement.dataset.piece)) {
      notation = position[0] === 'g' ? 'O-O' : 'O-O-O';
      performCastling(selectedSquare, position, selectedPieceElement.dataset.piece);
    }
    else {
      // En Passant
      if (isEnPassant(selectedSquare, position, selectedPieceElement.dataset.piece)) {
        notation += ' e.p.';
        handleEnPassant(selectedSquare, position);
      }

      // Promotion
      if (isPromotion(position, selectedPieceElement.dataset.piece)) {
        notation += '=Q';
        handlePromotion(position, selectedPieceElement.dataset.piece);
      }

      movePiece(selectedSquare, position, selectedPieceElement.dataset.piece);
    }

    // Netzwerkzug senden
    socket.emit('move', {
      room: currentRoom,
      from: selectedSquare,
      to: position,
      notation
    });

    addMoveToHistory(notation);
    updateCastlingRights(selectedSquare, selectedPieceElement.dataset.piece);
    updateEnPassantTarget(selectedSquare, position, selectedPieceElement.dataset.piece);

    switchPlayer();
    selectedSquare = null;

    if (isCheckmate(currentPlayer)) {
      logStatus(`Schachmatt! ${capitalize(opponent(currentPlayer))} gewinnt!`, 'win');
    } else if (isInCheck(currentPlayer)) {
      logStatus(`${capitalize(currentPlayer)} ist im Schach!`, 'warn');
    } else if (isStalemate(currentPlayer)) {
      logStatus("Patt! Das Spiel endet unentschieden.", 'info');
    }
  } else {
    if (piece && isPieceOfCurrentPlayer(piece.dataset.piece)) {
      selectedSquare = position;
      square.classList.add('highlight');
      validMoves = getLegalMoves(position, piece.dataset.piece);
      showValidMoves(validMoves);
    } else {
      selectedSquare = null;
    }
  }
};


const getLegalMoves = (from, pieceType) => {
  const all = calculateValidMoves(from, pieceType);
  return all.filter(to => !wouldBeInCheckAfterMove(from, to, currentPlayer));
};

const calculateValidMoves = (position, pieceType) => {
  const [color, type] = pieceType.split('_');
  const [file, rank] = [position.charAt(0), position.charAt(1)];
  const fileIdx = files.indexOf(file);
  const rankIdx = ranks.indexOf(rank);
  const moves = [];

  if (type === 'pawn') {
    const dir = color === 'white' ? -1 : 1;
    const startRank = color === 'white' ? '2' : '7';
    const oneAhead = file + ranks[rankIdx + dir];
    if (ranks[rankIdx + dir] && !pieces[oneAhead]) {
      moves.push(oneAhead);
      if (rank === startRank) {
        const twoAhead = file + ranks[rankIdx + 2 * dir];
        if (!pieces[twoAhead]) moves.push(twoAhead);
      }
    }
    for (const df of [-1, 1]) {
      const nf = fileIdx + df;
      const nr = rankIdx + dir;
      if (nf >= 0 && nf < 8 && nr >= 0 && nr < 8) {
        const diag = files[nf] + ranks[nr];
        if (pieces[diag] && !pieces[diag].startsWith(color)) {
          moves.push(diag);
        }
        if (enPassantTarget === diag) moves.push(diag);
      }
    }
  }

  if (type === 'knight') {
    const offsets = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
    for (const [df, dr] of offsets) {
      const nf = fileIdx + df;
      const nr = rankIdx + dr;
      if (nf >= 0 && nf < 8 && nr >= 0 && nr < 8) {
        const pos = files[nf] + ranks[nr];
        if (!pieces[pos] || !pieces[pos].startsWith(color)) moves.push(pos);
      }
    }
  }

  const slide = (dirs) => {
    for (const [df, dr] of dirs) {
      let nf = fileIdx, nr = rankIdx;
      while (true) {
        nf += df; nr += dr;
        if (nf < 0 || nf >= 8 || nr < 0 || nr >= 8) break;
        const pos = files[nf] + ranks[nr];
        if (!pieces[pos]) moves.push(pos);
        else {
          if (!pieces[pos].startsWith(color)) moves.push(pos);
          break;
        }
      }
    }
  };

  if (type === 'bishop' || type === 'queen') {
    slide([[-1, -1], [-1, 1], [1, -1], [1, 1]]);
  }
  if (type === 'rook' || type === 'queen') {
    slide([[1, 0], [-1, 0], [0, 1], [0, -1]]);
  }

  if (type === 'king') {
    const dirs = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
    for (const [df, dr] of dirs) {
      const nf = fileIdx + df;
      const nr = rankIdx + dr;
      if (nf >= 0 && nf < 8 && nr >= 0 && nr < 8) {
        const pos = files[nf] + ranks[nr];
        if (!pieces[pos] || !pieces[pos].startsWith(color)) moves.push(pos);
      }
    }
    // Rochade
    const castle = getCastlingMoves(position, pieceType);
    castle.forEach(m => moves.push(m));
  }

  return moves;
};


const wouldBeInCheckAfterMove = (from, to, color) => {
  const savedFrom = pieces[from];
  const savedTo = pieces[to];

  pieces[to] = pieces[from];
  delete pieces[from];

  const inCheck = isInCheck(color);

  pieces[from] = savedFrom;
  if (savedTo) pieces[to] = savedTo;
  else delete pieces[to];

  return inCheck;
};

const isInCheck = (color) => {
  const kingPos = findKing(color);
  return isSquareAttacked(kingPos, opponent(color));
};

const findKing = (color) => {
  for (const pos in pieces) {
    if (pieces[pos] === `${color}_king`) return pos;
  }
  return null;
};

const isSquareAttacked = (square, attackerColor) => {
  for (const from in pieces) {
    const piece = pieces[from];
    if (!piece.startsWith(attackerColor)) continue;
    const type = piece.split('_')[1];
    const pseudoMoves = calculateValidMoves(from, piece);

    for (const to of pseudoMoves) {
      if (to === square) {
        if (type !== 'pawn') return true;

        const dx = Math.abs(files.indexOf(from[0]) - files.indexOf(to[0]));
        const dy = parseInt(to[1]) - parseInt(from[1]);
        if ((attackerColor === 'white' && dy === -1 || attackerColor === 'black' && dy === 1) && dx === 1) {
          return true;
        }
      }
    }
  }
  return false;
};


const isCheckmate = (color) => {
  return isInCheck(color) && !hasLegalMoves(color);
};

const isStalemate = (color) => {
  return !isInCheck(color) && !hasLegalMoves(color);
};

const hasLegalMoves = (color) => {
  for (const pos in pieces) {
    if (!pieces[pos].startsWith(color)) continue;
    const legal = getLegalMoves(pos, pieces[pos]);
    if (legal.length > 0) return true;
  }
  return false;
};

const switchPlayer = () => {
  currentPlayer = opponent(currentPlayer);
  currentPlayerText.textContent = `${capitalize(currentPlayer)}'s turn`;
  currentPlayerIndicator.className = `player-indicator ${currentPlayer}`;
};

const opponent = (color) => (color === 'white' ? 'black' : 'white');

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);


const movePiece = (from, to, pieceType = pieces[from]) => {
  const fromSquare = document.querySelector(`[data-position="${from}"]`);
  const toSquare = document.querySelector(`[data-position="${to}"]`);
  const pieceEl = fromSquare.querySelector('.piece');

  if (toSquare.querySelector('.piece')) {
    toSquare.removeChild(toSquare.querySelector('.piece'));
  }

  toSquare.appendChild(pieceEl);
  pieces[to] = pieceType;
  delete pieces[from];
};

const addMoveToHistory = (notation) => {
  moveHistory.push(notation);
  const entry = document.createElement('div');
  entry.className = 'history-item';
  entry.textContent = `${moveHistory.length}. ${notation}`;
  moveHistoryList.appendChild(entry);
  moveHistoryList.scrollTop = moveHistoryList.scrollHeight;
};

const handlePromotion = (position, pieceType) => {
  pieces[position] = currentPlayer + '_queen';
  const square = document.querySelector(`[data-position="${position}"]`);
  if (square) {
    const oldPiece = square.querySelector('.piece');
    if (oldPiece) square.removeChild(oldPiece);
    const newPiece = document.createElement('div');
    newPiece.className = `piece ${currentPlayer}_queen`;
    newPiece.dataset.piece = currentPlayer + '_queen';
    square.appendChild(newPiece);
  }
};

const handleEnPassant = (from, to) => {
  const targetRank = parseInt(to[1]) + (currentPlayer === 'white' ? 1 : -1);
  const capturedPos = to[0] + targetRank;
  delete pieces[capturedPos];

  const capturedSquare = document.querySelector(`[data-position="${capturedPos}"]`);
  if (capturedSquare) {
    const capturedPiece = capturedSquare.querySelector('.piece');
    if (capturedPiece) capturedSquare.removeChild(capturedPiece);
  }
};

const performCastling = (from, to, pieceType) => {
  const color = pieceType.split('_')[0];
  const rank = color === 'white' ? '1' : '8';

  if (to === 'g' + rank) {
    movePiece(from, to);
    movePiece('h' + rank, 'f' + rank);
  } else if (to === 'c' + rank) {
    movePiece(from, to);
    movePiece('a' + rank, 'd' + rank);
  }

  castlingRights[color].kingside = false;
  castlingRights[color].queenside = false;
};


const updateCastlingRights = (from, pieceType) => {
  const color = pieceType.split('_')[0];
  if (pieceType.endsWith('king')) {
    castlingRights[color].kingside = false;
    castlingRights[color].queenside = false;
  }
  if (pieceType.endsWith('rook')) {
    const rank = color === 'white' ? '1' : '8';
    if (from === 'a' + rank) castlingRights[color].queenside = false;
    if (from === 'h' + rank) castlingRights[color].kingside = false;
  }
};

const updateEnPassantTarget = (from, to, pieceType) => {
  enPassantTarget = null;
  if (!pieceType.endsWith('pawn')) return;

  const fromRank = parseInt(from[1]);
  const toRank = parseInt(to[1]);

  if (Math.abs(toRank - fromRank) === 2) {
    const file = from[0];
    const midRank = (fromRank + toRank) / 2;
    enPassantTarget = file + midRank;
  }
};

const isCastlingMove = (from, to, pieceType) => {
  if (!pieceType.endsWith('king')) return false;
  const rank = pieceType.startsWith('white') ? '1' : '8';
  return to === 'g' + rank || to === 'c' + rank;
};

const isEnPassant = (from, to, pieceType) => {
  return pieceType.endsWith('pawn') && enPassantTarget === to;
};

const isPromotion = (to, pieceType) => {
  if (!pieceType.endsWith('pawn')) return false;
  const rank = to[1];
  return (currentPlayer === 'white' && rank === '8') || (currentPlayer === 'black' && rank === '1');
};

const getCastlingMoves = (position, pieceType) => {
  const color = pieceType.split('_')[0];
  if (!pieceType.endsWith('king')) return [];
  const rank = color === 'white' ? '1' : '8';
  const moves = [];

  if (castlingRights[color].kingside &&
      !pieces['f' + rank] && !pieces['g' + rank] &&
      pieces['h' + rank] === `${color}_rook` &&
      !isSquareAttacked(position, opponent(color)) &&
      !isSquareAttacked('f' + rank, opponent(color)) &&
      !isSquareAttacked('g' + rank, opponent(color))) {
    moves.push('g' + rank);
  }

  if (castlingRights[color].queenside &&
      !pieces['b' + rank] && !pieces['c' + rank] && !pieces['d' + rank] &&
      pieces['a' + rank] === `${color}_rook` &&
      !isSquareAttacked(position, opponent(color)) &&
      !isSquareAttacked('d' + rank, opponent(color)) &&
      !isSquareAttacked('c' + rank, opponent(color))) {
    moves.push('c' + rank);
  }

  return moves;
};

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

resetButton.addEventListener('click', () => {
  if (currentRoom) {
    socket.emit('reset', currentRoom);
  } else {
    resetGame(); // falls offline
  }
});

document.addEventListener('DOMContentLoaded', () => {
  if (!playerColor) {
    playerColor = 'white';
    resetGame();
  }
});
