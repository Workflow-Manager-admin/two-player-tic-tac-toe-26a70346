import React, { useState, useEffect } from 'react';
import './App.css';

// Theme colors (see README/project requirements)
const COLOR_PRIMARY = "#1976d2";
const COLOR_ACCENT = "#ff4081";
const COLOR_SECONDARY = "#424242";

// Helper to calculate winner and draw
function checkWinner(board) {
  const lines = [
    [0,1,2], [3,4,5], [6,7,8], // Rows
    [0,3,6], [1,4,7], [2,5,8], // Cols
    [0,4,8], [2,4,6]           // Diags
  ];
  for (let line of lines) {
    const [a,b,c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return null;
}
function checkDraw(board) {
  return board.every(cell => cell) && !checkWinner(board);
}

// PUBLIC_INTERFACE
function App() {
  // true->Player X, false->Player O
  const [xIsNext, setXIsNext] = useState(true);
  // 1D array, 0-8 squares
  const [board, setBoard] = useState(Array(9).fill(''));
  const [winner, setWinner] = useState(null);
  const [draw, setDraw] = useState(false);
  // scores: [X, O]
  const [scores, setScores] = useState([0, 0]);

  // theme management (keep existing light/dark toggle)
  const [theme, setTheme] = useState('light');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  // Check for winner/draw on each board update
  useEffect(() => {
    const theWinner = checkWinner(board);
    setWinner(theWinner);
    setDraw(!theWinner && checkDraw(board));
    // Only update scores on first win detection
    if (theWinner && board.filter(cell => cell).length > 2) {
      setScores(([x, o]) =>
        theWinner === 'X' ? [x+1, o] : [x, o+1]
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board]);

  // PUBLIC_INTERFACE
  function handleSquareClick(idx) {
    // Ignore if not empty or game finished
    if (board[idx] || winner) return;
    const copy = board.slice();
    copy[idx] = xIsNext ? 'X' : 'O';
    setBoard(copy);
    setXIsNext(prev => !prev);
  }

  // PUBLIC_INTERFACE
  function handleReset() {
    setBoard(Array(9).fill(''));
    setWinner(null);
    setDraw(false);
    setXIsNext((prev) => (draw || winner === 'O' ? true : false)); // X starts new game unless O just won
  }

  function handleResetScores() {
    setScores([0,0]);
    handleReset();
  }

  const playerLabel = (xIsNext ? "X" : "O");
  const playerColor = xIsNext ? COLOR_PRIMARY : COLOR_ACCENT;
  const statusMsg = winner
    ? (winner === 'X' ? "Player X wins!" : "Player O wins!")
    : draw
    ? "It's a draw!"
    : `Turn: Player ${playerLabel}`;

  return (
    <div className="App" style={{background: "var(--bg-primary)", minHeight: "100vh"}}>
      <header className="ttt-header">
        <button className="theme-toggle" onClick={toggleTheme}
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <h1 className="ttt-title" style={{color: COLOR_SECONDARY, letterSpacing: 1}}>Tic Tac Toe</h1>
        <div className="ttt-scores" aria-label="Scoreboard">
          <span className="score-x" style={{color: COLOR_PRIMARY}}>X: {scores[0]}</span>
          <span className="divider">|</span>
          <span className="score-o" style={{color: COLOR_ACCENT}}>O: {scores[1]}</span>
        </div>
        <div className="ttt-controls">
          <button className="ttt-btn" onClick={handleReset}
                  style={{backgroundColor: COLOR_SECONDARY}}>
            New Game
          </button>
          <button className="ttt-btn ttt-btn-small" onClick={handleResetScores}
                  style={{backgroundColor: COLOR_ACCENT, color: "#fff"}} tabIndex={-1}>
            Reset Scores
          </button>
        </div>
      </header>
      <main className="ttt-main">
        <div className="ttt-status"
             style={{
                color: winner ? (winner === "X" ? COLOR_PRIMARY : COLOR_ACCENT) : (draw ? COLOR_SECONDARY : playerColor),
                fontWeight: 600,
                marginBottom: 15
             }}>
          {statusMsg}
        </div>
        <div className="ttt-board">
          {board.map((val, idx) =>
            <button
              key={idx}
              className="ttt-square"
              data-testid={`cell-${idx}`}
              style={{
                color: val==="X" ? COLOR_PRIMARY : val==="O" ? COLOR_ACCENT : COLOR_SECONDARY,
                background: "#fff",
                border: `2px solid ${COLOR_SECONDARY}`,
                cursor: !val && !winner ? "pointer" : "default"
              }}
              onClick={() => handleSquareClick(idx)}
              disabled={!!winner || !!val}
              aria-label={`cell ${idx+1}${val? `: ${val}`:''}`}
            >
              {val}
            </button>
          )}
        </div>
      </main>
      <footer className="ttt-footer">
        <span className="footer-text">
          Two Player Tic Tac Toe | <a href="https://reactjs.org/" className="ttt-link">React</a>
        </span>
      </footer>
    </div>
  );
}

export default App;
