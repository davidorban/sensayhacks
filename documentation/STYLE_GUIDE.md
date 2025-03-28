# Sensay Prototypes Style Guide

This document outlines the basic color scheme and layout principles used across the Sensay Hackathon prototype pages to ensure visual consistency.

## Color Palette & Theme

We are using a consistent **dark theme** inspired by modern IDEs and development tools.

-   **Overall Background:** Dark gray/near-black (`bg-gray-900`). This provides the main canvas for the application.
-   **Header/Outer Containers:** Dark gray/near-black (`bg-gray-900`) for the main page container, often holding the page title.
-   **Header Text:** Light gray/white (`text-gray-100` or `text-white`) for high contrast against the dark background.
-   **Main Content Area Background:** White (`bg-white`). This area contains the primary interactive elements or information of the prototype.
-   **Content Area Text:** Dark gray/black (`text-gray-800`, `text-gray-700`, `text-gray-600`) for readability on the white background.
-   **Accent/Buttons:** Indigo (`bg-indigo-600`, `hover:bg-indigo-700`, `text-white`) is used for primary action buttons to draw attention.
-   **Sidebar Background:** Dark gray (`bg-gray-800`).
-   **Sidebar Text:** White/Light Gray (`text-white`, `text-gray-300`, `hover:text-gray-100`).
-   **Input Fields:** Ensure text within input fields (`<input>`, `<textarea>`) is black (`text-black`) for optimal visibility against the default white background of these elements.

## Layout Principles

-   **Full Height:** Pages generally attempt to fill the viewport height.
-   **Sidebar (Conditional):** A fixed-width sidebar (`w-64`) is present on the left for authenticated users with `@sensay.io` emails, providing navigation.
-   **Main Content:** Occupies the remaining space to the right of the sidebar (if present) or the full width.
-   **Padding:** Consistent padding (`p-6` or `p-8`) is used within containers to provide spacing.
-   **Rounded Corners:** The main white content area uses rounded corners (`rounded-lg`) for a softer look.
-   **Shadows:** Subtle shadows (`shadow-lg`) are applied to the main content area to lift it off the dark background.

## Implementation Notes

-   These styles are primarily implemented using **Tailwind CSS** utility classes.
-   The structure is generally a dark outer `div` (`bg-gray-900`) containing:
    -   An optional header section.
    -   A main content `div` (`bg-white rounded-lg shadow-lg`).
