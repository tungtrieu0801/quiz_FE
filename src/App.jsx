import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import QuizPage from './pages/QuizPage'
import CertificationPage from './pages/CertificationPage'
import DomainPage from './pages/DomainPage'
import QuestionManagement from './pages/admin/QuestionManagement'

function App() {

  return (
    <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<CertificationPage />} />
            <Route path="/:certificationId/domains" element={<DomainPage />} />
            <Route path="/quizpage" element={<QuizPage />} />
            <Route path="/admin/question/list" element={<QuestionManagement />} />
          </Route>
        </Routes>
    </BrowserRouter>
  )
}

export default App
