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
        selectedArtist, submitted, moreToFetch, setMoreToFetch, setShowFound, showFound, discogsContentFetched, setDiscogsContentFetched, 
        exactSpotifyNameMatch, setSubmitted, setTimerIndex, timerIndex,
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

const getDiscogsMasters = (discogsArtistId, albumId, page) => {
        console.log("getDiscogsMasters fxn run!")
        
        fetch(`/getDiscogsMasters/`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({discogsArtistId, albumId, page}),
          }) 
              .then((res) => res.json())
              .then((data) => {
                console.log(data)
                // setDiscogsContent(data.data)
                // const discogsContent = data.data
                // const discogsTrackNameArray = []

                // if (discogsContent.masters) {
                //   discogsContent.masters.mainReleases.roles.main.forEach(
                //     (discogsAlbumDetail) => {
                //       discogsAlbumDetail.tracklist.forEach((track) => {
                //         const artistId = track.artists
                //           ? track.artists.find((artist) => artist.id === discogsArtistId)
                //           : null;
                //         if (!artistId) {
                //           discogsTrackNameArray.push(track.title);
                //         }
                //       });
                //     }
                //   );
                // }
           
                // if (discogsContent.releases) {
                //   discogsContent.releases.roles.main.forEach((discogsAlbumDetail) => {
                //     discogsAlbumDetail.tracklist.forEach((track) => {
                //       const artistId = track.artists
                //         ? track.artists.find((artist) => artist.id === discogsArtistId)
                //         : null;
                //       if (!artistId) {
                //         discogsTrackNameArray.push(track.title);
                //       }
                //     });
                //   });
                // }
              
              
              // setAllDiscogsTrackNames(prevArray => [...(prevArray || []), ...discogsTrackNameArray])
              
              // return discogsContent
              
               
            })
            .catch((err) => console.log(err));
    }
    
    
useEffect(() => {
  
  if(isInMongo){
    
    getSpotifyContent(selectedArtist.spotifyArtistId, selectedArtist.artistName)
    // getDiscogsMasters(selectedArtist.discogsArtistId)
    getArtistReleases(selectedArtist.discogsArtistId, 1)
  }
  },[isInMongo])

  useEffect(() => {
    console.log("useeffect")
    
    if(allData.albums.length > 0){
      console.log("allData.albums.length")
      const combinedAlbums = [].concat(...allData.albums);

      const discogsMasters = []
        const discogsMastersMainReleaseIds = []
      const discogsReleases = []
    

    combinedAlbums.forEach((album) => {
        if (album.availableOn === "discogs" && album.type === "master" && album.role === "Main"){
            discogsMasters.push(album)
            discogsMastersMainReleaseIds.push(album.main_release)
        } else if (album.availableOn === "discogs" && album.type === "release"){
            discogsReleases.push(album)
        }
    })
    console.log("discogsMastersMainReleaseIds.length",discogsMastersMainReleaseIds.length)
      startFetching(allData.discogsArtistId, discogsMastersMainReleaseIds)
    }
    },[discogsContentFetched])
  
    useEffect(()=> {
      
    })

const startFetching = (discogsArtistId, discogsMasters) => {
  let index = 0
    console.log("Clicked")
    console.log("timerindex above interval", index)
    
    const interval = setInterval(() => {
      console.log("intervalrun")
      // setTimerIndex(prevIndex => prevIndex + 1)
     
      
      
      console.log("timerIndex in interval",index)
      console.log("discogsMastersindex", discogsMasters[index])
      console.log("discogsMasters.length", discogsMasters.length)
      
      getDiscogsMasters(discogsArtistId, discogsMasters[index])   
                      

      if (index >= discogsMasters.length - 1){
        console.log("index in if", index)
        console.log("interval stopped")
        return clearInterval(interval)
      } else {
        index++
        console.log("index in else", index)
      }

    }, 10000 )

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

      const renamedReleases = data.data.releases.map((release) => {
          
          const renamedRelease = Object.assign({}, release, {albumName: release.title})
          renamedRelease.availableOn = "discogs"
          delete renamedRelease.title
          
          return renamedRelease
        })

      setAllData(prevState => ({
        ...prevState,
        discogsArtistId: discogsArtistId,
        albums: [...prevState.albums, renamedReleases]
      }))
      
      if (data.data.pagination.urls.next){
        // setReleases(prevArray => [...(prevArray || []), ...data.data.releases])
        
        let nextPageUrl = data.data.pagination.urls.next
      
        for (let i = 0; i < pages - 1 ; i++){
          console.log(i, nextPageUrl )
          let nextPageResponse = await fetch(nextPageUrl)
          const data = await nextPageResponse.json();
          console.log("data",data)
          const renamedReleases = data.releases.map((release) => {
            const renamedData = Object.assign({},
              release, {albumName: release.title})
              renamedData.availableOn = "discogs"
              delete renamedData.title
              return renamedData
          })
          
          setAllData(prevState => ({
            ...prevState,
            albums: [...prevState.albums, renamedReleases]
          }))

          nextPageUrl = data.pagination.urls.next
          console.log(i, nextPageUrl)
          
         }
      }
      setDiscogsContentFetched(true) 
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
          <button onClick={() => getArtistReleases(86857,1)}>getTrackAppearances</button>
          <button onClick={startFetching}>startFetching</button>
        {/* <CopyContainer>
          
          
          
          <Copy><h1>Find hidden gems by your favourite musicians</h1></Copy>
          <div>UnHeard searches through a musician's entire catalog and shows you all their songs you <span>can't</span> find on Spotify!</div>
        </CopyContainer> */}
        {/* <StyledBsGem /> */}
        
        {submitted && <SearchResults />}
        
        {exactSpotifyNameMatch && <ArtistVerification getDiscogsMasters={getDiscogsMasters} getSpotifyContent={getSpotifyContent}/>}     
        {allData && <ResultsTable />}
        {/* {(allSpotifyTrackNames || isInMongo) && <><SpotifyResults / ><StyledBsGem /></>}
        
        {(allSpotifyTrackNames || isInMongo) && <DiscogsResults / >}
        {isInMongo && <CompareButton onClick={showFoundSection}>Compare Results!</CompareButton>}
        {showFound && <Found/>}
        {releases && <Releases />} */}
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

