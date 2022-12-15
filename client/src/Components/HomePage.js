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
        exactSpotifyNameMatch, setSubmitted, setTimerIndex, timerIndex, discogsMastersDone, setDiscogsMastersDone,
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
        console.log(discogsArtistId, albumId, page)
        
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
                
                // assign the masters to allData
                

                const renamedMasters = data.data.masters.map((master) => {
          
                  const renamedMaster = Object.assign({}, master, {albumName: master.title})
                  renamedMaster.availableOn = "discogs"
                  renamedMaster.otherVersions = data.data.otherVersions
                  renamedMaster.artistName = master.artists_sort
                  delete renamedMaster.title
                  delete renamedMaster.status
                  delete renamedMaster.stats
                  delete renamedMaster.blocked_from_sale
                  delete renamedMaster.community
                  delete renamedMaster.companies
                  delete renamedMaster.date_changed
                  delete renamedMaster.estimated_weight
                  delete renamedMaster.format_quantity
                  delete renamedMaster.lowest_price
                  delete renamedMaster.num_for_sale
                  delete renamedMaster.series
                  return renamedMaster
                })
                
                const tracks = []

                renamedMasters.forEach((renamedMaster) => {
                  renamedMaster.tracklist.forEach((tracklistItem) => {
                    if (tracklistItem.artists) {
                      tracklistItem.artists.forEach((artist) => {
                      
                      if (Number(artist.id) === discogsArtistId){
                        const renamedTrackListItem = Object.assign({}, tracklistItem, {trackName: tracklistItem.title})
                    renamedTrackListItem.availableOn = "discogs"
                    renamedTrackListItem.onAlbum = renamedMaster
                    renamedTrackListItem.artists = [{name: renamedMaster.artistName}]
                    delete renamedTrackListItem.title
                    tracks.push(renamedTrackListItem)
                      }
                    })
                  } else {
                    
                    const renamedTrackListItem = Object.assign({}, tracklistItem, {trackName: tracklistItem.title})
                    renamedTrackListItem.availableOn = "discogs"
                    renamedTrackListItem.onAlbum = renamedMaster
                    renamedTrackListItem.artists = [{name: renamedMaster.artistName}]
                    delete renamedTrackListItem.title
                    tracks.push(renamedTrackListItem)
                  }
                    
                  })
                })


                setAllData(prevState => ({
                  ...prevState,
                  albums: [...prevState.albums, renamedMasters],
                  tracks: [...prevState.tracks, tracks]
                }))
                
                // get the versions details (loop through the pages if necessary)
              
               
            })
            .catch((err) => console.log(err));
    }

const getDiscogsReleases = (discogsArtistId, albumId, page) => {
      console.log("getDiscogsReleases fxn run!")
      console.log(discogsArtistId, albumId, page)
      fetch(`/getDiscogsReleases/`, {
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
              
              
              

              // const renamedMasters = data.data.masters.map((master) => {
        
              //   const renamedMaster = Object.assign({}, master, {albumName: master.title})
              //   renamedMaster.availableOn = "discogs"
              //   renamedMaster.otherVersions = data.data.otherVersions
              //   renamedMaster.artistName = master.artists_sort
              //   delete renamedMaster.title
              //   delete renamedMaster.status
              //   delete renamedMaster.stats
              //   delete renamedMaster.blocked_from_sale
              //   delete renamedMaster.community
              //   delete renamedMaster.companies
              //   delete renamedMaster.date_changed
              //   delete renamedMaster.estimated_weight
              //   delete renamedMaster.format_quantity
              //   delete renamedMaster.lowest_price
              //   delete renamedMaster.num_for_sale
              //   delete renamedMaster.series
              //   return renamedMaster
              // })
              
              const tracks = []

              // renamedMasters.forEach((renamedMaster) => {
              //   renamedMaster.tracklist.forEach((tracklistItem) => {
              //     if (tracklistItem.artists) {
              //       tracklistItem.artists.forEach((artist) => {
                    
              //       if (Number(artist.id) === discogsArtistId){
              //         const renamedTrackListItem = Object.assign({}, tracklistItem, {trackName: tracklistItem.title})
              //     renamedTrackListItem.availableOn = "discogs"
              //     renamedTrackListItem.onAlbum = renamedMaster
              //     renamedTrackListItem.artists = [{name: renamedMaster.artistName}]
              //     delete renamedTrackListItem.title
              //     tracks.push(renamedTrackListItem)
              //       }
              //     })
              //   } else {
                  
              //     const renamedTrackListItem = Object.assign({}, tracklistItem, {trackName: tracklistItem.title})
              //     renamedTrackListItem.availableOn = "discogs"
              //     renamedTrackListItem.onAlbum = renamedMaster
              //     renamedTrackListItem.artists = [{name: renamedMaster.artistName}]
              //     delete renamedTrackListItem.title
              //     tracks.push(renamedTrackListItem)
              //   }
                  
              //   })
              // })


              // setAllData(prevState => ({
              //   ...prevState,
              //   albums: [...prevState.albums, renamedMasters],
              //   tracks: [...prevState.tracks, tracks]
              // }))
              
              // get the versions details (loop through the pages if necessary)
            
             
          })
          .catch((err) => console.log(err));
  }
    
    
useEffect(() => {
  
  if(isInMongo){
    
    getSpotifyContent(selectedArtist.spotifyArtistId, selectedArtist.artistName)
    getArtistReleases(selectedArtist.discogsArtistId, 1)
  }
  },[isInMongo])

useEffect(() => {
  console.log("useeffect 1 ")
    
    if(allData.albums.length > 0){
      
      const combinedAlbums = [].concat(...allData.albums);

      const discogsMasters = []
        const discogsMastersMainReleaseIds = []

    combinedAlbums.forEach((album) => {
        if (album.availableOn === "discogs" && album.type === "master" && album.role === "Main"){
           discogsMasters.push(album)
            discogsMastersMainReleaseIds.push(album.main_release)
        } else if (album.availableOn === "discogs" && album.type === "master" && album.role === "UnofficialRelease"){
            discogsMasters.push(album)  
    
            discogsMastersMainReleaseIds.push(album.main_release)
        } else if (album.availableOn === "discogs" && album.type === "master" && album.role === "TrackAppearance"){
          discogsMasters.push(album)  
          
          discogsMastersMainReleaseIds.push(album.main_release)
      } else if (album.availableOn === "discogs" && album.type === "master" && album.role === "Remix"){
        discogsMasters.push(album)  
        
        discogsMastersMainReleaseIds.push(album.main_release)
      } 
    })

      startFetchingMasters(allData.discogsArtistId, discogsMastersMainReleaseIds)
    }
    },[discogsContentFetched])
  
useEffect(() => {
  console.log("useeffect 2 ")
  if(allData.albums.length > 0){
      
    const combinedAlbums = [].concat(...allData.albums);

      const discogsReleases = []
        const discogsReleasesMainRoleIds = []
  

  combinedAlbums.forEach((album) => {
          if (album.availableOn === "discogs" && album.type === "release" && album.role === "Main"){
            discogsReleasesMainRoleIds.push(album.id)
          } else if (album.availableOn === "discogs" && album.type === "release" && album.role === "Appearance"){
              
          } else if (album.availableOn === "discogs" && album.type === "release" && album.role === "TrackAppearance"){
            
          } 
  })

  console.log(discogsReleasesMainRoleIds)
    startFetchingReleases(allData.discogsArtistId, discogsReleasesMainRoleIds)
  }
}, [discogsMastersDone])

const startFetchingMasters = (discogsArtistId, discogsMastersArray) => {
  let index = 0
    
    
    const interval = setInterval(() => {
    
      
      getDiscogsMasters(discogsArtistId, discogsMastersArray[index])   
                      

      if (index >= discogsMastersArray.length - 1){
        console.log("done masters")
        setDiscogsMastersDone(true)
        return clearInterval(interval)
      } else {
        index++
        
      }

    }, 3000 )

  }
  
const startFetchingReleases = (discogsArtistId, discogsReleasesArray) => {
    let index = 0
      
      
      const interval = setInterval(() => {
      
        
        getDiscogsReleases(discogsArtistId, discogsReleasesArray[index])   
                        
  
        if (index >= discogsReleasesArray.length - 1){
          console.log("done releases")
          return clearInterval(interval)
        } else {
          index++
          
        }
  
      }, 3000 )
  
    }
const getArtistReleases = async (discogsArtistId, page) => {
    
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
          delete renamedRelease.status
          delete renamedRelease.stats
          delete renamedRelease.blocked_from_sale
          delete renamedRelease.community
          delete renamedRelease.companies
          delete renamedRelease.date_changed
          delete renamedRelease.estimated_weight
          delete renamedRelease.format_quantity
          delete renamedRelease.lowest_price
          delete renamedRelease.num_for_sale
          delete renamedRelease.series
          
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
          
          let nextPageResponse = await fetch(nextPageUrl)
          const data = await nextPageResponse.json();
          
          const renamedReleases = data.releases.map((release) => {
            const renamedData = Object.assign({},
              release, {albumName: release.title})
              renamedData.availableOn = "discogs"
              delete renamedData.title
              delete renamedData.status
              delete renamedData.stats
              delete renamedData.blocked_from_sale
              delete renamedData.community
              delete renamedData.companies
              delete renamedData.date_changed
              delete renamedData.estimated_weight
              delete renamedData.format_quantity
              delete renamedData.lowest_price
              delete renamedData.num_for_sale
              delete renamedData.series
              return renamedData
          })
          
          setAllData(prevState => ({
            ...prevState,
            albums: [...prevState.albums, renamedReleases]
          }))

          nextPageUrl = data.pagination.urls.next
          
          
         }
      }
      setDiscogsContentFetched(true) 
    }
    catch (err){
      console.log(err)
    }
  }


    return ( 
        <Page>
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

