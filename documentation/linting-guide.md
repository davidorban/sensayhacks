# SensayHacks Linting Guide

## Overview

This guide provides best practices for avoiding common linting errors in the SensayHacks project. Following these guidelines will help ensure that code passes linting checks before being pushed to production.

## Common ESLint Errors and How to Fix Them

### 1. Unused Variables (`@typescript-eslint/no-unused-vars`)

This is the most common linting error in our codebase. It occurs when you declare a variable but never use it.

#### Examples:

```tsx
// ERROR: 'apiKey' is assigned a value but never used
const [apiKey, setApiKey] = useState<string>('');

// ERROR: 'parsedInputData' is assigned a value but never used
let parsedInputData = JSON.parse(inputData);

// ERROR: 'setError' is assigned a value but never used
const [isLoading, setError] = useState<boolean>(false);
```

#### Solutions:

1. **Remove the unused variable** if it's not needed:
   ```tsx
   // Before
   const [apiKey, setApiKey] = useState<string>('');
   
   // After
   // Remove completely if not needed
   ```

2. **Use an underscore prefix** for variables you intentionally don't use:
   ```tsx
   // Before
   const [apiKey, setApiKey] = useState<string>('');
   
   // After
   const [_apiKey, setApiKey] = useState<string>('');
   ```

3. **Use empty destructuring** for unused state setters:
   ```tsx
   // Before
   const [apiKey, ] = useState<string>('');
   
   // After (note the space is removed)
   const [, ] = useState<string>('');
   ```

4. **Add a comment** explaining why you're keeping an unused variable:
   ```tsx
   // Keeping apiKey state for future implementation
   const [, ] = useState<string>('');
   ```

### 2. Missing Dependencies in useEffect (`react-hooks/exhaustive-deps`)

This occurs when a `useEffect` hook uses variables that aren't listed in its dependency array.

#### Example:

```tsx
// ERROR: 'someValue' is not included in the dependency array
useEffect(() => {
  console.log(someValue);
}, []); // Missing dependency: 'someValue'
```

#### Solution:

Add the missing variable to the dependency array:

```tsx
useEffect(() => {
  console.log(someValue);
}, [someValue]); // Fixed
```

### 3. Missing Key Prop in Lists (`react/jsx-key`)

This error occurs when rendering lists without providing a unique `key` prop to each element.

#### Example:

```tsx
// ERROR: Missing 'key' prop for element in iterator
{items.map((item) => (
  <div>{item.name}</div>
))}
```

#### Solution:

Add a unique key to each element:

```tsx
{items.map((item) => (
  <div key={item.id}>{item.name}</div>
))}
```

### 4. Import Errors

#### a. Unused imports (`unused-imports/no-unused-imports`)

```tsx
// ERROR: 'Button' is imported but never used
import { Button } from "@/components/ui/button";
```

**Solution**: Remove the unused import.

#### b. Missing imports

```tsx
// ERROR: 'useState' is not defined
const [value, setValue] = useState('');
```

**Solution**: Add the missing import:

```tsx
import { useState } from 'react';
```

### 5. React Client Components (`next/no-client-import`)

In Next.js, components that use client-side features need the "use client" directive.

#### Example:

```tsx
// ERROR: useState is used without "use client" directive
import { useState } from 'react';

const Component = () => {
  const [state, setState] = useState('');
  // ...
}
```

#### Solution:

Add the "use client" directive at the top of the file:

```tsx
"use client";

import { useState } from 'react';

const Component = () => {
  const [state, setState] = useState('');
  // ...
}
```

## Pre-Commit Checklist

Before committing code, run through this quick checklist:

1. **Check for unused variables**:
   - Look for any state variables that aren't used
   - Check for parsed data that isn't used
   - Ensure all destructured variables are used

2. **Review React hooks**:
   - Ensure all dependencies are properly listed in useEffect
   - Check that useState is properly used

3. **Verify imports and exports**:
   - Remove any unused imports
   - Make sure all necessary components are imported

4. **Client Components**:
   - Add "use client" directive to any component using client-side features (useState, useEffect, etc.)

5. **Run lint check locally** (if possible):
   ```bash
   npm run lint
   ```

## Automatic Fixes

Many linting errors can be automatically fixed using:

```bash
npm run lint -- --fix
```

## Project-Specific Rules

- Always use TypeScript for type safety
- Prefer functional components over class components
- Use shadcn UI components for consistent styling
- Follow the existing project structure for new pages and components

By following this guide, you'll help ensure that code passes linting checks before being pushed to production, saving time and preventing deployment failures.
