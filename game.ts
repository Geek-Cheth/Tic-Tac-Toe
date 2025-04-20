// Tic Tac Toe Game in TypeScript

type Player = "X" | "O";
type Cell = Player | "";

class TicTacToe {
  board: Cell[];
  currentPlayer: Player;
  isGameOver: boolean;
  statusElem: HTMLElement;
  boardElem: HTMLElement;
  restartBtn: HTMLElement;

  constructor() {
    this.board = Array(9).fill("");
    this.currentPlayer = "X";
    this.isGameOver = false;
    this.statusElem = document.getElementById("status")!;
    this.boardElem = document.getElementById("game-board")!;
    this.restartBtn = document.getElementById("restart-btn")!;
    this.init();
  }

  init() {
    this.renderBoard();
    this.setStatus("Your turn (X)");
    this.boardElem.addEventListener("click", (e) => this.handleCellClick(e));
    this.restartBtn.addEventListener("click", () => this.restart());
  }

  renderBoard() {
    this.boardElem.innerHTML = "";
    this.board.forEach((cell, idx) => {
      const cellDiv = document.createElement("div");
      cellDiv.className = "cell";
      cellDiv.dataset.index = idx.toString();
      cellDiv.textContent = cell;
      this.boardElem.appendChild(cellDiv);
    });
  }

  handleCellClick(e: Event) {
    if (this.isGameOver) return;
    const target = e.target as HTMLElement;
    if (!target.classList.contains("cell")) return;
    const idx = parseInt(target.dataset.index!);
    if (this.board[idx] !== "") return;

    this.makeMove(idx, "X");
    if (!this.isGameOver) {
      setTimeout(() => this.botMove(), 400);
    }
  }

  makeMove(idx: number, player: Player) {
    if (this.board[idx] !== "" || this.isGameOver) return;
    this.board[idx] = player;
    this.renderBoard();
    if (this.checkWin(player)) {
      this.setStatus(player === "X" ? "You win! 🎉" : "Bot wins! 🤖");
      this.isGameOver = true;
      return;
    }
    if (this.board.every(cell => cell !== "")) {
      this.setStatus("It's a draw! 🤝");
      this.isGameOver = true;
      return;
    }
    this.currentPlayer = player === "X" ? "O" : "X";
    this.setStatus(this.currentPlayer === "X" ? "Your turn (X)" : "Bot's turn (O)");
  }

  botMove() {
    if (this.isGameOver) return;
    // Simple AI: pick random empty cell
    const emptyCells = this.board
      .map((cell, idx) => (cell === "" ? idx : -1))
      .filter(idx => idx !== -1) as number[];
    if (emptyCells.length === 0) return;
    const move = this.findBestMove() ?? emptyCells[Math.floor(Math.random() * emptyCells.length)];
    this.makeMove(move, "O");
  }

  // Minimax for unbeatable AI
  findBestMove(): number | null {
    let bestScore = -Infinity;
    let move: number | null = null;
    for (let i = 0; i < 9; i++) {
      if (this.board[i] === "") {
        this.board[i] = "O";
        const score = this.minimax(0, false);
        this.board[i] = "";
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  }

  minimax(depth: number, isMaximizing: boolean): number {
    if (this.checkWin("O")) return 10 - depth;
    if (this.checkWin("X")) return depth - 10;
    if (this.board.every(cell => cell !== "")) return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (this.board[i] === "") {
          this.board[i] = "O";
          const score = this.minimax(depth + 1, false);
          this.board[i] = "";
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (this.board[i] === "") {
          this.board[i] = "X";
          const score = this.minimax(depth + 1, true);
          this.board[i] = "";
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  }

  checkWin(player: Player): boolean {
    const winPatterns = [
      [0,1,2],[3,4,5],[6,7,8], // rows
      [0,3,6],[1,4,7],[2,5,8], // cols
      [0,4,8],[2,4,6]          // diags
    ];
    return winPatterns.some(pattern =>
      pattern.every(idx => this.board[idx] === player)
    );
  }

  setStatus(msg: string) {
    this.statusElem.textContent = msg;
  }

  restart() {
    this.board = Array(9).fill("");
    this.currentPlayer = "X";
    this.isGameOver = false;
    this.renderBoard();
    this.setStatus("Your turn (X)");
  }
}

// Wait for DOM to load
window.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");
  const container = document.querySelector(".container") as HTMLElement | null;
  setTimeout(() => {
    if (loader) loader.style.display = "none";
    if (container) {
      container.style.display = "block";
      console.log("Container shown, loader hidden.");
    }
    new TicTacToe();
  }, 800);
});