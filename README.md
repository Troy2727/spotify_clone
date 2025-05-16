<h1 align="center">🎵 Realtime Spotify Application ✨</h1>

<p align="center">
  <img src="/frontend/public/screenshot-for-readme.png" alt="Demo App" width="100%">
</p>

<p align="center">
  <b>A modern, feature-rich music streaming platform with real-time capabilities</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.x-blue?logo=react" alt="React">
  <img src="https://img.shields.io/badge/Node.js-18.x-green?logo=node.js" alt="Node.js">
  <img src="https://img.shields.io/badge/MongoDB-Latest-green?logo=mongodb" alt="MongoDB">
  <img src="https://img.shields.io/badge/Socket.IO-4.x-black?logo=socket.io" alt="Socket.IO">
  <img src="https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript" alt="TypeScript">
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#prerequisites">Prerequisites</a> •
  <a href="#installation">Installation</a> •
  <a href="#environment-variables">Environment Variables</a> •
  <a href="#running-the-application">Running</a> •
  <a href="#deployment">Deployment</a> •
  <a href="#ci-cd-workflows">CI/CD Workflows</a>
</p>

Welcome to the Realtime Spotify Clone, a full-stack music streaming app built with React, Node.js, MongoDB, and Socket.IO. This project combines the power of real-time communication and a sleek music streaming interface to deliver an interactive and enjoyable user experience.

With this app, you can listen to music, interact with users, chat in real-time, and manage your albums and songs. Let’s dive into the features, tech stack, and how you can get started!

## 📋 Table of Contents

- [🎉 Features](#features)
- [💻 Tech Stack](#tech-stack)
- [🛠 Prerequisites](#prerequisites)
- [📥 Installation](#installation)
- [🔑 Environment Variables](#environment-variables)
- [🚀 Running the Application](#running-the-application)
- [🌍 Deployment](#deployment)
- [📂 Project Structure](#project-structure)
- [🔄 CI/CD Workflows](#ci-cd-workflows)
- [📄 License](#license)


## 🎉 Features

### 🎵 Music Streaming
- Stream your favorite tracks, play, pause, skip to the next song, or go back to the previous one.

### 🔊 Volume Control
- Adjust the volume effortlessly with a slider for the perfect listening experience.

### 🎧 Admin Dashboard
- Admins have full control to create, update, and manage albums and songs.

### 💬 Real-time Chat
- Chat with other users live while enjoying your music, keeping the experience social and fun.

### 👥 User Status
- Check whether other users are online or offline in real-time.

### 👀 Activity Feed
- Stay updated with what other users are listening to in real-time.

### 📊 Analytics
- Admins can view aggregated data like user activity and app usage to make informed decisions.

### 🔐 Authentication
- Secure login and authentication via Clerk, ensuring your account is protected.

### 💻 Responsive Design
- Enjoy a seamless experience across all devices – desktop, tablet, and mobile!

## 💻 Tech Stack

### 🖥️ Frontend
- **React** - Modern UI library to build dynamic user interfaces
- **TypeScript** - Adds type safety for better development experience
- **Vite** - A fast and optimized build tool for React projects
- **Tailwind CSS** - Utility-first CSS framework for fast and responsive styling
- **shadcn/ui** - Ready-to-use UI components for clean design
- **Zustand** - State management for handling global app state
- **Socket.IO Client** - For real-time communication features like chat and activity feed
- **React Router** - Efficient routing for a smooth navigation experience
- **Clerk** - For secure and easy authentication

### ⚙️ Backend
- **Node.js** - JavaScript runtime for building scalable server-side applications
- **Express** - Web framework for creating RESTful APIs
- **MongoDB** - NoSQL database for storing user and media data
- **Mongoose** - Object Data Modeling (ODM) library for MongoDB
- **Socket.IO** - Real-time communication engine for features like live chat and user status
- **Cloudinary** - Media storage and image management for handling album artwork and other media files
- **Clerk** - Authentication API for secure user management

## 🛠 Prerequisites
Before getting started, ensure you have the following installed:

- **Node.js** (v18.17.0 or higher)
- **npm** or **yarn**
- **MongoDB** (local or MongoDB Atlas)
- **Cloudinary account** (for media storage)
- **Clerk account** (for authentication)

## 📥 Installation

### 1. Clone the repository:
```bash
git clone https://github.com/Troy2727/spotify_clone.git
cd spotify_clone
```

### 2. Install dependencies:
```bash
# Root dependencies
npm install

# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

## 🔑 Environment Variables

### Backend (.env)
Create a `.env` file in the backend directory and add the following variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
ADMIN_EMAIL=your_admin_email
NODE_ENV=development

CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name

CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

### Frontend (.env)
Create a `.env` file in the frontend directory and add this variable:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

## 🚀 Running the Application

To run the application locally:

### 1. Start the backend server:
```bash
cd backend
npm run dev
```

### 2. Start the frontend server:
```bash
cd frontend
npm run dev
```

Visit the app in your browser at:
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:5000](http://localhost:5000)


## 🌍 Deployment

### Deploying to Vercel

This project is configured for easy deployment to Vercel. Follow these steps:

1. **Create a Vercel account** if you don't have one at [vercel.com](https://vercel.com)

2. **Install the Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

3. **Login to Vercel**:
   ```bash
   vercel login
   ```

4. **Deploy the application**:
   ```bash
   # From the project root
   vercel
   ```

5. **Set up environment variables** in the Vercel dashboard:
   - Go to your project settings
   - Navigate to the "Environment Variables" tab
   - Add all the variables from `.env.example`

6. **Configure your custom domain** (optional):
   - Go to your project settings
   - Navigate to the "Domains" tab
   - Add your custom domain and follow the verification steps

### Manual Deployment

You can also deploy the frontend and backend separately:
- **Frontend**: [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
- **Backend**: [Heroku](https://heroku.com) or [DigitalOcean](https://digitalocean.com)

Ensure all your environment variables are set in the production environment for things like MongoDB, Cloudinary, and Clerk authentication.

## 📂 Project Structure

```
spotify_clone/
├── api/                    # Vercel API configuration
│   └── index.js            # API entry point for Vercel
│
├── backend/                # Node.js backend
│   ├── controllers/        # Request handlers
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── lib/                # Socket.IO setup and utilities
│   ├── middleware/         # Custom middleware
│   └── src/index.js        # Entry point
│
├── frontend/               # React frontend
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   ├── pages/          # Page components
│   │   ├── stores/         # Zustand state management
│   │   └── App.tsx         # Main component
│   └── vite.config.ts      # Vite configuration
│
├── .github/                # GitHub configuration
│   └── workflows/          # GitHub Actions workflows
│       ├── git-workflow.yml       # Code quality checks
│       ├── codeql-analysis.yml    # Security scanning
│       └── node-ci-cd.yml         # Build, test, deploy
│
├── .env.example            # Example environment variables
├── vercel.json             # Vercel deployment configuration
├── .vercelignore           # Files to ignore in Vercel deployment
└── README.md               # Project documentation
```

## 🔄 CI/CD Workflows

This project uses GitHub Actions for continuous integration and deployment, ensuring code quality, security, and automated deployments.

### 🧪 Git Workflow

The Git workflow ensures code quality and consistency:

- **Linting**: Automatically checks code style and quality
- **Conventional Commits**: Validates that commit messages follow the [Conventional Commits](https://www.conventionalcommits.org/) format
- **Branch Naming**: Ensures branches follow the naming convention:
  - `feature/feature-name`: For new features
  - `bugfix/bug-name`: For bug fixes
  - `hotfix/issue-name`: For critical fixes
  - `release/version`: For release branches
  - `chore/task-name`: For maintenance tasks

### 🔒 CodeQL Analysis

Security scanning with GitHub's CodeQL:

- Runs on push to main branch, pull requests to main, and weekly
- Scans JavaScript/TypeScript code for security vulnerabilities
- Generates security reports for review
- Helps identify potential security issues early in development

### 🚀 Node.js CI/CD

Handles building, testing, and deployment:

- **Build and Test**: Builds the application and runs tests on multiple Node.js versions (18.x, 20.x)
- **Security Scan**: Checks for vulnerabilities with npm audit
- **Staging Deployment**: Automatically deploys to staging environment when code is pushed to develop
- **Production Deployment**: Deploys to production when code is pushed to main (with approval)

### 📊 Workflow Status

You can check the status of all workflows in the [Actions tab](https://github.com/Troy2727/spotify_clone/actions) of the GitHub repository.

## 👨‍💻 Author

- **Alex Mieses** - [GitHub](https://github.com/Troy2727)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

<p align="center">
  <img src="https://img.shields.io/badge/Made%20with%20%E2%9D%A4%EF%B8%8F%20by-Alex%20Mieses-red" alt="Made with love">
</p>

<p align="center">
  © 2025 Realtime Spotify Clone. All rights reserved.
</p>
