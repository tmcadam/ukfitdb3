# UKFITDB3 Research Publication Finder

A React-based web application for searching and browsing the Falkland Islands Trust (FIT) research publications database. This is the third iteration of the FIT Publications Database, rebuilt from the ground up using modern web technologies.

## Technical Overview

UKFITDB3 is a client-side single-page application (SPA) built with **React 18**, **TypeScript**, and **Vite** as the build tool. The UI is styled using **Tailwind CSS v4** with PostCSS for processing. The application loads publication data from a static CSV file (`src/publications.csv`) using **PapaParse** for parsing, and performs client-side full-text search across title, keywords, authors, and year fields.

### Architecture

The app follows a component-based architecture with custom React hooks for state management and business logic:

- **[`App.tsx`](src/App.tsx)** - Root component managing navigation state between HOME and RESULTS views
- **[`usePublications.ts`](src/usePublications.ts)** - Custom hook that loads and parses the CSV data, handles year normalization
- **[`useSearch.ts`](src/useSearch.ts)** - Custom hook implementing search logic with support for quoted phrases and word-boundary matching
- **[`types.ts`](src/types.ts)** - TypeScript type definitions for `Publication` and `Display` enum
- **[`components/Introduction.tsx`](src/components/Introduction.tsx)** - Landing page with project background and partner logos
- **[`components/Search.tsx`](src/components/Search.tsx)** - Search input component with hero variant for the home page
- **[`components/Results.tsx`](src/components/Results.tsx)** - Displays search results sorted alphabetically by title

The application uses a simple state-based routing pattern via the `Display` enum (`HOME` / `RESULTS`) rather than a dedicated router library, keeping dependencies minimal.

### Testing

Unit tests are written using **Vitest** with **jsdom** environment and **@testing-library/react** for component testing. Test files follow the convention of co-located `*.test.ts`/`*.test.tsx` files alongside their source modules.

### Build & Deployment

Vite handles bundling with React support via `@vitejs/plugin-react`. The production build outputs static assets suitable for deployment to any static hosting service. GitHub Actions CI runs lint checks on every push and pull request.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Setup the Local Environment

1. Navigate to the project directory:

   ```bash
   cd ukfitdb3
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

## Run Tests

Run all tests once:

```bash
npm run test:run
```

Run tests in watch mode (re-runs on file changes):

```bash
npm run test
```

## Lint Code

Run ESLint with React rules to check for code quality issues:

```bash
npm run lint
```

The CI pipeline automatically runs lint checks on every push and pull request.

## Run Local Dev Server

Start the development server with hot module replacement:

```bash
npm start
```

The app will be available at `http://localhost:5173`.

## Build for Production

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## About the Database

The FIT Publications Database was created in the 1990s in response to a need identified by the Falkland Islands Government to coordinate and efficiently use scientific resources across the Falkland Islands. The database documents all previously and currently published scientific information, making it accessible to scientists, students, and researchers.

Compiled by the [Falkland Islands Trust](https://www.ukfit.org) with support from Fortuna Ltd and The Falkland Islands Government, the database contains many previously inaccessible entries. It is a valuable resource for the scientific, commercial, and educational sectors in the Falkland Islands. For suggestions or queries, contact Professor Jim McAdam at jim.mcadam@ukfit.org.
