# Project Management System - Backend

A robust and scalable backend API for a Role-Based Access Control (RBAC) project management system built with Node.js, Express, TypeScript, and MongoDB.

## 🚀 Features

### Core Functionality
- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (RBAC)
  - Invitation-based user registration
  - Secure password hashing with bcrypt

- **User Management**
  - Admin can invite users via email
  - Role management (ADMIN, MANAGER, STAFF)
  - User status management (ACTIVE, INACTIVE)
  - Profile management with password updates

- **Project Management**
  - CRUD operations for projects
  - Soft delete functionality
  - Project status tracking
  - Search and pagination support

- **Dashboard Analytics**
  - Real-time statistics
  - Total projects count
  - Active projects count
  - Total users count

### Security Features
- Rate limiting to prevent abuse
- Helmet.js for security headers
- CORS configuration
- Environment-based configuration
- Comprehensive audit logging

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (v5.0 or higher)
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   cd project-management-system-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://your-connection-string
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=30d
   FRONTEND_URL=http://localhost:5173
   ```

4. **Seed the database**
   ```bash
   npm run seed
   ```
   This creates an initial admin user:
   - Email: `admin@example.com`
   - Password: `adminpassword123`

## 🚦 Running the Application

### Development Mode
```bash
npm run dev
```
Server runs on `http://localhost:5000`

### Production Mode
```bash
npm run build
npm start
```

## 📁 Project Structure

```
src/
├── config/           # Configuration files
│   └── db.ts        # MongoDB connection
├── controllers/     # Request handlers
│   ├── authController.ts
│   ├── dashboardController.ts
│   ├── projectController.ts
│   └── userController.ts
├── middlewares/     # Custom middleware
│   ├── auth.ts      # Authentication & authorization
│   └── errorHandler.ts
├── models/          # Mongoose schemas
│   ├── AuditLog.ts
│   ├── Invite.ts
│   ├── Project.ts
│   └── User.ts
├── routes/          # API routes
│   ├── authRoutes.ts
│   ├── dashboardRoutes.ts
│   ├── projectRoutes.ts
│   └── userRoutes.ts
├── utils/           # Utility functions
│   └── logger.ts    # Audit logging
├── app.ts           # Express app configuration
├── seed.ts          # Database seeding script
└── server.ts        # Server entry point
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/invite` - Invite new user (Admin only)
- `POST /api/auth/register-via-invite` - Register with invite token
- `GET /api/auth/validate-invite/:token` - Validate invite token

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update current user profile
- `PATCH /api/users/:id/role` - Update user role (Admin only)
- `PATCH /api/users/:id/status` - Update user status (Admin only)

### Projects
- `GET /api/projects` - Get all projects (paginated)
- `POST /api/projects` - Create new project
- `PATCH /api/projects/:id` - Update project (Admin only)
- `DELETE /api/projects/:id` - Soft delete project (Admin only)

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## 🔐 User Roles

| Role    | Permissions                                      |
|---------|--------------------------------------------------|
| ADMIN   | Full access to all features                      |
| MANAGER | View and create projects, manage assigned tasks  |
| STAFF   | View projects only                               |

## 🗄️ Database Models

### User
- name, email, password (hashed)
- role (ADMIN, MANAGER, STAFF)
- status (ACTIVE, INACTIVE)
- timestamps

### Project
- name, description
- status (ACTIVE, COMPLETED, ON_HOLD, DELETED)
- createdBy (User reference)
- isDeleted (soft delete flag)
- timestamps

### Invite
- email, role
- token (unique)
- expiresAt, acceptedAt
- timestamps

### AuditLog
- action, performedBy
- targetModel, targetId
- metadata
- timestamp

## 🧪 Testing

```bash
# Run tests (if configured)
npm test
```

## 📝 Environment Variables

| Variable      | Description                    | Default                  |
|---------------|--------------------------------|--------------------------|
| PORT          | Server port                    | 5000                     |
| MONGODB_URI   | MongoDB connection string      | Required                 |
| JWT_SECRET    | Secret key for JWT signing     | Required                 |
| JWT_EXPIRE    | JWT expiration time            | 30d                      |
| FRONTEND_URL  | Frontend application URL       | http://localhost:5173    |

## 🔧 Technologies Used

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Security**: bcrypt, helmet, cors, express-rate-limit
- **Development**: tsx, nodemon

## 📦 Dependencies

```json
{
  "express": "^5.0.1",
  "mongoose": "^8.9.4",
  "jsonwebtoken": "^9.0.2",
  "bcrypt": "^5.1.1",
  "dotenv": "^17.2.3",
  "cors": "^2.8.5",
  "helmet": "^8.0.0",
  "express-rate-limit": "^7.5.0"
}
```

## 🚨 Error Handling

The API uses centralized error handling with appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## 🔒 Security Best Practices

- Passwords are hashed using bcrypt (10 salt rounds)
- JWT tokens for stateless authentication
- Rate limiting on all routes (100 requests per 15 minutes)
- CORS configured for specific origins
- Helmet.js for security headers
- Environment variables for sensitive data
- Input validation and sanitization

## 📊 Audit Logging

All critical actions are logged in the AuditLog collection:
- User login
- User registration
- User role/status updates
- Project creation/updates/deletion
- Invite creation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- Anik Chakraborty - Initial work

## 🙏 Acknowledgments

- Express.js community
- MongoDB team
- TypeScript team
