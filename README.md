# Bedrock Memory Game Test

Objective: Develop a Memory Game as a test of programming skills and understanding of game development concepts.

### Features

- Programming Language: TypeScript.
- Game Engine/Framework: PlayCanvas, WebPack
- Gameplay Mechanics:
The game should be a classic memory game where players flip cards to find matching pairs. The game ends when all pairs are matched. Include at least one level of difficulty (e.g., number of card pairs). Game should be replay-able with cards in random positions on every new game.

### Instructions
- Launch the project from https://playcanvas.com/editor/scene/1936338 or https://playcanv.as/b/1768fa8c/?overlay=false
- Select a level and match the all tiles to complete that level

### Installation
1. `pnpm install`
2. Remove `.sample` from `pcconfig.sample.json` and fill out PlayCanvas project data
3. Follow guide from https://github.com/playcanvas/playcanvas-sync if stuck
4. `pnpm run build:dev:push` to compile and push `main.build.js` to PlayCanvas project
