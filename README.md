# Wumpus World 🕹️

A playable, browser-based version of **Wumpus World** — the classic AI benchmark used to teach knowledge-based agents, logical inference, and reasoning under partial observability.

No build tools, no dependencies, no server. Open one HTML file and play.

**[▶ Play it live](#)** &nbsp;·&nbsp; *(replace this link once deployed to GitHub Pages — see below)*

---

## What is Wumpus World?

Wumpus World is a grid-based environment first introduced in *Artificial Intelligence: A Modern Approach* (Russell & Norvig). An agent is dropped into a cave it cannot see. It can only sense the cells directly next to it — a **stench** means a Wumpus is nearby, a **breeze** means a pit is nearby. Using nothing but those clues, the agent has to logically deduce which cells are safe, find the gold, and climb back out alive.

It's a small environment, but it's a real one: **partially observable, deterministic, sequential, static, discrete, single-agent** — the same properties that make reasoning hard in much larger AI problems.

This project turns that textbook example into something you can actually click through and play.

---

## Features

- 🗺️ **Fog-of-war grid** (4×4, 5×5, or 6×6) — only visited cells reveal what's around them
- 🧠 **Percept-driven reasoning** — stench, breeze, glitter, bump, and scream are logged and shown as icons, so you deduce safe cells the same way a logical agent would
- 🎯 **Full classic ruleset** — one arrow, one Wumpus, randomly placed pits, gold retrieval, and an entrance you must return to in order to win
- 🏆 **AIMA-standard scoring** — −1 per action, −10 for shooting, +1000 for gold, −1000 for death
- ⌨️ **Keyboard + on-screen controls** — play with `WASD`/arrow keys or tap the on-screen d-pad
- 👁️ **Debug map reveal** — toggle the full map to see pit/Wumpus/gold placement, useful for demos or teaching
- 📱 **Responsive** — works on desktop and mobile
- 📦 **Zero dependencies** — a single self-contained HTML file

---

## How to play

| Goal | Find the gold and climb back out through [1,1] — without stepping on a pit or the Wumpus |
|---|---|
| Start | [1,1], facing East |
| Percepts | Felt only in your current cell, based on what's in the *adjacent* cells |

### Percept guide

| Icon | Percept | Meaning |
|---|---|---|
| 💨 | Stench | The Wumpus is in an adjacent cell |
| 🌬️ | Breeze | A pit is in an adjacent cell |
| ✨ | Glitter | Gold is in this cell |
| 🧱 | Bump | You walked into a cave wall |
| 😱 | Scream | Your arrow just killed the Wumpus |

### Controls

| Action | Key | Button |
|---|---|---|
| Move forward | `W` / `↑` | ⬆ |
| Turn left | `A` / `←` | ↺ |
| Turn right | `D` / `→` | ↻ |
| Grab gold | `G` / `Space` | 💰 Grab |
| Shoot arrow | `F` | 🏹 Shoot |
| Climb out | `C` | 🪜 Climb Out |

### Scoring

| Event | Points |
|---|---|
| Any action (move, turn, grab, climb) | −1 |
| Shooting an arrow | −10 |
| Climbing out with the gold | +1000 |
| Falling in a pit or meeting the Wumpus | −1000 |

---

## Tech stack

Plain, vanilla, and dependency-free:

- **HTML5** for structure
- **CSS3** (custom properties, CSS Grid) for layout and theming
- **Vanilla JavaScript** for all game logic — world generation, percepts, scoring, rendering
- **Google Fonts** (`Bungee`, `Manrope`) loaded via CDN — the only external request the page makes

There is no framework, bundler, or package manager involved. The entire game lives in one file.

---

## Project structure

```
wumpus-world/
├── wumpus-world.html    # the entire game — markup, styles, and logic
└── README.md
```

---

## Running it locally

Clone the repo and open the file — that's it:

```bash
git clone https://github.com/<your-username>/wumpus-world.git
cd wumpus-world
open wumpus-world.html      # macOS
# or just double-click wumpus-world.html in your file explorer
```

---

## Deploying to GitHub Pages

1. Push this repo to GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to `Deploy from a branch`.
4. Choose the `main` branch and `/ (root)` folder, then **Save**.
5. GitHub will publish the site at:
   ```
   https://<your-username>.github.io/wumpus-world/wumpus-world.html
   ```

If you'd rather the game load at the root URL (`.../wumpus-world/`), rename `wumpus-world.html` to `index.html` before pushing.

---

## Roadmap ideas

Not implemented yet, but natural next steps if you want to extend it:

- [ ] Solver mode: highlight cells the agent can *prove* are safe using logical inference
- [ ] Multiple Wumpuses / multiple arrows
- [ ] Move history replay
- [ ] Local leaderboard (best score per grid size)

---

## Credits

Built for **Sri Sathya Sai Vidya Vahini**, an inclusive education initiative. Game rules follow the classic Wumpus World specification from *Artificial Intelligence: A Modern Approach* (Russell & Norvig).

## License

MIT — free to use, modify, and share.
