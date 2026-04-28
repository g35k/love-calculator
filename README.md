# Love Calculator

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![License](https://img.shields.io/badge/License-Personal%2FEducational-lightgrey)](#license)

A cute pixel-style love calculator built with React + Vite.  
Type two names, hit **test!**, and get a playful compatibility score from `0%` to `100%`.

## Preview

### Main Calculator
![Love Calculator UI](assets/calculator.png)

### Match Result Example
![Love Match Result](assets/match.png)

## Features

- Pixel-heart themed UI with animated score reveal
- Floating heart and sparkle effects for high matches
- Deterministic score calculation for the same name pair
- Optional rigged name pairs that can always return `100%`
- Clear/reset button for quick retests

## Tech Stack

- React
- Vite
- JavaScript (ES modules)
- CSS

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Run locally

```bash
npm run dev
```

Open the local URL shown in your terminal (usually `http://localhost:5173`).

## Available Scripts

- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Customize Rigged Pairs

Edit `src/App.jsx` and update the `riggedPairs` set:

```js
const riggedPairs = new Set([
  pairKey("name one", "name two"),
  pairKey("another name", "another name"),
]);
```

Notes:

- Name matching is case/spacing-insensitive.
- Pair order does not matter (`A + B` is the same as `B + A`).
- Add or remove lines in that array to configure your own always-`100%` matches.

## Project Structure

```text
love-calculator/
├── src/
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── assets/                  # README screenshots go here
├── index.html
└── package.json
```

## License

This project is for personal/educational use. Add a license file if you plan to distribute it.
