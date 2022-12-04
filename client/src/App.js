import {  useEffect, useContext, useState  } from "react";
import styled from "styled-components"
import Searchbar from "./Components/Searchbar";
import { Context } from "./Context";
import Found from "./Components/Found";
import ArtistVerification from "./Components/ArtistVerification";
import SearchResults from "./Components/SearchResults";
import Header from "./Components/Header";
import Results from "./Components/Results";
import filter from "./Functions/filter";
import NotFound from "./Components/NotFound";
import LoginButton from "./Components/LoginButton";
import LogoutButton from "./Components/LogoutButton";
import Profile from "./Components/Profile";
import { useAuth0
 } from "@auth0/auth0-react";
const App = () => {
  
  const {isLoading, error} = useAuth0()

  const c = (tolog) => {
    console.log(tolog)
  }

  
  const [testTracks, setTestTracks] = useState()
  const [tempTracks, setTempTracks] = useState(["track 1","track 2","track 3","track 4","track 5","track 6","track 7","track 8","track 9","track 10","track 11","track 12","track 13","track 14","track 15","track 16","track 17","track 18","track 19","track 20","track 21","track 22","track 23"])
  

  const {
    setAnimationIndex,
    exactSpotifyNameMatch,
    spotifySearchResults,
    setSelectedArtist,
    setSpotifyAlbums,
    allSpotifyTrackNames,
    setAllSpotifyTrackNames,
    setSubmitted,
    discogsData,
    setDiscogsData,
     } = useContext(Context);
     

useEffect(() => {
    fetch("/loginToSpotify")
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
    })
    .catch((err) => console.log(err));

}, [])



const getAllContentFromSpotifyAndDiscogs = (spotifyArtistId, artistName, discogsArtistId) => {
  
  fetch(`/getSpotifyContent`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({spotifyArtistId, artistName}),
  }) 
    .then((res) => res.json())
    .then((data) => {
      console.log("content from spotify", data)

      if (data.data){
      setSubmitted(false)
      setSelectedArtist(data.data.spotifyArtistName)
      setAllSpotifyTrackNames(data.data.spotifyTracks.map((spotifyTrack) => spotifyTrack.name))
      setSpotifyAlbums(data.data.spotifyAlbums)
    }
     })
     .catch((err) => console.log(err));

  fetch(`/getDiscogsContent/`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({discogsArtistId}),
  }) 
      .then((res) => res.json())
      .then((data) => {
        console.log("content from discogs", data)
        
        
        setDiscogsData(data.data)
        
      
    })
    .catch((err) => console.log(err));
}









  
  

  
useEffect(() => {
  let index2 = 0
  const interval = setInterval(() => {
    
    setAnimationIndex(prevIndex => prevIndex + 1 )
    index2++      
    if (index2 > 3300){
      return clearInterval(interval)
    }
  }, 40 )

}, [discogsData])



  return (
    
    <Page>
      {error && <p>Authentication Error</p>}
      {!error && isLoading && <p>Loading...</p>}
      {!error && !isLoading && 
      <>
        <LoginButton />
        <LogoutButton />
      </>
      }
      <Profile />
      <Header />
      <Searchbar /> 
      <SearchResults getAllContentFromSpotifyAndDiscogs={ getAllContentFromSpotifyAndDiscogs } />

      {exactSpotifyNameMatch && <ArtistVerification getAllContentFromSpotifyAndDiscogs={ getAllContentFromSpotifyAndDiscogs } />}      
      
      {(!exactSpotifyNameMatch && spotifySearchResults) && <NotFound />}
      
      {(discogsData || allSpotifyTrackNames) && <Results />}
      {discogsData &&  <Found />}
  
  </Page>
  )
}




export default App;

const Page = styled.div`
  border: 1px solid black;
  margin: 100px 50px;
  text-align: center;
  li{
    list-style: none;
    }

  h1 {
    margin-bottom: 50px;
    text-align: center;
      }
`














