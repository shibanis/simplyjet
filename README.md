This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

# Simply Jet Web Application

## Overview

The Simply Jet Web Application is a Next.js application with React components and Tailwind CSS for styling. This project includes functionalities for a landing page with animated effects, a user management interface, and a loading page animation.

## Project Structure

- `next/`
  - `app/users/route.ts` - Route configuration for the Users page.
  - `components/`
    - `Home.tsx` - Main component for the landing page.
    - `LoadingPage.tsx` - Component for the loading animation.
    - `UsersTab.tsx` - Component for managing users.
  - `globals.css` - Global styles including custom CSS.
  - `data/users.json` - Static data file for user information.
  - `node_modules/` - Node.js modules.
  - `pages/`
    - `_app.tsx` - Custom App component for Next.js.
    - `index.tsx` - Landing page.
    - `users.tsx` - Users page.
  - `public/assets/logo.svg` - Logo for the application.
  - `configs/` - Configuration files (e.g., Tailwind CSS and PostCSS).
  - `tailwind/` - Tailwind CSS configuration.
  - `postcss/` - PostCSS configuration.

## Components

### `LoadingPage.tsx`

A component that displays a loading animation. The animation consists of a box expanding from the center of the screen and a text message that fades in.


### `Home.tsx`

The main landing page component. Features include:

- Animated background image.
- Transparent header with a logo and menu button.
- Full-page menu with navigation links.
- Welcome section with parallax scrolling effect.
- Scrollable sections with smooth transitions.
- Footer with navigation back to the top.

### `UsersTab.tsx`

A component for user management. Features include:

- Form for adding and editing users.
- Table displaying user data with pagination.
- Search and filter functionality.
- Actions for editing and deleting users.
- Bulk deletion of selected users.

## Setup and Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>

2. **Navigate to project directory**

    cd <project-directory>

3. **Install dependencies:**

    npm install

4. **Run development Server:**

    npm run dev


## Configuration

Tailwind CSS
The project uses Tailwind CSS for styling. Configuration files can be found in the tailwind/ directory.

PostCSS
PostCSS configuration is located in the postcss/ directory.

API Endpoints
GET /api/users: Fetch users with pagination and filtering.
POST /api/users: Add a new user.
PUT /api/users: Update an existing user.
DELETE /api/users: Delete one or more users.