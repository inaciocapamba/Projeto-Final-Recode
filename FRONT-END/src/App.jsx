import { useState } from 'react';
import FirstPage from './pages/FirstPage';
import StudentPage from './pages/StudentPage';
import LessonPage from './pages/LessonPage';
import AdminPage from './pages/AdminPage';
import SignUp from './pages/SignUp';
import ProfilePage from './pages/ProfilePage';

function App() {
  const [page, setPage] = useState('first');

  if (page === 'student') return <StudentPage onNavigate={setPage} />;
  if (page == 'profile') return <ProfilePage onNavegate={setPage}/>
  if (page === 'admin') return <AdminPage onNavigate={setPage}/>;
  if (page === 'lesson') return <LessonPage onNavigate={setPage} />;
  if (page === 'login') return <SignUp onNavigate={setPage}/>;
  return <FirstPage onNavigate={setPage} />;
}

export default App;
