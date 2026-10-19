# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



# Minjuu Cosmetics

A modern, responsive cosmetics website developed using ReactJS,
Vite, JavaScript, and Docker.

## Technologies

- ReactJS
- Vite
- JavaScript
- Docker
- Docker Compose
- Git & GitHub

## Requirements

Before starting, install:

- Git
- Docker Engine
- Docker Compose

Node.js and npm do not need to be installed locally.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/cherrycheeks-cosmetiecs.git
```

### 2. Enter the project directory

```bash
cd cherrycheeks-cosmetics
```

### 3. Start the application using Docker

```bash
docker compose up --build
```

Docker will automatically install the project dependencies and start the React development server.

### 4. Open the application

Visit:

http://localhost:5173/

## Stop the Application

Press Ctrl + C, then run:

```bash
docker compose down
```

## Install New Dependencies

For example, to install Lucide React icons:

```bash
docker compose run --rm frontend npm install lucide-react
```

Commit both `package.json` and `package-lock.json` after installing a new dependency.

## Team Development

Each team member should work on a separate feature branch.

Example:

```bash
git switch -c feature/home
```

After completing your work:

```bash
git add .
git commit -m "Create homepage"
git push -u origin feature/home
```

Create a Pull Request on GitHub to merge your changes into the main branch.

Do not push directly to main.

## Design System

Primary color: #725E8B

Secondary color: #F3EBF6

Heading font: Inter

Body font: Roboto