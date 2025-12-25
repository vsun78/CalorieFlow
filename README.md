# Calorie Karma

A web-based accountability system for friends to track their daily caloric goals together. Users form groups where they set mutual punishments for failing to meet their goals, creating a supportive and motivating environment for achieving health objectives.

**Live Application:** https://caloriekarma.netlify.app

## Overview

Calorie Karma enables friends to hold each other accountable through a group-based challenge system. When creating a group, the group leader assigns punishments for all members (including themselves), which are agreed upon collectively. These punishments can be physical activities like 50 pushups or a 2km run.

At the end of each day, the application tracks whether users met their set caloric goals. Groups earn achievement badges for surviving consecutive days, fostering long-term commitment and teamwork.

## Features

### Core Functionality
- **Group Formation**: Create groups with 2-4 members
- **Mutual Accountability**: Group leaders assign punishments to all members, including themselves
- **Daily Tracking**: Monitor caloric consumption against daily budgets
- **End of Day Simulation**: Evaluate if users met their goals and display results
- **Achievement System**: Earn badges for group survival milestones (10, 30, 100, 365 days)
- **Random Punishment Selection**: When a user fails, the system randomly selects from available punishments assigned by group members

### Account Management
- User registration and secure login
- Change username
- Change password
- Delete account
- View current group membership

### Security
- BCrypt password hashing for secure credential storage
- Input sanitization to prevent XSS attacks

## Technology Stack

### Frontend
- HTML5
- CSS3
- JavaScript (Vanilla)

### Backend
- Java
- Spring Boot
- PostgreSQL
- BCrypt for password security

### Architecture
- **Controller Layer**: Handles HTTP requests and responses
- **Service Layer**: Contains business logic
- **Repository Layer**: Manages database operations

### Development & Testing
- POSTMAN for API testing

### Deployment
- **Frontend**: Netlify
- **Backend**: Railway
- **Database**: PostgreSQL (hosted on Railway)

## API Endpoints

### User Endpoints
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - User login
- `GET /api/users/get` - Retrieve user information
- `PUT /api/users/update` - Update username or password
- `PUT /api/users/updateStatus` - Update user's daily goal status
- `DELETE /api/users/delete` - Delete user account

### Group Endpoints
- `POST /api/groups/create` - Create a new group
- `GET /api/groups/get` - Get group members
- `GET /api/groups/getGroup` - Get group name
- `GET /api/groups/getDays` - Get days survived by group
- `PUT /api/groups/updateDays` - Increment days survived
- `DELETE /api/groups/delete` - Delete group

### Punishment Endpoints
- `POST /api/punishments/assign` - Assign punishment to a user
- `GET /api/punishments/retreive` - Retrieve punishment for a user

## Usage

1. **Sign Up**: Create an account with email, username, and password
2. **Create/Join Group**: Form a group with friends (2-4 members)
3. **Set Punishments**: As group creator, assign punishments for each member including yourself
4. **Track Daily Calories**: Log your food intake and exercise throughout the day
5. **Calculate Results**: Use "Calculate remaining calories" to see your progress
6. **Simulate End of Day**: Check if you and your group met your goals
7. **View Punishments**: See which punishments apply if goals weren't met
8. **Earn Achievements**: Collect badges as your group survives together

## Project Structure

```
CalorieFlow/
├── src/main/java/com/calorieflow/backend/
│   ├── controller/          # REST API controllers
│   ├── service/             # Business logic layer
│   ├── repository/          # Database access layer
│   ├── User.java            # User entity
│   ├── Group.java           # Group entity
│   └── Punishment.java      # Punishment entity
├── home.html                # Main calorie tracking page
├── login.html               # Login page
├── signup.html              # Registration page
├── settings.html            # Account settings page
├── group-onboarding.html    # Group creation page
├── punishment-creation.html # Punishment assignment page
├── script.js                # Main application logic
├── loginJS.js               # Authentication logic
├── group.js                 # Group creation logic
├── punishment-creation.js   # Punishment assignment logic
├── settings.js              # Settings page logic
└── style.css                # Main stylesheet
```

## Database Schema

### Users Table
- email (Primary Key)
- username
- passwordHash
- dateCreated
- groupID (Foreign Key)
- underBudget (Boolean)

### Groups Table
- id (Primary Key)
- name
- days

### Punishments Table
- id (Primary Key)
- assignerEmail
- targetEmail
- details

## Design Decisions

### Group Disbandment
The feature where groups disband if all members fail simultaneously has not been implemented in the current version. This design choice was made to facilitate easier demonstration and testing of the application's core features.

### Daily Simulation
Rather than implementing automatic end-of-day calculations, a "Simulate the end of the day" button allows users to manually trigger the evaluation process. This provides flexibility for demonstration and testing purposes.

### Punishment System
Each group member assigns one punishment per target user. When a user fails to meet their goal, the system randomly selects from all punishments assigned to them, ensuring variety and fairness.

## Authors

This project was developed as a collaborative accountability system for caloric goal tracking.

## License

This project is available for educational and personal use.
