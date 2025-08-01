# TaskBoard - Project Management System

A full-stack project management system built with Node.js, Express, MongoDB, React, and TypeScript featuring real-time notifications and collaborative workspaces.

## Features

- 🚀 **Real-time Notifications** - Instant updates via Socket.IO
- 👥 **Collaborative Workspaces** - Team collaboration and project management
- ✅ **Task Management** - Create, assign, and track tasks with status updates
- 📊 **Project Dashboard** - Visual overview of projects and progress
- 🔐 **Authentication** - JWT-based auth with Google OAuth integration
- 📧 **Email Notifications** - SendGrid integration for email alerts
- 🎨 **Modern UI** - Responsive design with Tailwind CSS
- 🌙 **Dark Mode** - Toggle between light and dark themes

## Tech Stack

### Backend
- **Node.js** & **Express.js** - Server framework
- **MongoDB** with **Mongoose** - Database and ODM
- **Socket.IO** - Real-time communication
- **JWT** - Authentication
- **SendGrid** - Email service
- **Google OAuth** - Social authentication

### Frontend
- **React** with **TypeScript** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Socket.IO Client** - Real-time updates

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB database
- SendGrid account (for emails)
- Google OAuth credentials (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/snehakumawat72/TaskBoard.git
   cd TaskBoard
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   ```
   
   Edit `.env` file with your credentials:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   SENDGRID_API_KEY=your_sendgrid_api_key
   JWT_SECRET=your_jwt_secret
   FRONTEND_URL=http://localhost:5175
   GOOGLE_CLIENT_ID=your_google_client_id
   FROM_EMAIL=your_email@example.com
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Start the Application**
   
   Backend (from backend directory):
   ```bash
   npm run dev
   ```
   
   Frontend (from frontend directory):
   ```bash
   npm run dev
   ```

5. **Access the Application**
   - Frontend: http://localhost:5175
   - Backend API: http://localhost:5000

## Project Structure

```
TaskBoard/
├── backend/
│   ├── controllers/          # Route controllers
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── middleware/          # Custom middleware
│   ├── libs/                # Utility libraries
│   ├── socket/              # Socket.IO configuration
│   └── index.js             # Server entry point
├── frontend/
│   ├── app/
│   │   ├── components/      # Reusable components
│   │   ├── routes/          # Page components
│   │   ├── context/         # React contexts
│   │   ├── hooks/           # Custom hooks
│   │   └── lib/             # Utilities
│   └── public/              # Static assets
└── README.md
```

## API Endpoints

### Authentication
- `POST /api-v1/auth/register` - User registration
- `POST /api-v1/auth/login` - User login
- `POST /api-v1/auth/google` - Google OAuth login

### Workspaces
- `GET /api-v1/workspaces` - Get user workspaces
- `POST /api-v1/workspaces` - Create workspace
- `PUT /api-v1/workspaces/:id` - Update workspace

### Projects
- `GET /api-v1/projects/:workspaceId` - Get workspace projects
- `POST /api-v1/projects/:workspaceId` - Create project
- `PUT /api-v1/projects/:id` - Update project

### Tasks
- `GET /api-v1/tasks/:projectId` - Get project tasks
- `POST /api-v1/tasks/:projectId` - Create task
- `PUT /api-v1/tasks/:id/status` - Update task status

### Notifications
- `GET /api-v1/notifications` - Get user notifications
- `PUT /api-v1/notifications/:id/read` - Mark as read
- `DELETE /api-v1/notifications/:id` - Delete notification

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Sneha Kumawat - [@snehakumawat72](https://github.com/snehakumawat72)

Project Link: [https://github.com/snehakumawat72/TaskBoard](https://github.com/snehakumawat72/TaskBoard)
