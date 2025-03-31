# SensayHacks Slide Decks

This directory contains [Slidev](https://sli.dev) presentations for SensayHacks concepts.

## Structure
- Each concept has its own subdirectory
- Slides are written in Markdown
- Assets (images, etc.) are stored in the concept's subdirectory

## Running Presentations
1. Navigate to the concept's directory
2. Run `npm run slidev`
3. Open browser at http://localhost:3030

## Building for Production
```bash
npm run build-slides
```

Generated static sites will be in the `dist` directory of each presentation.
