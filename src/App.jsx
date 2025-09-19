import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import QuizPage from './pages/QuizPage'

function App() {

  return (
    <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<QuizPage />} />
            <Route path="/about" element={<h1>About Page</h1>} />
          </Route>
        </Routes>
    </BrowserRouter>
  )
}

export default App
