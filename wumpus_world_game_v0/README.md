# Wumpus World — AI Reasoning Game

A zero-dependency browser game based on the Wumpus World AI concept.

## Run

No Node.js, npm, Python server, or installation is required.

### Option 1 — easiest
Double-click `index.html` and open it in a modern browser.

### Option 2 — VS Code
Open the `wumpus_world_game` folder in VS Code and open `index.html` with a Live Server extension if you already have one.

## Gameplay

- Start at [1,1].
- The board is 4×4.
- Wumpus and pits are hidden.
- Gold must be collected.
- Return to [1,1] and press Climb to win.
- Falling into a pit or entering the Wumpus square loses.
- You have one arrow.
- Shoot in the direction you are facing.
- Percepts:
  - STENCH → Wumpus nearby
  - BREEZE → Pit nearby
  - GLITTER → Gold here
  - BUMP → Wall
  - SCREAM → Wumpus killed

## Controls

W / ↑ = Move Forward
A / ← = Turn Left
D / → = Turn Right
G = Grab
S = Shoot
C = Climb

## Files

- `index.html` — game interface
- `styles.css` — visual design
- `game.js` — game engine, world generation, percepts, scoring and controls

## Educational purpose

The game is designed to make the AI concepts from Wumpus World interactive:
Percepts + Knowledge + Logic → Reasoning → Action.

It demonstrates partially observable decision making and the basic logical inference rule:
NO BREEZE → adjacent squares contain no pits.
