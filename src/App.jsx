import { useState } from "react";

function Square({ value, onSquareClick, isSelected }) {
  return (
    <button
      className="square"
      onClick={onSquareClick}
      style={{ backgroundColor: isSelected ? "#aaf" : undefined }}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, moveCount }) {
  const [selected, setSelected] = useState(null);
  const currentPlayer = xIsNext ? "X" : "O";

  function isAdjacent(a, b) {
    const row1 = Math.floor(a/3), col1 = a % 3;
    const row2 = Math.floor(b/3), col2 = b % 3;
    return Math.abs(row1 - row2) <= 1 && Math.abs(col1 - col2) <= 1 && a !== b;
  }

  function wouldWin(squares, from, to, player) {
    const next = squares.slice();
    if (from !== null) next[from] = null;
    next[to] = player;
    return calculateWinner(next) === player;
  }

  function handleClick(i) {
    if (calculateWinner(squares)) return;

    if (moveCount < 6) {
      if (squares[i]) return;
      const nextSquares = squares.slice();
      nextSquares[i] = currentPlayer;
      onPlay(nextSquares);
      return;
    }

    // movement phase
    if (selected === null) {
      if (squares[i] === currentPlayer) setSelected(i);
      return;
    }

    if (i === selected) {
      setSelected(null);
      return;
    }

    if (squares[i] === currentPlayer) {
      setSelected(i);
      return;
    }

    if (squares[i] !== null) {
        setSelected(null);
        return;
    }

    if (!isAdjacent(selected, i)) {
      setSelected(null);
      return;
    }

    // center rule
    if (squares[4] === currentPlayer) {
      const vacatesCenter = selected === 4;
      const wins = wouldWin(squares, selected, i, currentPlayer);
      if (!vacatesCenter && !wins) {
        setSelected(null);
        return;
      }
    }

    const nextSquares = squares.slice();
    nextSquares[selected] = null;
    nextSquares[i] = currentPlayer;
    setSelected(null);
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + currentPlayer;
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} isSelected={selected === 0} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} isSelected={selected === 1} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} isSelected={selected === 2} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} isSelected={selected === 3} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} isSelected={selected === 4} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} isSelected={selected === 5} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} isSelected={selected === 6} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} isSelected={selected === 7} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} isSelected={selected === 8} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) { setCurrentMove(nextMove); }

  const moves = history.map((squares, move) => {
    let description = move > 0 ? "Go to move #" + move : "Go to game start";
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
          moveCount={currentMove}
        />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (let [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
      return squares[a];
  }
  return null;
}