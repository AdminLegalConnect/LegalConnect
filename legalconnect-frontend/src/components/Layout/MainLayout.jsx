import React from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <Header />
      <main style={{ paddingTop: "80px" }}>
        <Outlet />
      </main>
    </>
  );
};

export default MainLayout;
