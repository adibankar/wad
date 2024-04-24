import { useState } from 'react'
import reactLogo from './assets/react.svg'

// import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Navbar from './components/navbar/Navbar'
import Signup from './components/signup/Signup'
import Home from './components/home/Home';
import Login from './components/login/Login';
import About from './components/about/About';
import Contact from './components/contact/Contact';
import Createquizz from './components/quizz/Createquizz';
import GenerateQuestions from './components/generateQuestions/GenerateQuestions';
import AttemptQuizz from './components/attemptquizz/AttemptQuizz';
import GetQuizz from './components/quizz/GetQuizz';
import Profile from './components/profile/Profile';
import AttemptHistory from './components/AttemptHistory/AttemptHistory';


function App() {
 

  return (
   
    <Router>
      <>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/createquizz" element={<Createquizz />} />
          <Route path="/myquizzes" element={<GetQuizz />} />
          <Route path="/generatequestions/:quizzId" element={<GenerateQuestions />} />
          <Route path="/attemptquizz/:quizzId" element={<AttemptQuizz />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/attempthistory" element={<AttemptHistory />} />
          {/* <Route path="/generatequestions/get/:quizzId" element={<GenerateQuestions />} /> */}
        </Routes>
      </>
    </Router>
  )
}

export default App
