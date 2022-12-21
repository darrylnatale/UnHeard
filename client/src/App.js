import { useEffect, useContext, useState } from "react";
import { Context } from "./Context";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./css/styles.css"
import styled from "styled-components";
import GlobalStyles from "./Components/GlobalStyles";

import Profile from "./Components/Profile";


import HomePage from "./Components/HomePage";
import Header from "./Components/Header";

const App = () => {
  
    document.title = "UnHeard - Find Rare Tracks By Musicians You Love";
  
  const {} = useContext(Context);

  useEffect(() => {
    fetch("/loginToSpotify")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <BrowserRouter>
      <StyledApp>
        <GlobalStyles />
        <Header />
        

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </StyledApp>
    </BrowserRouter>
  );
};

export default App;

const StyledApp = styled.div`

height: 100vh;
background-color: #e9ecef;
`;
