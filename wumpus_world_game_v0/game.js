const SIZE = 4;
const START = { x: 0, y: 0 };
const DIRECTIONS = [
  { dx: 0, dy: -1, icon: "↑", name: "North" },
  { dx: 1, dy: 0, icon: "→", name: "East" },
  { dx: 0, dy: 1, icon: "↓", name: "South" },
  { dx: -1, dy: 0, icon: "←", name: "West" }
];

let state;

const $ = id => document.getElementById(id);

function key(x, y) { return `${x},${y}`; }
function inside(x, y) { return x >= 0 && x < SIZE && y >= 0 && y < SIZE; }
function neighbors(x, y) {
  return DIRECTIONS.map(d => ({ x: x + d.dx, y: y + d.dy }))
    .filter(p => inside(p.x, p.y));
}

function randomWorld() {
  // Keep the start square and its immediate neighbours free of hazards.
  const candidates = [];
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (x === 0 && y === 0) continue;
      if (Math.abs(x) + Math.abs(y) <= 1) continue;
      candidates.push({x, y});
    }
  }

  const shuffled = [...candidates].sort(() => Math.random() - 0.5);
  const wumpus = shuffled[0];
  const gold = shuffled[1];
  const pits = shuffled.slice(2, 5);

  return {
    wumpus,
    gold,
    pits,
    player: { ...START },
    dir: 1, // East
    arrow: 1,
    goldTaken: false,
    wumpusAlive: true,
    visited: new Set([key(0, 0)]),
    bump: false,
    scream: false,
    score: 0,
    ended: false
  };
}

function newGame() {
  state = randomWorld();
  hideModal();
  render();
  setMessage("Explore carefully. Your starting square is safe.");
}

function hasPit(x, y) {
  return state.pits.some(p => p.x === x && p.y === y);
}
function hasWumpus(x, y) {
  return state.wumpusAlive && state.wumpus.x === x && state.wumpus.y === y;
}
function hasGold(x, y) {
  return !state.goldTaken && state.gold.x === x && state.gold.y === y;
}

function currentPercepts() {
  const {x, y} = state.player;
  const adj = neighbors(x, y);
  return {
    stench: state.wumpusAlive && adj.some(p => hasWumpus(p.x, p.y)),
    breeze: adj.some(p => hasPit(p.x, p.y)),
    glitter: hasGold(x, y),
    bump: state.bump,
    scream: state.scream
  };
}

function setMessage(text) {
  $("message").textContent = text;
}

function moveForward() {
  if (state.ended) return;
  const d = DIRECTIONS[state.dir];
  const nx = state.player.x + d.dx;
  const ny = state.player.y + d.dy;
  state.bump = false;
  state.scream = false;

  if (!inside(nx, ny)) {
    state.bump = true;
    state.score -= 1;
    setMessage("💥 BUMP! You hit the cave wall.");
    render();
    return;
  }

  state.player = {x: nx, y: ny};
  state.visited.add(key(nx, ny));
  state.score -= 1;

  if (hasPit(nx, ny)) {
    state.ended = true;
    state.score -= 1000;
    render();
    showModal("💀", "You Fell Into a Pit!", "The agent entered a dangerous square. Use BREEZE clues to avoid pits.");
    return;
  }

  if (hasWumpus(nx, ny)) {
    state.ended = true;
    state.score -= 1000;
    render();
    showModal("🐲", "The Wumpus Got You!", "A Wumpus occupies this square. Use STENCH clues and logical inference to stay safe.");
    return;
  }

  const p = currentPercepts();
  if (p.glitter) setMessage("✨ GLITTER! The gold is here. Press Grab.");
  else if (p.stench && p.breeze) setMessage("⚠️ STENCH + BREEZE! A Wumpus and/or pit may be nearby. Think before moving.");
  else if (p.stench) setMessage("👃 STENCH! A Wumpus is in an adjacent square.");
  else if (p.breeze) setMessage("💨 BREEZE! A pit is in an adjacent square.");
  else setMessage("🧠 No Breeze + No Stench: adjacent squares are safe from pits and the Wumpus.");
  render();
}

function turn(delta) {
  if (state.ended) return;
  state.dir = (state.dir + delta + 4) % 4;
  state.bump = false;
  state.scream = false;
  state.score -= 1;
  setMessage(`↻ Turned ${DIRECTIONS[state.dir].name}.`);
  render();
}

function grab() {
  if (state.ended) return;
  state.bump = false;
  state.scream = false;
  if (hasGold(state.player.x, state.player.y)) {
    state.goldTaken = true;
    state.score += 1000;
    setMessage("💰 GOLD GRABBED! Now return to [1,1] and climb out.");
  } else {
    state.score -= 2;
    setMessage("Nothing to grab here.");
  }
  render();
}

function shoot() {
  if (state.ended) return;
  state.bump = false;
  state.scream = false;

  if (state.arrow <= 0) {
    setMessage("🏹 No arrows left.");
    return;
  }

  state.arrow--;
  state.score -= 10;

  const d = DIRECTIONS[state.dir];
  let x = state.player.x + d.dx;
  let y = state.player.y + d.dy;
  let hit = false;

  while (inside(x, y)) {
    if (hasWumpus(x, y)) {
      state.wumpusAlive = false;
      state.scream = true;
      state.score += 500;
      hit = true;
      break;
    }
    x += d.dx;
    y += d.dy;
  }

  setMessage(hit ? "📢 SCREAM! You killed the Wumpus!" : "🏹 Arrow missed. The Wumpus is still alive.");
  render();
}

function climb() {
  if (state.ended) return;
  if (state.player.x !== 0 || state.player.y !== 0) {
    setMessage("🚪 You can only climb out from the starting square [1,1].");
    return;
  }
  if (!state.goldTaken) {
    setMessage("❌ You need to grab the gold before escaping.");
    return;
  }

  state.ended = true;
  state.score += 500;
  render();
  showModal("🏆", "Excellent! You Escaped!", `Final score: ${state.score}. You used percepts and logical reasoning like a knowledge-based agent.`);
}

function render() {
  renderStats();
  renderBoard();
  renderPercepts();
  renderKnowledge();
}

function renderStats() {
  $("score").textContent = state.score;
  $("lives").textContent = state.ended ? "0" : "1";
  $("arrows").textContent = state.arrow;
  $("position").textContent = `[${state.player.x + 1},${SIZE - state.player.y}]`;
}

function renderBoard() {
  const board = $("board");
  board.innerHTML = "";

  // Display y=3 first so visual coordinates read bottom-left as [1,1].
  for (let y = SIZE - 1; y >= 0; y--) {
    for (let x = 0; x < SIZE; x++) {
      const cell = document.createElement("div");
      const k = key(x, y);
      const visited = state.visited.has(k);
      const current = state.player.x === x && state.player.y === y;

      cell.className = `cell ${visited ? "visited" : "hidden-cell"} ${current ? "current" : ""}`;
      cell.innerHTML = `<span class="coord">[${x + 1},${SIZE - y}]</span>`;

      if (current) {
        cell.innerHTML += `<span>🤖</span><span class="arrow">${DIRECTIONS[state.dir].icon}</span>`;
      } else if (visited) {
        if (hasGold(x, y)) cell.innerHTML += `<span>💰</span>`;
        else cell.innerHTML += `<span class="cell-label">explored</span>`;
      }

      // Reveal hazards only after the game ends.
      if (state.ended) {
        if (hasPit(x, y)) cell.innerHTML += `<span>🕳️</span>`;
        if (hasWumpus(x, y)) cell.innerHTML += `<span>🐲</span>`;
        if (!state.goldTaken && state.gold.x === x && state.gold.y === y) cell.innerHTML += `<span>💰</span>`;
      }

      board.appendChild(cell);
    }
  }
}

function perceptRow(icon, name, desc, on) {
  return `<div class="percept ${on ? "on" : ""}">
    <span class="icon">${icon}</span>
    <div><b>${name}</b><small>${on ? desc : "Not detected here"}</small></div>
  </div>`;
}

function renderPercepts() {
  const p = currentPercepts();
  $("percepts").innerHTML = [
    perceptRow("🟢", "STENCH", "Wumpus nearby", p.stench),
    perceptRow("💨", "BREEZE", "Pit nearby", p.breeze),
    perceptRow("✨", "GLITTER", "Gold is here", p.glitter),
    perceptRow("💥", "BUMP", "Wall hit", p.bump),
    perceptRow("📢", "SCREAM", "Wumpus killed", p.scream)
  ].join("");
}

function renderKnowledge() {
  const p = currentPercepts();
  const facts = [];

  if (!p.breeze) {
    facts.push("NO BREEZE → adjacent squares contain no pits.");
  }
  if (!p.stench) {
    facts.push("NO STENCH → adjacent squares contain no living Wumpus.");
  }
  if (p.breeze) {
    facts.push("BREEZE → at least one adjacent square may contain a pit.");
  }
  if (p.stench) {
    facts.push("STENCH → at least one adjacent square may contain the Wumpus.");
  }
  if (p.glitter) {
    facts.push("GLITTER → the gold is in the current square.");
  }

  $("knowledge").innerHTML = facts.length
    ? facts.map(f => `<div class="fact">🧠 ${f}</div>`).join("")
    : "<p>No special percepts. Use the safe-square rule and explore.</p>";
}

function showModal(icon, title, text) {
  $("modalIcon").textContent = icon;
  $("modalTitle").textContent = title;
  $("modalText").textContent = text;
  $("modal").classList.remove("hidden");
}

function hideModal() {
  $("modal").classList.add("hidden");
}

document.querySelectorAll("[data-action]").forEach(btn => {
  btn.addEventListener("click", () => {
    const action = btn.dataset.action;
    if (action === "forward") moveForward();
    if (action === "turnLeft") turn(-1);
    if (action === "turnRight") turn(1);
    if (action === "grab") grab();
    if (action === "shoot") shoot();
    if (action === "climb") climb();
  });
});

$("newGameBtn").addEventListener("click", newGame);
$("modalNewGame").addEventListener("click", newGame);

document.addEventListener("keydown", e => {
  if (["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) return;
  const k = e.key.toLowerCase();

  if (k === "w" || e.key === "ArrowUp") { e.preventDefault(); moveForward(); }
  else if (k === "a" || e.key === "ArrowLeft") { e.preventDefault(); turn(-1); }
  else if (k === "d" || e.key === "ArrowRight") { e.preventDefault(); turn(1); }
  else if (k === "g") grab();
  else if (k === "s") shoot();
  else if (k === "c") climb();
});

newGame();
