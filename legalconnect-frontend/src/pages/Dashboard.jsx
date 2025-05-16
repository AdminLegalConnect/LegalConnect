import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../services/AuthContext";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);

  return (
    <div>
      <h1>Bienvenue, {user?.email}</h1>
      <p>Rôle : {user?.role}</p>
    </div>
  );
};

export default Dashboard;
