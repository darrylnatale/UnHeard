import {  useEffect, useContext, useState  } from "react";
import { Context } from "./Context";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import styled from "styled-components";

import Profile from "./Components/Profile";
import GlobalFonts from './fonts/fonts';
import LoginButton from "./Components/LoginButton";
import LogoutButton from "./Components/LogoutButton";
import HomePage from "./Components/HomePage";
import Header from "./Components/Header";
const App = () => {
  
  const {isLoading, error} = useAuth0()

  

  
  const [testTracks, setTestTracks] = useState()
  const [tempTracks, setTempTracks] = useState(["track 1","track 2","track 3","track 4","track 5","track 6","track 7","track 8","track 9","track 10","track 11","track 12","track 13","track 14","track 15","track 16","track 17","track 18","track 19","track 20","track 21","track 22","track 23"])
  

  const {
     } = useContext(Context);
     

useEffect(() => {
    fetch("/loginToSpotify")
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
    })
    .catch((err) => console.log(err));
}, [])


  return (

    <BrowserRouter>
      <StyledApp>
        <GlobalFonts />
        <Header />
        {/* {error && <p>Authentication Error</p>}
        {!error && isLoading && <p>Loading...</p>}
        {!error && !isLoading && 
          <>
            <LoginButton />
            <LogoutButton />
          </>
        } */}
        
        <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/profile" element={<Profile />} />
        </Routes>
      </StyledApp>
    </BrowserRouter>
  
  )
}




export default App;

const StyledApp = styled.div`

`

