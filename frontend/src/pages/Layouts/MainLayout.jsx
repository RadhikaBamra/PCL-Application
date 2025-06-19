import React from "react";
import NavBar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

const MainLayout = ({ children }) => {
  return (
    <>
      <NavBar />
      {children}
      <Footer />
    </>
  );
};

export default MainLayout;
