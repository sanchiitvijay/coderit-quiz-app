# Quiz Master - Full-Stack Quiz Application

A modern, interactive quiz application built with React, Tailwind CSS, and Appwrite for the backend.

## Features

- 🎯 **Interactive Quiz Taking** - Smooth, animated quiz experience with timer
- 🏆 **Leaderboard System** - Track scores and rankings
- 📊 **Results & Analytics** - Detailed performance analysis with confetti celebrations
- 🌓 **Dark/Light Mode** - Toggle between themes
- 📱 **Responsive Design** - Works on all devices
- ⚡ **Fast Loading** - Optimized with skeleton loaders
- 🎨 **Beautiful UI** - Modern design with Framer Motion animations
- 🔧 **Admin Panel** - Create, edit, and manage quizzes
- 📈 **Real-time Updates** - Live leaderboard updates

## Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Router** - Client-side routing
- **React Icons** - Icon library
- **React Confetti** - Celebration animations
- **React Loading Skeleton** - Loading states

### Backend
- **Appwrite** - Backend-as-a-Service
- **Database** - Document-based storage
- **File Storage** - Image and media uploads
- **Real-time** - Live updates

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Appwrite account

### 1. Setup Appwrite

1. Create an account at [Appwrite Cloud](https://cloud.appwrite.io/)
2. Create a new project
3. Create a database called `quiz_database`
4. Create collections:
   - `quizzes` - Store quiz information
   - `questions` - Store quiz questions
   - `results` - Store quiz results
5. Create a storage bucket called `quiz_images`

### 2. Configure Collections

#### Quizzes Collection
- `title` (string, required)
- `description` (string, required)
- `difficulty` (string, default: "Easy")
- `timeLimit` (integer, default: 10)
- `questionCount` (integer, default: 0)
- `createdAt` (string, required)

#### Questions Collection
- `quiz_id` (string, required)
- `question` (string, required)
- `options` (array of strings, required)
- `correctAnswer` (integer, required)

#### Results Collection
- `quiz_id` (string, required)
- `user_name` (string, required)
- `user_email` (string, required)
- `score` (integer, required)
- `total_questions` (integer, required)
- `percentage` (integer, required)
- `answers` (string, required)
- `time_taken` (integer, default: 0)
- `timestamp` (string, required)

### 3. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 4. Configure Environment

Update the Appwrite configuration in `src/utils/appwrite.js`:

\`\`\`javascript
client
  .setEndpoint('https://cloud.appwrite.io/v1') // Your Appwrite Endpoint
  .setProject('YOUR_PROJECT_ID') // Your project ID

export const appwriteConfig = {
  endpoint: 'https://cloud.appwrite.io/v1',
  projectId: 'YOUR_PROJECT_ID',
  databaseId: 'quiz_database',
  collections: {
    quizzes: 'quizzes',
    questions: 'questions',
    results: 'results'
  },
  bucketId: 'quiz_images'
}
\`\`\`

### 5. Run the Application

\`\`\`bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
\`\`\`

## Usage

### For Users
1. **Browse Quizzes** - View available quizzes on the home page
2. **Take Quiz** - Click "Start Quiz" and enter your details
3. **Answer Questions** - Navigate through questions with timer
4. **View Results** - See your score and performance analysis
5. **Check Leaderboard** - Compare your score with others

### For Admins
1. **Access Admin Panel** - Click "Admin" in the navigation
2. **Create Quiz** - Add title, description, difficulty, and time limit
3. **Add Questions** - Create multiple-choice questions with correct answers
4. **Manage Quizzes** - Edit or delete existing quizzes
5. **Preview** - Test quizzes before publishing

## Project Structure

\`\`\`
src/
├── components/
│   ├── Header.jsx           # Navigation header
│   ├── LoadingSkeleton.jsx  # Loading states
│   └── QuizCard.jsx         # Quiz preview cards
├── contexts/
│   ├── AppwriteContext.jsx  # Database operations
│   └── ThemeContext.jsx     # Theme management
├── hooks/
│   └── useQuiz.js          # Quiz-related logic
├── pages/
│   ├── AdminPanel.jsx       # Admin dashboard
│   ├── HomePage.jsx         # Quiz listing
│   ├── LeaderboardPage.jsx  # Rankings
│   ├── QuizPage.jsx         # Quiz taking
│   └── ResultsPage.jsx      # Score display
├── utils/
│   └── appwrite.js         # Appwrite configuration
├── App.jsx                 # Main app component
├── main.jsx               # Entry point
└── index.css              # Global styles
\`\`\`

## Features in Detail

### Quiz Taking Experience
- **User Registration** - Name and email before starting
- **Timer Integration** - Automatic submission when time runs out
- **Progress Tracking** - Visual progress bar and question counter
- **Answer Selection** - Clear selection with visual feedback
- **Navigation** - Previous/Next buttons for question flow

### Results & Analytics
- **Score Calculation** - Percentage-based scoring
- **Performance Analysis** - Accuracy, completion rate, time efficiency
- **Confetti Animation** - Celebration for high scores (80%+)
- **Social Sharing** - Share results via Web Share API

### Admin Features
- **Quiz Management** - Full CRUD operations
- **Question Builder** - Interactive question creation
- **Preview Mode** - Test quizzes before publishing
- **Analytics Dashboard** - Quiz statistics and performance

### UI/UX Features
- **Responsive Design** - Mobile-first approach
- **Dark Mode** - System preference detection
- **Loading States** - Skeleton screens for better UX
- **Error Handling** - Graceful error messages
- **Animations** - Smooth transitions with Framer Motion

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, please create an issue in the GitHub repository or contact the development team.

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically

### Netlify
1. Connect your repository
2. Build command: \`npm run build\`
3. Publish directory: \`dist\`

### Manual Deployment
1. Build the project: \`npm run build\`
2. Deploy the \`dist\` folder to your hosting service

## Troubleshooting

### Common Issues
- **Appwrite Connection**: Ensure project ID and endpoint are correct
- **Database Permissions**: Check collection permissions in Appwrite
- **CORS Issues**: Configure allowed origins in Appwrite settings

### Performance Tips
- Use React DevTools to identify re-renders
- Optimize images and assets
- Enable gzip compression on server
- Use CDN for static assets

---

Made with ❤️ by Quiz Master Team