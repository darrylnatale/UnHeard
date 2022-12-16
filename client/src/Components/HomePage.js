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

const getDiscogsReleases = (discogsArtistId, albumId, role) => {
      console.log("getDiscogsReleases fxn run!")
      console.log(discogsArtistId, albumId, role)
      fetch(`/getDiscogsReleases/`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({discogsArtistId, albumId, role}),
        }) 
            .then((res) => res.json())
            .then((data) => {
              console.log(data)
              
              const release = data.data
              
              const tracks = []

              if (release.role === "Main"){
                release.tracklist.forEach((tracklistItem) => {
                  if (tracklistItem.artists){
                    tracklistItem.artists.forEach((artist) => {
                      if (Number(artist.id) === Number(discogsArtistId)){
                        const renamedTracklistItem = Object.assign({}, tracklistItem, {trackName: tracklistItem.title})
                        delete renamedTracklistItem.title
                        renamedTracklistItem.availableOn = "discogs"
                        renamedTracklistItem.onAlbum = release
                        renamedTracklistItem.artists = [{name: artist.name}]
                        renamedTracklistItem.trackRole = "Main"
                        tracks.push(renamedTracklistItem)
                      } 
                    })
                    
                  } else {
                    const renamedTracklistItem = Object.assign({}, tracklistItem, {trackName: tracklistItem.title})
                        delete renamedTracklistItem.title
                        renamedTracklistItem.availableOn = "discogs"
                        renamedTracklistItem.onAlbum = release
                        renamedTracklistItem.artists = [{name: release.artistName}]
                        renamedTracklistItem.trackRole = "Main"
                        tracks.push(renamedTracklistItem)
                  }
                })
              }

              if (release.role === "TrackAppearance"){
                release.tracklist.forEach((tracklistItem) => {
                  if (tracklistItem.artists){
                    tracklistItem.artists.forEach((artist) => {
                      if (Number(artist.id) === Number(discogsArtistId)){
                        const renamedTracklistItem = Object.assign({}, tracklistItem, {trackName: tracklistItem.title})
                        delete renamedTracklistItem.title          
                        renamedTracklistItem.availableOn = "discogs"
                        renamedTracklistItem.onAlbum = release
                        renamedTracklistItem.artists = [{name: artist.name}]
                        renamedTracklistItem.trackRole = "Main"
                        tracks.push(renamedTracklistItem)
                      }
                    })
                  } 
                })
              }

              if (release.role === "Appearance"){
                release.tracklist.forEach((tracklistItem) => {
                  if (tracklistItem.extraartists){
                    tracklistItem.extraartists.forEach((extraartist) => {
                      if (Number(extraartist.id) === Number(discogsArtistId)){
                          const renamedTracklistItem = Object.assign({}, tracklistItem, {trackName: tracklistItem.title})
                              delete renamedTracklistItem.title
                              renamedTracklistItem.availableOn = "discogs"
                              renamedTracklistItem.onAlbum = release
                              renamedTracklistItem.trackRole = extraartist.role
                              renamedTracklistItem.artists = [{name: release.artistName + " & " + extraartist.name + ` (${renamedTracklistItem.trackRole})`}]
                              tracks.push(renamedTracklistItem)
                      }
                    })
                  } 
                })
              }

              if (release.role === "UnofficialRelease"){
                release.tracklist.forEach((tracklistItem) => {
                  if (tracklistItem.artists){
                    console.log("tracklistitem.artists exists")
                    tracklistItem.artists.forEach((artist) => {
                      if (Number(artist.id) === Number(discogsArtistId)){
                        console.log("match")
                        const renamedTracklistItem = Object.assign({}, tracklistItem, {trackName: tracklistItem.title})
                        delete renamedTracklistItem.title
                        renamedTracklistItem.availableOn = "discogs"
                        renamedTracklistItem.onAlbum = release
                        renamedTracklistItem.artists = [{name: artist.name}]
                        renamedTracklistItem.trackRole = "Main"
                        tracks.push(renamedTracklistItem)
                      } else {
                        console.log("not a match")
                      }
                    })
                  } else {
                    const renamedTracklistItem = Object.assign({}, tracklistItem, {trackName: tracklistItem.title})
                        delete renamedTracklistItem.title
                        renamedTracklistItem.availableOn = "discogs"
                        renamedTracklistItem.onAlbum = release
                        renamedTracklistItem.artists = [{name: release.artistName}]
                        renamedTracklistItem.trackRole = "Main"
                        tracks.push(renamedTracklistItem)
                  }
                })
              }

              if (release.role === "Producer"){

                let artistMatchFound = false
                let foundInTrackList = true
                let trackRole = null

                release.artists.forEach((artist) => {
                  if (Number(artist.id) === Number(discogsArtistId)){
                    console.log("its an artist match")
                    artistMatchFound = true
                  } else {
                    console.log("its not an artist match")
                  }
                })

                if (artistMatchFound && release.extraartists){
                  release.extraartists.forEach((extraartist) => {
                    if (Number(extraartist.id) === Number(discogsArtistId)){
                      trackRole = extraartist.role
                    } 
                  })
                }

                if (artistMatchFound){
                  release.tracklist.forEach((tracklistItem) => {
                    const renamedTracklistItem = Object.assign({}, tracklistItem, {trackName: tracklistItem.title})
                        delete renamedTracklistItem.title
                        renamedTracklistItem.availableOn = "discogs"
                        renamedTracklistItem.onAlbum = release
                        renamedTracklistItem.artists = [{name: release.artistName}]
                        renamedTracklistItem.trackRole = trackRole
                        tracks.push(renamedTracklistItem)
                  })
                } 
                
                if (!artistMatchFound) {
                  release.tracklist.forEach((tracklistItem) => {
                    if (tracklistItem.artists){
                      tracklistItem.artists.forEach((artist) => {
                        if (Number(artist.id) === Number(discogsArtistId)){
                          console.log("match in tracklist - artists")
                          const renamedTracklistItem = Object.assign({}, tracklistItem, {trackName: tracklistItem.title})
                          delete renamedTracklistItem.title
                          renamedTracklistItem.availableOn = "discogs"
                          renamedTracklistItem.onAlbum = release
                          renamedTracklistItem.artists = tracklistItem.artists
                          if (tracklistItem.extraartists){
                            tracklistItem.extraartists.forEach((extraartist) => {
                              if (Number(artist.id) === Number(discogsArtistId)){
                                trackRole = extraartist.role
                              }
                            })
                          }
                          
                          renamedTracklistItem.trackRole = trackRole
                          tracks.push(renamedTracklistItem)
                        } else if (tracklistItem.extraartists){

                          console.log("NO match in tracklist - artists")
                          tracklistItem.extraartists.forEach((extraartist) => {
                            if (Number(extraartist.id) === Number(discogsArtistId)){
                              console.log("okk")
                              const renamedTracklistItem = Object.assign({}, tracklistItem, {trackName: tracklistItem.title})
                              delete renamedTracklistItem.title
                              renamedTracklistItem.availableOn = "discogs"
                              renamedTracklistItem.onAlbum = release
                              renamedTracklistItem.artists = tracklistItem.artists
                              renamedTracklistItem.trackRole = extraartist.role
                              tracks.push(renamedTracklistItem)
                            }
                          })
                        }
                      })
                    } else if (tracklistItem.extraartists){
                      tracklistItem.extraartists.forEach((extraartist) => {
                        if (Number(extraartist.id) === Number(discogsArtistId)){
                          console.log("okk")
                          const renamedTracklistItem = Object.assign({}, tracklistItem, {trackName: tracklistItem.title})
                          delete renamedTracklistItem.title
                          renamedTracklistItem.availableOn = "discogs"
                          renamedTracklistItem.onAlbum = release
                          renamedTracklistItem.artists = release.artists
                          renamedTracklistItem.trackRole = extraartist.role
                          tracks.push(renamedTracklistItem)
                        }
                      })
                      
                    } else {
                      foundInTrackList = false
                    }
                  })
                }

                if (!foundInTrackList && release.extraartists){
                        console.log("not found in tracklist, but release.extraartists exists")
                  release.extraartists.forEach((extraartist) => {
                    if (Number(extraartist.id) === Number(discogsArtistId)){
                        console.log("extraartist found")
                        console.log(extraartist.role)
                      if (extraartist.tracks){

                        console.log("extraartist.tracks exists")
                        console.log(extraartist.tracks)
                        release.tracklist.forEach((tracklistItem) => {
                          if (tracklistItem.position){
                            if (tracklistItem.position === extraartist.tracks){
                              const renamedTracklistItem = Object.assign({}, tracklistItem, {trackName: tracklistItem.title})
                              delete renamedTracklistItem.title
                              renamedTracklistItem.availableOn = "discogs"
                              renamedTracklistItem.onAlbum = release
                              renamedTracklistItem.artists = release.artists
                              renamedTracklistItem.trackRole = extraartist.role
                              tracks.push(renamedTracklistItem)
                            } else {
                              console.log("no")
                            }
                          }
                        })
                        
                      } else {
                        release.tracklist.forEach((tracklistItem) => {
                          const renamedTracklistItem = Object.assign({}, tracklistItem, {trackName: tracklistItem.title})
                          delete renamedTracklistItem.title
                          renamedTracklistItem.availableOn = "discogs"
                          renamedTracklistItem.onAlbum = release
                          renamedTracklistItem.artists = release.artists
                          renamedTracklistItem.trackRole = extraartist.role
                          tracks.push(renamedTracklistItem)
                        })
                        console.log("extraartist.tracks DNE")
                        // loop through tracklist anyway and put all on (might cause some bad results to show)

                      }
                    }
                  })
                }
                // if no match found, search extraartists for artist match
                // if extraaartist match found, add all tracks to array

              }

              
               
                  
                
                
                  
                
              


              setAllData(prevState => ({
                ...prevState,
                albums: [...prevState.albums, release],
                tracks: [...prevState.tracks, tracks]
              }))
              
              
            
             
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
        let discogsMastersMainReleaseIds = []

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
        const discogsReleasesAppearanceIds = []
  

  // combinedAlbums.forEach(async (album) => {
  //         if (album.availableOn === "discogs" && album.type === "release" && album.role === "Main"){
            
  //           discogsReleasesMainRoleIds.push(album.id)
  //         } else if (album.availableOn === "discogs" && album.type === "release" && album.role === "Appearance"){
  //           discogsReleasesAppearanceIds.push(album)
            
  //           // const renamedRelease = Object.assign({}, data, {albumName: data.title})
  
  //           //   setAllData(prevState => ({
  //           //     ...prevState,
  //           //     albums: [...prevState.albums, renamedRelease]
  //           //   }))

              

                
  //           //       renamedRelease.tracklist.forEach((tracklistItem) => {
  //           //         if (tracklistItem.extraartists) {
  //           //           tracklistItem.extraartists.forEach((extraartist) => {
                      
                      
  //           //           if (Number(extraartist.id) === Number(allData.discogsArtistId)){
  //           //             console.log("match")
  //           //             const artistName = renamedRelease.artists_sort
  //           //             const role = extraartist.role
  //           //             const extraArtistName = extraartist.name
  //           //             const renamedTrackListItem = Object.assign({}, tracklistItem, {trackName: tracklistItem.title})
  //           //             renamedTrackListItem.availableOn = "discogs"
  //           //             renamedTrackListItem.onAlbum = renamedRelease
  //           //             renamedTrackListItem.artists = [{name: artistName + role + extraArtistName}]
  //           //             delete renamedTrackListItem.title
                    
  //           //         setAllData(prevState => ({
  //           //           ...prevState,
  //           //           tracks: [...prevState.tracks, renamedTrackListItem]
  //           //         }))
  //           //       }
  //           //         })
  //           //       } 
                    
  //           //       })


          
  //         } 
  //         else if (album.availableOn === "discogs" && album.type === "release" && album.role === "TrackAppearance"){
  //           console.log("trackappearance", album)
  
            
  //           const renamedRelease = Object.assign({}, data, {albumName: data.title})
  //             renamedRelease.availableOn = "discogs"
  //             delete renamedRelease.title
  //             delete renamedRelease.status
  //             delete renamedRelease.stats
  //             delete renamedRelease.blocked_from_sale
  //             delete renamedRelease.community
  //             delete renamedRelease.companies
  //             delete renamedRelease.date_changed
  //             delete renamedRelease.estimated_weight
  //             delete renamedRelease.format_quantity
  //             delete renamedRelease.lowest_price
  //             delete renamedRelease.num_for_sale
  //             delete renamedRelease.series
  //             delete renamedRelease.data_quality
  //             delete renamedRelease.identifiers
  //             console.log(renamedRelease)
  //             setAllData(prevState => ({
  //               ...prevState,
  //               albums: [...prevState.albums, renamedRelease]
  //             }))

              

                
  //                 renamedRelease.tracklist.forEach((tracklistItem) => {
  //                   if (tracklistItem.artists) {
  //                     tracklistItem.artists.forEach((artist) => {
                      
                      
  //                     if (Number(artist.id) === Number(allData.discogsArtistId)){
  //                       console.log("match")
  //                       const artistName = artist.name
  //                       const renamedTrackListItem = Object.assign({}, tracklistItem, {trackName: tracklistItem.title})
  //                       renamedTrackListItem.availableOn = "discogs"
  //                       renamedTrackListItem.onAlbum = renamedRelease
  //                       renamedTrackListItem.artists = [{name: artistName}]
  //                       delete renamedTrackListItem.title
                    
  //                   setAllData(prevState => ({
  //                     ...prevState,
  //                     tracks: [...prevState.tracks, renamedTrackListItem]
  //                   }))
  //                 }
  //                   })
  //                 } 
                    
  //                 })


  //         } else if (album.availableOn === "discogs" && album.type === "release" && album.role === "Remix"){
  //           console.log("remix", album)
  //         }
  // })

  const discogsReleasesArray = []
    combinedAlbums.forEach((album) => {
      if (album.availableOn === "discogs" && album.type === "release"){
        discogsReleasesArray.push(album)
      }
    })

    startFetchingReleases(allData.discogsArtistId, discogsReleasesArray)
  }
}, [discogsMastersDone])

const startFetchingMasters = (discogsArtistId, discogsMastersArray) => {
  let index = 0
    
    
    const interval = setInterval(() => {
    
      
      getDiscogsMasters(discogsArtistId, discogsMastersArray[index], discogsMastersArray[index])   
                      console.log("masters index", index, discogsMastersArray.length)

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
        console.log("releases index",index, discogsReleasesArray.length)

        
        getDiscogsReleases(discogsArtistId, discogsReleasesArray[index].id, discogsReleasesArray[index].role)   
                        
  
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

