
import styled from "styled-components"
import { useContext, useEffect } from "react";
import Found from "./Found"
import { Context } from "../Context";
import ArtistVerification from "./ArtistVerification"
import NotFound from "./NotFound"
import Results from "./Results";
import SearchResults from "./SearchResults"
import SpotifyResults from "./SpotifyResults"
import DiscogsResults from "./DiscogsResults";
import getSpotifyContent from "../Functions/getSpotifyContent";
const HomePage = () => {

    const {
        selectedArtist,
        exactSpotifyNameMatch,
        spotifySearchResults,
        setSpotifyContent,
        spotifyContent, isInMongo,setAllSpotifyTrackNames, allSpotifyTrackNames, allDiscogsTrackNames, setAllDiscogsTrackNames
         } = useContext(Context);

  
         const getSpotifyContent = (spotifyArtistId, artistName) => {
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
                  
                  setAllSpotifyTrackNames(data.data.spotifyTracks.map((spotifyTrack) => spotifyTrack.name))
                  // setSpotifyAlbums(data.data.spotifyAlbums)
              }
           })
           .catch((err) => console.log(err));
      }





      const getDiscogsContent = (discogsArtistId) => {
    
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
    
                const discogsContent = data.data
                const discogsTrackNameArray = []
    
                if(discogsContent.masters){
                  discogsContent.masters.mainReleases.roles.main.forEach((discogsAlbumDetail) => {
                      discogsAlbumDetail.tracklist.forEach((track) => {
                      if (track.artists){
                          track.artists.forEach((artistOnTrack) => {
                              if (artistOnTrack.id === discogsArtistId){
                                  discogsTrackNameArray.push(track.title)
                                  }
                              })            
                      } else {
                          discogsTrackNameArray.push(track.title)
                      }
                      })
                  })
              }
           
              if(discogsContent.releases){
                  discogsContent.releases.roles.main.forEach((discogsAlbumDetail) => {
                      discogsAlbumDetail.tracklist.forEach((track) => {
                          if (track.artists){
                              track.artists.forEach((artistOnTrack) => {
                                  if (artistOnTrack.id === discogsArtistId){
                                      discogsTrackNameArray.push(track.title)
                                  }
                              })     
                          } else {
                              discogsTrackNameArray.push(track.title)
                          }
                      })
                  })
              }
    
              setAllDiscogsTrackNames(discogsTrackNameArray)
            })
            .catch((err) => console.log(err));
    }
    
    
    


useEffect(() => {
  if(isInMongo){
    getSpotifyContent(selectedArtist.spotifyArtistId, selectedArtist.artistName)
    getDiscogsContent(selectedArtist.discogsArtistId)
  }
  },[isInMongo])

    return ( 
        <Page>
        {/* <p>Find hidden gems by your favourite musicians</p> */}
        <SearchResults />
        {exactSpotifyNameMatch && <ArtistVerification />}     
        {allSpotifyTrackNames && <SpotifyResults / >}
        {(allSpotifyTrackNames || allDiscogsTrackNames) && <DiscogsResults / >}
        {/* {allSpotifyTrackNames && allDiscogsTrackNames && <Found/>} */}
        </Page>
    );
}
 
export default HomePage;

const Page = styled.div`
  display: flex;
  padding: 20px;
  align-items: center;
  justify-content: center;
  width: auto;
  height: 100%;
  flex-direction: column;
  text-align: center;
  background-color: #e9ecef;
  
  li {
    list-style: none;
  }

  h1 {
    margin-bottom: 50px;
    text-align: center;
  }
`;