"use client";
import { useState } from "react";

export default function Game() {
  const [history, setHistory] = useState<(string | null)[][]>([
    Array(9).fill(null),
  ]);
  const [currentMove, setCurrentMove] = useState<number>(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares: (string | null)[]) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    const description = move > 0 ? `Go to move #${move}` : `Go to game start`;
    return (
      <li key={move}>
        {currentMove == move ? (
          <p>You are at move #{move}</p>
        ) : (
          <button onClick={() => jumpTo(move)}>{description}</button>
        )}
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function Square({
  value,
  onSquareClick,
  matchedWinSquare = false,
}: {
  value: string | null;
  onSquareClick: () => void;
  matchedWinSquare: boolean;
}) {
  return (
    <button
      className={`square ${matchedWinSquare && "win-square"}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({
  xIsNext,
  squares,
  onPlay,
}: {
  xIsNext: boolean;
  squares: (string | null)[];
  onPlay: (nextSquares: (string | null)[]) => void;
}) {
  const rowCount = squares.length / 3;
  const columnCount = squares.length / 3;
  const result = calculateWinner(squares);
  const status = result?.winner
    ? `Winner: ${result.winner}`
    : `Next player: ${xIsNext ? "X" : "O"}`;

  function handleClick(i: number) {
    if (squares[i] || calculateWinner(squares)) return;
    const nextSquares = squares?.slice();
    xIsNext ? (nextSquares[i] = "X") : (nextSquares[i] = "O");
    onPlay(nextSquares);
  }

  return (
    <>
      <div className="status">{status}</div>
      {Array(rowCount)
        .fill(null)
        .map((_, rowIndex) => (
          <div key={rowIndex} className="board-row">
            {Array(columnCount)
              .fill(null)
              .map((_, columnIndex) => {
                const index = rowIndex * 3 + columnIndex;
                return (
                  <Square
                    key={index}
                    value={squares[index]}
                    onSquareClick={() => handleClick(index)}
                    matchedWinSquare={
                      result?.matchedSquare.includes(index) ?? false
                    }
                  />
                );
              })}
          </div>
        ))}
    </>
  );
}

function calculateWinner(square: (string | null)[]) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (square[a] && square[a] === square[b] && square[a] === square[c]) {
      return { winner: square[a], matchedSquare: [a, b, c] };
    }
  }
  return null;
}

function findRowAndColumn(
  squares: (string | null)[],
  rowSize: number,
  columnSize: number
) {
  const moveIndex = squares.findIndex((value) => value);
}
