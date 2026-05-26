import '@testing-library/jest-dom';

// Mock all image imports for tests
const svgPlaceholder =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzZjNWM2YyIvPjwvc3ZnPg==';

vi.mock('../fit-logo.png', () => ({ default: svgPlaceholder }));
vi.mock('../fk-logo.png', () => ({ default: svgPlaceholder }));
vi.mock('../fortuna-logo.png', () => ({ default: svgPlaceholder }));
