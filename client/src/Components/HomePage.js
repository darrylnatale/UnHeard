import { BsGem } from "react-icons/bs";
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
import { useAuth0 } from "@auth0/auth0-react";
import useInterval from "../Functions/use-interval.hook";
import Timer from "./Timer";

const HomePage = () => {
    const { isLoading, error, isAuthenticated, user } = useAuth0();
    const {
        selectedArtist, submitted, moreToFetch, setMoreToFetch,
        exactSpotifyNameMatch, setSubmitted,
        spotifySearchResults,
        setSpotifyContent, setLastSearched,
        spotifyContent, isInMongo,setAllSpotifyTrackNames, allSpotifyTrackNames, allDiscogsTrackNames, setAllDiscogsTrackNames, mongoUser, setMongoUser
         } = useContext(Context);

  useEffect(() => {
    if (isAuthenticated){
      
        fetch(`/addUserToMongo`, {
            method: "POST",
            headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            },
            body: JSON.stringify({user}),
            }) 
        .then((res) => res.json())
        .then((data) => {
          console.log("user added", data)
          setMongoUser(data.data)


        if (isAuthenticated){
          
          fetch(`/getLast`, {
              method: "POST",
              headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              },
              body: JSON.stringify({user}),
              }) 
          .then((res) => res.json())
          .then((data) => {
            console.log("last searched", data)
            setLastSearched(data.data)
  
      
           })
           .catch((err) => console.log(err));
      }
    
         })
         .catch((err) => console.log(err));
    }
  },[isAuthenticated])


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
                  setSubmitted(false)
                  setAllSpotifyTrackNames(data.data.spotifyTracks.map((spotifyTrack) => spotifyTrack.name))
                  // setSpotifyAlbums(data.data.spotifyAlbums)
              }
           })
           .catch((err) => console.log(err));
      }





      const getDiscogsContent = (discogsArtistId, page) => {
        console.log("getDiscogsContent fxn run!")
        console.log(moreToFetch)
        fetch(`/getDiscogsContent/`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({discogsArtistId, page}),
          }) 
              .then((res) => res.json())
              .then((data) => {
                  console.log(data)
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
              console.log("pages",discogsContent.paginationDetails.pages)
              setAllDiscogsTrackNames(discogsTrackNameArray)
              if (discogsContent.paginationDetails.pages > 1){
                setMoreToFetch((prevNumPage) => prevNumPage+1)
                

                
              } 
            })
            .catch((err) => console.log(err));
    }
    
    
    


useEffect(() => {
  if(isInMongo){
    getSpotifyContent(selectedArtist.spotifyArtistId, selectedArtist.artistName)
    getDiscogsContent(selectedArtist.discogsArtistId)
  }
  },[isInMongo])

  const functionexample = () => {
    console.log("example run")
  }
    
  // useInterval(() => moreToFetch !== 0 && functionexample(),10000)
  
  

    return ( 
        <Page>
        <Copy><h1>Find hidden gems by your favourite musicians</h1></Copy>
        <StyledBsGem />
        {/* {moreToFetch !== 0 && <Timer functionToCall={() => getDiscogsContent(selectedArtist.discogsArtistId, moreToFetch)}/>} */}
        {submitted && <SearchResults />}
        
        {exactSpotifyNameMatch && <ArtistVerification getDiscogsContent={getDiscogsContent} getSpotifyContent={getSpotifyContent}/>}     
        {(allSpotifyTrackNames || allDiscogsTrackNames) && <><SpotifyResults / ><StyledBsGem /></>}
        
        {(allSpotifyTrackNames || allDiscogsTrackNames) && <DiscogsResults / >}
        {allSpotifyTrackNames && allDiscogsTrackNames && <Found/>}
        </Page>
    );
}
 
export default HomePage;

const Page = styled.div`
  font-family: "Zen Dots", cursive;
  display: flex;
  padding: 20px;
  align-items: center;
  /* justify-content: center; */
  width: auto;
  height: 100%;
  flex-direction: column;
  text-align: center;
  background-color: #e9ecef;
  
  li {
    list-style: none;
  }

  h1 {
    font-size: 30px;
    margin-bottom: 50px;
    text-align: center;
  }
`;
const StyledBsGem = styled(BsGem)`
font-size: 30px;
`
const Copy = styled.div`
text-decoration:underline
`

