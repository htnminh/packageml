# PackageML Frontend

This is the frontend for PackageML, a no-code machine learning platform for everyone.

## Getting Started

These instructions will help you set up and run the frontend on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

### Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd packageml/frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Development Server

To start the development server:

```bash
npm start
```

This will run the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### Building for Production

To build the app for production:

```bash
npm run build
```

This will create a `build` folder with the production-ready optimized build.

## Project Structure

- `/src` - Source code for the application
  - `/components` - Reusable UI components
  - `/pages` - Page components
  - `/styles` - CSS and theme files
  - `App.js` - Main application component
  - `index.js` - Entry point

## Features Implemented

- Landing page with feature highlights
- Dashboard with sidebar navigation
- Placeholder pages for Jobs, Datasets, Models, and API Keys
- Modern, responsive UI with Material UI components

