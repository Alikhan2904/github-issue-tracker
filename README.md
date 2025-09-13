# GitHub Issue Tracker Clone

A full-stack GitHub Issue Tracker clone built with modern web technologies, featuring Firebase Authentication, role-based access control, and optimized performance patterns.

## 🚀 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Query** - Data fetching and caching
- **Firebase** - Authentication

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM

### DevOps & Tools
- **Turborepo** - Monorepo management
- **ESLint** - Linting
- **Prettier** - Code formatting
- **Jest** - Testing
- **GitHub Actions** - CI/CD

## 🎗️ Project Structure

```
github-issue-tracker/
├── apps/
│   ├── frontend/               # Next.js frontend
│   └── backend/                # Express backend
├── packages/
│   ├── ui/                     # Shared UI components
│   ├── eslint-config/          # ESLint configurations
│   └── typescript-config/      # TypeScript configurations
├── .github/
│   └── workflows/              # GitHub Actions
```

## 🔥 Features

### Authentication & Authorization
- Firebase Authentication (Email/Password + Google Sign-in)
- Role-based access control (Owner, Collaborator, Viewer)
- Protected routes and API endpoints
- JWT token verification

### Repository Management
- Create and manage repositories
- Invite collaborators with role assignment
- Repository dashboard with access control

### Issue Management
- GitHub-like issue interface
- Create, read, update, delete issues
- Issue status management (Open, In Progress, Closed)
- Labels and assignee system
- Advanced filtering and search

### Performance & UX
- Server-Side Rendering (SSR)
- Optimistic UI updates
- React Query caching
- Pagination with infinite scroll
- Error boundaries and loading states
- Responsive design

## 🛠️ Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Firebase project
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd github-issue-tracker
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Fill in your environment variables
```

4. **Set up Firebase**
- Create a Firebase project
- Enable Authentication (Email/Password and Google)
- Generate service account key for backend
- Update `.env` with Firebase configuration

5. **Set up MongoDB**
- Install MongoDB locally or use MongoDB Atlas
- Update `MONGO_URI` in `.env`

6. **Start development servers**
```bash
# Start both frontend and backend
turbo run dev

# Or start individually
cd apps/frontend && npm run dev    # Frontend: http://localhost:3000
cd apps/backend && npm run dev # Backend: http://localhost:5000
```

### Environment Variables
Make sure to set all required environment variables in your deployment platforms. Refer to `.env.example` for the complete list.