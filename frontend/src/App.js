import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import TODOPage from "./pages/TODOPage";
import RegisterPage from "./pages/RegisterPage";


function App() {
  return (
    <Router>
      <Routes>
      <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/tasks" element={<TODOPage />} />
        <Route path="/" element={<LoginPage />} /> {//Redirect to login by default
        }
      </Routes>
    </Router>
  );
}

export default App;
