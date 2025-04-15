import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TodoApp from "../components/TodoApp";

function TODOPage() {
  const navigate = useNavigate();

  useEffect(() => {//Redirect to login page in case there is no token 
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  return <TodoApp />;
}

export default TODOPage;
