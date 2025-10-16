import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import QuizPage from './pages/QuizPage'
import CertificationPage from './pages/CertificationPage'
import DomainPage from './pages/DomainPage'
import QuestionManagement from './pages/admin/QuestionManagement'
import AboutMePage from './layouts/AboutMe'
import BlogPage from './layouts/BlogPage'
import IeltsPage from './layouts/IeltsPage'
import AuthPage from './pages/AuthPage'

function App() {

  return (
    <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/login" element={<AuthPage />} />
            <Route path="/certificate" element={<CertificationPage />} />
            <Route path="/:certificationId/domains" element={<DomainPage />} />
            <Route path="/quizpage" element={<QuizPage />} />
            <Route path="/admin/question/list" element={<QuestionManagement />} />
            <Route path="/about" element={<AboutMePage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/ielts" element={<IeltsPage />} />
          </Route>
        </Routes>
    </BrowserRouter>
  )
}

export default App
