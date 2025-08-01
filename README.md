# 📋 TaskBoard - Project Management System

<div align="center">

![TaskBoard Logo](https://img.shields.io/badge/TaskBoard-Project%20Management-blue?style=for-the-badge&logo=trello)

A modern, full-stack project management system built with cutting-edge technologies, featuring real-time notifications and an intuitive user experience.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat-square&logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4+-black?style=flat-square&logo=socket.io)](https://socket.io/)

</div>

## ✨ Key Features

### 🚀 **Real-time Updates**
- **Instant Notifications** - Live updates via Socket.IO for task changes, assignments, and deadlines
- **Live Status Updates** - See project changes in real-time across all connected users
- **Multi-user Support** - Multiple users can work simultaneously without conflicts

### 👥 **Advanced Workspace Management**
- **Multi-tenant Workspaces** - Organize teams and projects in separate spaces
- **Role-based Access Control** - Granular permissions for workspace members
- **User Invitations** - Easy onboarding with email invitations and workspace codes

### ✅ **Comprehensive Task Management**
- **Smart Task Organization** - Create, assign, and prioritize tasks with custom statuses
- **Progress Tracking** - Visual indicators for task completion and project milestones
- **Task Dependencies** - Link related tasks and manage project workflows
- **File Attachments** - Upload and share files directly within tasks

### 📊 **Analytics & Insights**
- **Interactive Dashboard** - Visual overview with charts and statistics
- **Progress Reports** - Track project completion rates and productivity
- **Activity Timeline** - Complete audit trail of all project activities

### 🔐 **Enterprise-grade Security**
- **JWT Authentication** - Secure token-based authentication system
- **Google OAuth Integration** - Single sign-on with Google accounts
- **Data Encryption** - Secure data transmission and storage
- **Session Management** - Automatic session handling and timeout

### 📧 **Smart Notifications**
- **Multi-channel Alerts** - In-app, email, and push notifications
- **Intelligent Filtering** - Customizable notification preferences
- **Deadline Reminders** - Automated alerts for approaching deadlines

### 🎨 **Modern User Experience**
- **Responsive Design** - Perfect on desktop, tablet, and mobile devices
- **Dark/Light Mode** - Toggle between themes for optimal viewing
- **Intuitive Interface** - Clean, modern UI built with Tailwind CSS
- **Accessibility** - WCAG compliant design for inclusive user experience

## 🛠️ Technology Stack

<div align="center">

### Backend Architecture
| Technology | Purpose | Version |
|------------|---------|---------|
| ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white) | Runtime Environment | 18+ |
| ![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white) | Web Framework | 4.18+ |
| ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white) | Database | Atlas |
| ![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=flat-square&logo=mongoose&logoColor=white) | ODM | 7+ |
| ![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=flat-square&logo=socket.io&logoColor=white) | Real-time Communication | 4+ |
| ![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=json-web-tokens&logoColor=white) | Authentication | - |
| ![SendGrid](https://img.shields.io/badge/SendGrid-1A82E2?style=flat-square&logo=sendgrid&logoColor=white) | Email Service | - |

### Frontend Architecture
| Technology | Purpose | Version |
|------------|---------|---------|
| ![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black) | UI Framework | 18+ |
| ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) | Type Safety | 5+ |
| ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white) | Build Tool | 4+ |
| ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) | Styling Framework | 3+ |
| ![React Query](https://img.shields.io/badge/React_Query-FF4154?style=flat-square&logo=react-query&logoColor=white) | State Management | 4+ |
| ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=flat-square&logo=react-router&logoColor=white) | Navigation | 6+ |

</div>

### 🏗️ Architecture Highlights
- **Microservices Ready** - Modular backend structure for easy scaling
- **Type-Safe Development** - Full TypeScript implementation
- **Real-time Architecture** - WebSocket connections for instant updates
- **RESTful API Design** - Clean, documented API endpoints
- **Responsive Frontend** - Mobile-first, progressive web app capabilities

## 🚀 Quick Start Guide

### 📋 Prerequisites
Before you begin, ensure you have the following installed:
- **Node.js** (v18.0.0 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager

### 🔧 Installation & Setup

#### 1️⃣ Clone the Repository
```bash
git clone https://github.com/snehakumawat72/TaskBoard.git
cd TaskBoard
```

#### 2️⃣ Backend Configuration
```bash
cd backend
npm install
```

**Environment Setup:**
Create a `.env` file in the backend directory with your database and service configurations.

#### 3️⃣ Frontend Configuration
```bash
cd ../frontend
npm install
```

#### 4️⃣ Launch the Application

**Option A: Start all servers at once (Windows)**
```bash
# From project root directory
start-all-servers.bat
```

**Option B: Start servers separately**

Backend (Terminal 1):
```bash
cd backend
npm run dev
```

Frontend (Terminal 2):
```bash
cd frontend
npm run dev
```

#### 5️⃣ Access Your Application
- **Frontend**: http://localhost:5175
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api-docs (coming soon)

### 🎯 First Steps After Setup
1. **Create an account** or sign in with Google
2. **Create your first workspace** 
3. **Start your first project** and add tasks
4. **Experience real-time notifications** by testing task updates

### ⚡ Development Scripts

**Backend Scripts:**
```bash
npm run dev          # Start development server with nodemon
npm start           # Start production server
npm run test        # Run test suite
```

**Frontend Scripts:**
```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Run ESLint
```

## 📁 Project Architecture

```
TaskBoard/
├── 🗂️ backend/                     # Node.js/Express API Server
│   ├── 📋 controllers/             # Business logic handlers
│   │   ├── auth-controller.js      # Authentication logic
│   │   ├── project.js              # Project management
│   │   ├── task.js                 # Task operations
│   │   ├── workspace.js            # Workspace management
│   │   ├── notification.js         # Notification handling
│   │   └── user.js                 # User profile management
│   ├── 🏗️ models/                  # MongoDB/Mongoose schemas
│   │   ├── user.js                 # User data model
│   │   ├── workspace.js            # Workspace schema
│   │   ├── project.js              # Project structure
│   │   ├── task.js                 # Task definitions
│   │   ├── notification.js         # Notification model
│   │   └── comment.js              # Comment system
│   ├── 🛣️ routes/                   # API endpoint definitions
│   │   ├── auth.js                 # Authentication routes
│   │   ├── workspace.js            # Workspace endpoints
│   │   ├── project.js              # Project API routes
│   │   ├── task.js                 # Task management routes
│   │   └── notification.js         # Notification endpoints
│   ├── 🔧 middleware/              # Express middleware
│   │   ├── auth-middleware.js      # JWT verification
│   │   └── upload-middleware.js    # File upload handling
│   ├── 📚 libs/                    # Utility libraries & services
│   │   ├── notification.service.js # Notification service
│   │   ├── send-email.js           # Email utilities
│   │   ├── deadline-scheduler.js   # Task deadline management
│   │   └── validate-schema.js      # Data validation
│   ├── 🔌 socket/                  # Real-time communication
│   │   └── socket-server.js        # Socket.IO configuration
│   ├── 📁 uploads/                 # File storage
│   │   └── avatars/                # User profile images
│   └── 🚀 index.js                 # Server entry point
│
├── 🎨 frontend/                    # React/TypeScript Client
│   ├── 📱 app/                     # Main application code
│   │   ├── 🧩 components/          # Reusable UI components
│   │   │   ├── ui/                 # Base UI components (buttons, inputs)
│   │   │   ├── layout/             # Layout components (header, sidebar)
│   │   │   ├── dashboard/          # Dashboard-specific components
│   │   │   ├── project/            # Project management UI
│   │   │   ├── task/               # Task interface components
│   │   │   ├── workspace/          # Workspace management UI
│   │   │   └── notification/       # Notification components
│   │   ├── 📄 routes/              # Page-level components
│   │   │   ├── auth/               # Authentication pages
│   │   │   ├── dashboard/          # Dashboard views
│   │   │   ├── workspace/          # Workspace pages
│   │   │   └── user/               # User profile pages
│   │   ├── 🎯 hooks/               # Custom React hooks
│   │   │   ├── use-auth.ts         # Authentication hook
│   │   │   ├── use-notifications.ts # Notification management
│   │   │   ├── use-workspace.ts    # Workspace operations
│   │   │   └── use-project.ts      # Project management hook
│   │   ├── 🔄 context/             # React Context providers
│   │   │   └── NotificationProvider.tsx # Global notification state
│   │   ├── 🛠️ lib/                  # Utility functions
│   │   │   ├── fetch-util.ts       # API communication
│   │   │   ├── socket.ts           # Socket.IO client setup
│   │   │   └── utils.ts            # Helper functions
│   │   └── 📊 types/               # TypeScript type definitions
│   ├── 🌐 public/                  # Static assets
│   └── ⚙️ Configuration files       # Vite, TypeScript, Tailwind configs
│
├── 📋 Batch Scripts/               # Development utilities
│   ├── start-all-servers.bat      # Launch frontend + backend
│   ├── start-backend.bat          # Backend only
│   └── start-servers.bat          # Alternative startup script
│
└── 📚 Documentation/               # Project documentation
    ├── README.md                   # This file
    ├── .gitignore                  # Git ignore rules
    └── LICENSE                     # MIT License
```

### 🏛️ Architecture Patterns

**Backend Architecture:**
- **MVC Pattern** - Separation of concerns with Models, Views, and Controllers
- **Middleware Chain** - Request processing pipeline with authentication and validation
- **Service Layer** - Business logic abstraction in libs/ directory
- **Socket Integration** - Real-time event handling alongside REST API

**Frontend Architecture:**
- **Component-based** - Modular, reusable React components
- **Hook Pattern** - Custom hooks for state management and side effects
- **Context API** - Global state management for authentication and notifications
- **Route-based Code Splitting** - Optimized loading with lazy imports

## 🌐 API Documentation

### 🔐 Authentication Endpoints
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `POST` | `/api-v1/auth/register` | User registration with email/password | ❌ Public |
| `POST` | `/api-v1/auth/login` | User login authentication | ❌ Public |
| `POST` | `/api-v1/auth/google` | Google OAuth authentication | ❌ Public |
| `POST` | `/api-v1/auth/refresh` | Refresh JWT token | 🔒 Token Required |
| `POST` | `/api-v1/auth/logout` | User logout and token invalidation | 🔒 Token Required |

### 🏢 Workspace Management
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/api-v1/workspaces` | Get user's workspaces | 🔒 Token Required |
| `POST` | `/api-v1/workspaces` | Create new workspace | 🔒 Token Required |
| `GET` | `/api-v1/workspaces/:id` | Get workspace details | 🔒 Member Access |
| `PUT` | `/api-v1/workspaces/:id` | Update workspace settings | 🔒 Admin Access |
| `DELETE` | `/api-v1/workspaces/:id` | Delete workspace | 🔒 Owner Access |

### 👥 Workspace Invitations
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `POST` | `/api-v1/workspace-invite/:workspaceId` | Send workspace invitation | 🔒 Admin Access |
| `GET` | `/api-v1/workspace-invite/:token` | Get invitation details | ❌ Public |
| `POST` | `/api-v1/workspace-invite/:token/accept` | Accept workspace invitation | 🔒 Token Required |
| `DELETE` | `/api-v1/workspace-invite/:id` | Revoke invitation | 🔒 Admin Access |

### 📂 Project Management
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/api-v1/projects/:workspaceId` | Get workspace projects | 🔒 Member Access |
| `POST` | `/api-v1/projects/:workspaceId` | Create new project | 🔒 Member Access |
| `GET` | `/api-v1/projects/:id` | Get project details | 🔒 Member Access |
| `PUT` | `/api-v1/projects/:id` | Update project | 🔒 Member Access |
| `DELETE` | `/api-v1/projects/:id` | Delete project | 🔒 Admin Access |

### ✅ Task Management
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/api-v1/tasks/:projectId` | Get project tasks | 🔒 Member Access |
| `POST` | `/api-v1/tasks/:projectId` | Create new task | 🔒 Member Access |
| `GET` | `/api-v1/tasks/:id` | Get task details | 🔒 Member Access |
| `PUT` | `/api-v1/tasks/:id` | Update task | 🔒 Assignee/Admin |
| `PUT` | `/api-v1/tasks/:id/status` | Update task status | 🔒 Assignee/Admin |
| `DELETE` | `/api-v1/tasks/:id` | Delete task | 🔒 Creator/Admin |

### 🔔 Notification System
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/api-v1/notifications` | Get user notifications | 🔒 Token Required |
| `PUT` | `/api-v1/notifications/:id/read` | Mark notification as read | 🔒 Token Required |
| `PUT` | `/api-v1/notifications/read-all` | Mark all notifications as read | 🔒 Token Required |
| `DELETE` | `/api-v1/notifications/:id` | Delete notification | 🔒 Token Required |

### 👤 User Management
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/api-v1/users/profile` | Get user profile | 🔒 Token Required |
| `PUT` | `/api-v1/users/profile` | Update user profile | 🔒 Token Required |
| `POST` | `/api-v1/users/avatar` | Upload profile picture | 🔒 Token Required |
| `PUT` | `/api-v1/users/password` | Change password | 🔒 Token Required |

### 📊 Real-time Events (Socket.IO)
| Event | Direction | Description | Data |
|-------|-----------|-------------|------|
| `notification` | Server → Client | New notification received | `{type, message, data}` |
| `task_updated` | Server → Client | Task status/details changed | `{taskId, changes}` |
| `project_updated` | Server → Client | Project information updated | `{projectId, changes}` |
| `user_joined` | Server → Client | User joined workspace | `{userId, workspaceId}` |
| `user_left` | Server → Client | User left workspace | `{userId, workspaceId}` |

### 🔒 Authentication Flow
1. **Registration/Login** → Receive JWT token
2. **Include token** in `Authorization: Bearer <token>` header
3. **Token validation** on protected routes
4. **Automatic refresh** when token expires
5. **Role-based access** control per workspace

### 📝 Request/Response Examples

**Create Task:**
```bash
POST /api-v1/tasks/project123
Authorization: Bearer your-jwt-token
Content-Type: application/json

{
  "title": "Implement user authentication",
  "description": "Add JWT-based auth system",
  "priority": "high",
  "dueDate": "2024-12-31",
  "assignedTo": "user456"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "task789",
    "title": "Implement user authentication",
    "status": "todo",
    "createdAt": "2024-01-15T10:30:00Z",
    "project": "project123"
  }
}
```

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for complete details.

### License Summary
- ✅ **Commercial Use** - Use in commercial projects
- ✅ **Modification** - Modify and create derivative works
- ✅ **Distribution** - Distribute original or modified versions
- ✅ **Private Use** - Use privately without restriction
- ❌ **Liability** - No warranty or liability
- ❌ **Trademark Use** - No rights to use project trademarks

## 👨‍💻 Author & Contact

<div align="center">

### Sneha Kumawat
**Full-Stack Developer & Project Creator**

[![GitHub](https://img.shields.io/badge/GitHub-snehakumawat72-black?style=flat-square&logo=github)](https://github.com/snehakumawat72)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=flat-square&logo=linkedin)](https://linkedin.com/in/snehakumawat72)
[![Email](https://img.shields.io/badge/Email-Contact-red?style=flat-square&logo=gmail)](mailto:snehakumawat72@gmail.com)

**Project Repository:** [https://github.com/snehakumawat72/TaskBoard](https://github.com/snehakumawat72/TaskBoard)

---

### 🌟 Show Your Support

If you find TaskBoard helpful, please consider:
- ⭐ **Starring this repository**
- 🍴 **Forking for your own projects**
- 🐛 **Reporting bugs and issues**
- 💡 **Suggesting new features**
- 📢 **Sharing with your network**

**Built with ❤️ by developers, for developers**

</div>
