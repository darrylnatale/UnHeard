import { BsGem } from "react-icons/bs";
import styled from "styled-components"
import { useContext, useEffect, useState } from "react";
import Found from "./Found"
import { Context } from "../Context";
import ArtistVerification from "./ArtistVerification"
import NotFound from "./NotFound"
import Results from "./Results";
import SearchResults from "./SearchResults"
import SpotifyResults from "./SpotifyResults"
import DiscogsResults from "./DiscogsResults";
import Releases from "./Releases";
import { useAuth0 } from "@auth0/auth0-react";
import ResultsTable from "./ResultsTable";


const HomePage = () => {
    const { isLoading, error, isAuthenticated, user } = useAuth0();
    const {
        selectedArtist, submitted, moreToFetch, setMoreToFetch, setShowFound, showFound, 
        exactSpotifyNameMatch, setSubmitted, setAnimationIndex, animationIndex,
        spotifySearchResults, releases, setReleases, allData, setAllData,
        setSpotifyContent, setLastSearched, setDiscogsContent,
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
            setLastSearched(data.data)
           })
           .catch((err) => console.log(err));
      }
    
         })
         .catch((err) => console.log(err));
    }
  },[isAuthenticated])

  const showFoundSection = () => {
    setShowFound(true)
  }
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
                  
                  
                  setAllData(prevState => ({
                    ...prevState,
                    artistName: data.data.spotifyArtistName,
                    spotifyArtistId: data.data.spotifyArtistId,
                    albums: [...prevState.albums, data.data.spotifyAlbums],
                    tracks: data.data.spotifyTracks
                  }));
                  
              }
           })
           .catch((err) => console.log(err));
      }

      

const getDiscogsContent = (discogsArtistId, page) => {
        console.log("getDiscogsContent fxn run!")
        console.log("page", page)
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
                setDiscogsContent(data.data)
                const discogsContent = data.data
                const discogsTrackNameArray = []

                console.log(discogsContent.masters.mainReleases.roles.main)
                if (discogsContent.masters) {
                  discogsContent.masters.mainReleases.roles.main.forEach(
                    (discogsAlbumDetail) => {
                      discogsAlbumDetail.tracklist.forEach((track) => {
                        const artistId = track.artists
                          ? track.artists.find((artist) => artist.id === discogsArtistId)
                          : null;
                        if (!artistId) {
                          discogsTrackNameArray.push(track.title);
                        }
                      });
                    }
                  );
                }
           
                if (discogsContent.releases) {
                  discogsContent.releases.roles.main.forEach((discogsAlbumDetail) => {
                    discogsAlbumDetail.tracklist.forEach((track) => {
                      const artistId = track.artists
                        ? track.artists.find((artist) => artist.id === discogsArtistId)
                        : null;
                      if (!artistId) {
                        discogsTrackNameArray.push(track.title);
                      }
                    });
                  });
                }
              
              
              setAllDiscogsTrackNames(prevArray => [...(prevArray || []), ...discogsTrackNameArray])
              
              return discogsContent
              
               
            })
            .catch((err) => console.log(err));
    }
    
    
useEffect(() => {
  if(isInMongo){
    getSpotifyContent(selectedArtist.spotifyArtistId, selectedArtist.artistName)
    // getDiscogsContent(selectedArtist.discogsArtistId)
    getArtistReleases(selectedArtist.discogsArtistId, 1)
  }
  },[isInMongo])

  
const startFetching = () => {
    console.log("Clicked")
    let index = 0
    const interval = setInterval(() => {
      
      setAnimationIndex(prevIndex => prevIndex + 1)
      
      index++      
      
      getDiscogsContent(8760, index) 
      if (index > 230){
        console.log("interval stopped")
        return clearInterval(interval)
      }

    }, 90000 )

  }
  
const getArtistReleases = async (discogsArtistId, page) => {
    console.log("getArtistReleases Fxn Run")
    try {
      const response = await fetch(`/getArtistReleases`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({discogsArtistId, page}),
      })
      const data = await response.json();
      
      const pages = data.data.pagination.pages

      // setReleases(prevArray => [...(prevArray || []), ...data.data.releases])
      // console.log("releases",releases)
      setAllData(prevState => ({
        ...prevState,
        albums: [...prevState.albums, data.data.releases]
      }))
      
      if (data.data.pagination.urls.next){
        // setReleases(prevArray => [...(prevArray || []), ...data.data.releases])
        
        
        
        let nextPageUrl = data.data.pagination.urls.next
      
        for (let i = 0; i < pages - 1 ; i++){
          console.log(i, nextPageUrl )
          let nextPageResponse = await fetch(nextPageUrl)
          const data = await nextPageResponse.json();
          console.log("data",data)
          // setReleases(prevArray => [...(prevArray || []), ...data.releases])
          setAllData(prevState => ({
            ...prevState,
            albums: [...prevState.albums, data.releases]
          }))
          nextPageUrl = data.pagination.urls.next
          console.log(i, nextPageUrl)
          
         }
      } 
    }
    catch (err){
      console.log(err)
    }
  }

  const getTrackAppearances = (idArray, param2) => {
    
    fetch(`/getTrackAppearances`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({idArray, param2}),
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data.data)
    })
    .catch((err) => console.log(err));
  }
// console.log(allData)
// console.log(releases)
    return ( 
        <Page>
        <CopyContainer>
          <button onClick={() => getArtistReleases(86857,1)}>getTrackAppearances</button>
          {/* <button onClick={() => getArtistReleases(86857,1)}>getArtistDetails</button>
          <button onClick={startFetching}>startFetching</button> */}
          <Copy><h1>Find hidden gems by your favourite musicians</h1></Copy>
          <div>UnHeard searches through a musician's entire catalog and shows you all their songs you <span>can't</span> find on Spotify!</div>
        </CopyContainer>
        <StyledBsGem />
        
        {submitted && <SearchResults />}
        
        {exactSpotifyNameMatch && <ArtistVerification getDiscogsContent={getDiscogsContent} getSpotifyContent={getSpotifyContent}/>}     
        {allData && <ResultsTable />}
        {/* {(allSpotifyTrackNames || isInMongo) && <><SpotifyResults / ><StyledBsGem /></>}
        
        {(allSpotifyTrackNames || isInMongo) && <DiscogsResults / >}
        {isInMongo && <CompareButton onClick={showFoundSection}>Compare Results!</CompareButton>}
        {showFound && <Found/>} */}
        {/* {releases && <Releases />} */}
        </Page>
    );
}
 
export default HomePage;

const Page = styled.div`
overflow: auto;
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
const CompareButton = styled.button`
box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  font-family: "Zen Dots", cursive;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: auto;
  width: 425px;
  height: 250px;
  border-radius: 20px;
  background: white;
  margin: 25px 25px 0 25px;
  padding: 20px;
  border: none;
  `

const StyledBsGem = styled(BsGem)`
font-size: 30px;
`
const Copy = styled.div`
text-decoration:underline
`

const CopyContainer = styled.div`
max-width: 800px;
margin-bottom: 20px;
span{
  color: red;
}
`

