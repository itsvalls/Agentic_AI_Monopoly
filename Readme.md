# Monopoly AI Concepts Demo

A web-based Monopoly game implementation with integrated AI gameplay and interactive demonstrations of classical artificial intelligence concepts.

## Overview

This project combines a fully functional Monopoly board game with educational AI demonstrations, allowing players to:

- Play Monopoly against AI or human opponents (2–8 players)
- Explore classical AI concepts through interactive demos
- Visualize game statistics and analytics
- Learn about search algorithms, constraint satisfaction, and rule-based inference

---
<img width="1887" height="905" alt="image" src="https://github.com/user-attachments/assets/84acc878-e449-432f-bd60-45cf69aabb3b" />

<img width="1078" height="641" alt="image" src="https://github.com/user-attachments/assets/6a53973b-6e26-45f5-ba0e-88d8b8588757" />

<img width="832" height="535" alt="image" src="https://github.com/user-attachments/assets/c6388433-35c0-4943-9824-8e9735d15dec" />

<img width="775" height="856" alt="image" src="https://github.com/user-attachments/assets/178088dd-3f85-448c-b491-2da422e8aca0" />



## Features

### Game Features
- Full Monopoly gameplay with Classic or NYC edition boards  
- AI opponents with configurable strategies  
- Property management including buying, mortgaging, and building houses/hotels  
- Trading system for property exchanges between players  
- Auction mechanism for unowned properties  
- Visual property deeds and hover previews  
- Bankruptcy and debt management  

### AI Demonstrations
The game includes educational demos of classical AI techniques:

#### Constraint Satisfaction Problem (CSP)
- Even building distribution on color groups  
- Cryptarithmetic solver (SEND + MORE = MONEY)

#### Rule-Based Inference
- Forward chaining for gameplay recommendations  
- Backward chaining for goal justification  

#### Cash Target Planner
- CSP + backtracking to plan property liquidation  
- Respects Monopoly building/mortgage constraints  

#### Search Algorithms (Implementation Framework)
- BFS, DFS, Uniform Cost Search  
- Greedy Best-First, A*  
- Minimax and Alpha-Beta pruning  

---

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)  
- No server required — runs entirely client-side  

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/monopoly-ai-concepts.git
   cd monopoly-ai-concepts

---
### Project Structure

monopoly-ai-concepts/
├── index.html              # Main game page
├── styles.css              # Game styling
├── monopoly.js             # Core game logic
├── classicedition.js       # Classic Monopoly board/cards
├── newyorkcityedition.js   # NYC edition board/cards
├── ai.js                   # AI player implementation
├── ai_concepts.js          # Educational AI demos
├── images/                 # Game assets
│   ├── dice/
│   ├── icons/
│   └── tokens/
└── README.md

### Acknowledgements
Acknowledgments

Original Monopoly game design by Hasbro

Educational AI concepts inspired by Russell & Norvig's "Artificial Intelligence: A Modern Approach"

Chart.js for analytics visualization
