const grid = document.getElementById("grid");
const gridSize = 10; // The size of the grid (10x10)
const cellCount = gridSize * gridSize; // Total number of cells in the grid

let playerPos; // Position of the player
let killerPos; // Position of the killer
const objects = {}; // 'pallet' | 'bush' | 'generator'

// Function to generate a random position, excluding already used positions
function getRandomPosition(exclude = []) {
  let pos;
  while (true) {
    pos = Math.floor(Math.random() * cellCount); // Random position in the grid
    if (!exclude.includes(pos)) return pos; // Ensure the position is not already used
  }
}

// Initialize game data (run once at the start of the game)
function setupData() {
  const exclude = [];

  // Set random positions for the player and killer
  playerPos = getRandomPosition();
  exclude.push(playerPos);

  killerPos = getRandomPosition(exclude);
  exclude.push(killerPos);

  // Place 5 pallets randomly
  for (let i = 0; i < 5; i++) {
    const pos = getRandomPosition(exclude);
    exclude.push(pos);
    objects[pos] = "pallet";
  }

  // Place 4 bushes randomly
  for (let i = 0; i < 4; i++) {
    const pos = getRandomPosition(exclude);
    exclude.push(pos);
    objects[pos] = "bush";
  }

  // Place 2 generators randomly
  for (let i = 0; i < 2; i++) {
    const pos = getRandomPosition(exclude);
    exclude.push(pos);
    objects[pos] = "generator";
  }
}

// Function to render the grid on the screen
function drawGrid() {
  grid.innerHTML = ""; // Clear the previous grid
  for (let i = 0; i < cellCount; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell"); // Add the 'cell' class to each grid cell

    // Add specific classes based on player, killer, and objects
    if (i === playerPos) cell.classList.add("player");
    else if (i === killerPos) cell.classList.add("killer");
    else if (objects[i]) cell.classList.add(objects[i]);

    grid.appendChild(cell); // Add the cell to the grid
  }
}

// Function to check if two positions are adjacent (player and killer)
function isAdjacent(pos1, pos2) {
  const row1 = Math.floor(pos1 / gridSize); // Calculate row for pos1
  const col1 = pos1 % gridSize; // Calculate column for pos1
  const row2 = Math.floor(pos2 / gridSize); // Calculate row for pos2
  const col2 = pos2 % gridSize; // Calculate column for pos2

  const rowDiff = Math.abs(row1 - row2); // Difference in rows
  const colDiff = Math.abs(col1 - col2); // Difference in columns

  // Positions are adjacent if row and column differences are both <= 1
  return rowDiff <= 1 && colDiff <= 1;
}

// Function to move the player by one cell
function movePlayer(direction) {
  const row = Math.floor(playerPos / gridSize); // Calculate the row of the current position
  const col = playerPos % gridSize; // Calculate the column of the current position

  let newRow = row;
  let newCol = col;

  // Update row/column based on the pressed direction key
  if (direction === "w") newRow--; // Move up
  if (direction === "s") newRow++; // Move down
  if (direction === "a") newCol--; // Move left
  if (direction === "d") newCol++; // Move right

  // Prevent moving outside the grid
  if (newRow < 0 || newRow >= gridSize || newCol < 0 || newCol >= gridSize) return;

  const newPos = newRow * gridSize + newCol; // Calculate new position in 1D

  // Check if the new position is blocked by an object (e.g., generator or pallet)
  if (objects[newPos] === "generator" || objects[newPos] === "pallet") {
    return; 
  }

  // Update player position
  playerPos = newPos;

  // Check if the player is adjacent to the killer (game over)
  if (isAdjacent(playerPos, killerPos)) {
    playGameOverSound(); 
    setTimeout(() => {
      alert("Game Over!!!"); 
    }, 100); 
  }

  drawGrid(); 
}

// Function to play background music (looped)
function playBackgroundMusic() {
  const bgm = new Audio("sounds/bgm.mp3"); 
  bgm.loop = true; 
  bgm.volume = 0.5; 
  bgm.play();
}

// Function to play the game over sound
function playGameOverSound() {
  const audio = new Audio("sounds/gameover.mp3"); 
  audio.play();
}

// Initialize the game
setupData();
drawGrid();
playBackgroundMusic(); 

// Listen for keydown events to move the player
document.addEventListener("keydown", (e) => {
  if (["w", "a", "s", "d"].includes(e.key)) {
    movePlayer(e.key); 
  }
});
