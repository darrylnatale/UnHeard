import { BsGem } from "react-icons/bs";
import styled from "styled-components"
import { useContext, useEffect, useState } from "react";
import Found from "./Found"
import { Context } from "../Context";
import ArtistVerification from "./ArtistVerification"
import smush from "../Functions/smush";
import SearchResults from "./SearchResults"
import { useAuth0 } from "@auth0/auth0-react";
import ResultsTable from "./ResultsTable";
import modifyTracklistItem from "../Functions/modifyTracklistItem";

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

const getDiscogsMasters = (discogsArtistId, albumId, albumOverview) => {
        console.log("getDiscogsMasters fxn run!")
        
        
        fetch(`/getDiscogsMasters/`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({discogsArtistId, albumId, albumOverview}),
          }) 
              .then((res) => res.json())
              .then((data) => {
                console.log(data)
                
              
                
                  const master = data.data.master                
                
                  const tracks = []
if (master.albumRole === "Main"){
  master.tracklist.forEach((tracklistItem) => {
                  
    const renamedTrackListItem = {
      trackName: tracklistItem.title,
      availableOn: "discogs",
      onAlbum: master,
      albumRole: master.albumRole,
      links: master.videos,
    };
    if (tracklistItem.type_ && tracklistItem.type_ === "heading") {
      console.log(tracklistItem.title);
    } else {
      let artists = [{name: master.artistName}];
      let trackRole = "Main";
      if (tracklistItem.artists) {
        tracklistItem.artists.forEach((artist) => {
          if (Number(artist.id) === Number(discogsArtistId)) {
            tracks.push({...renamedTrackListItem, artists, trackRole});
          }
        });
      } else if (tracklistItem.extraartists) {
        let found = false;
        tracklistItem.extraartists.forEach((extraartist) => {
          if (Number(extraartist.id) === Number(discogsArtistId)) {
            found = true;
            artists = [{name: tracklistItem.name}];
            trackRole = extraartist.role;
            tracks.push({...renamedTrackListItem, artists, trackRole});
          } 
        });
        if (!found && master.extraartists) {
          master.extraartists.forEach((extraartist) => {
            if (Number(extraartist.id) === Number(discogsArtistId)) {
              artists = [...master.artists, {name: extraartist.name}];
              trackRole = extraartist.role;
              tracks.push({...renamedTrackListItem, artists, trackRole});
            }
          });
        }
      } else {
        tracks.push({...renamedTrackListItem, artists, trackRole: "x "});
      }
    }
  });
}
                

                


                setAllData(prevState => ({
                  ...prevState,
                  albums: [...prevState.albums, master],
                  tracks: [...prevState.tracks, tracks]
                }))
                
                // get the versions details (loop through the pages if necessary)
              
               
            })
            .catch((err) => console.log(err));
    }

const getDiscogsReleases = (discogsArtistId, albumId, albumOverview) => {
      console.log("getDiscogsReleases fxn run!")
      
      fetch(`/getDiscogsReleases/`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({discogsArtistId, albumId, albumOverview}),
        }) 
            .then((res) => res.json())
            .then((data) => {
              console.log(data)
              
              const release = data.data;
              const tracks = [];
              console.log("release.albumRole",release.albumRole)

              switch (release.albumRole) {

                case "Main":
                  release.tracklist.forEach((tracklistItem) => {
                    if (tracklistItem.type_ && tracklistItem.type_ !== "heading") {
                      const modifiedTrack = modifyTracklistItem(tracklistItem, release, discogsArtistId);
                      if (tracklistItem.artists && Number(modifiedTrack.artists[0].id) !== Number(discogsArtistId)) {
                        // do nothing
                      } else {
                        tracks.push(modifiedTrack);
                      }
                    }
                  });
                  break;
              
                case "TrackAppearance":

                  // release.tracklist.forEach((tracklistItem) => {
                  //   tracklistItem?.artists.forEach((artist) => {
                  //     if (Number(artist.id) === Number(discogsArtistId)) {
                  //       const modifiedTrack = modifyTracklistItem(tracklistItem, release, discogsArtistId);
                  //       tracks.push(modifiedTrack)
                  //     }
                  //   });
                    
                  // });
                  break;

                  case "Appearance":
                    // release.tracklist.forEach((tracklistItem) => {
                    //   tracklistItem?.extraartists.forEach((extraartist) => {
                    //       if (Number(extraartist.id) === Number(discogsArtistId)){
                    //         const modifiedTrack = modifyTracklistItem(tracklistItem, release, discogsArtistId);  
                    //               tracks.push(modifiedTrack)
                    //       }
                    //     })
                    // });
                    break;
                  
                  case "UnofficialRelease":
                    // release.tracklist.forEach((tracklistItem) => {
                    //   if (tracklistItem?.type_ === "heading"){
    
                    //   } else if (tracklistItem.artists){
                    //     tracklistItem.artists.forEach((artist) => {
                    //       if (Number(artist.id) === Number(discogsArtistId)){
                    //         const modifiedTrack = modifyTracklistItem(tracklistItem, release, discogsArtistId)
                    //         tracks.push(modifiedTrack)
                    //       } 
                    //     })
                    //   } else {
                    //     const modifiedTrack = modifyTracklistItem(tracklistItem, release, discogsArtistId)
                    //         tracks.push(modifiedTrack)
                    //   }
                    // })
                    break;
                    case "Remix":
                      break;

                    case "Producer":
                      // SIMPLIFY THE BELOW LATER, TOO COMPLICATED NOW, BUT IT WORKS:

                // let foundInTrackList = true
                // let trackRole = null

                // release.artists.forEach((artist) => {
                //   if (Number(artist.id) === Number(discogsArtistId)){
                //     console.log("its an artist match")
                //     artistMatchFound = true

                //     release?.extraartists.forEach((extraartist) => {
                //       if (Number(extraartist.id) === Number(discogsArtistId)){
                //         trackRole = extraartist.role
                //       } 
                //     })

                //     release.tracklist.forEach((tracklistItem) => {
                //       const renamedTracklistItem = Object.assign({}, tracklistItem, {trackName: tracklistItem.title})
                //           delete renamedTracklistItem.title
                //           renamedTracklistItem.availableOn = "discogs"
                //           renamedTracklistItem.onAlbum = release
                //           renamedTracklistItem.links = release.videos
                //           renamedTracklistItem.artists = [{name: release.artistName}]
                //           renamedTracklistItem.trackRole = trackRole
                //           renamedTracklistItem.albumRole = release.albumRole
                //           tracks.push(renamedTracklistItem)
                //     })
                //             // IF ARTIST NOT FOUND IN ARTISTS
                //   } else {
                //     release.tracklist.forEach((tracklistItem) => {
                //       const renamedTracklistItem = Object.assign({}, tracklistItem, {trackName: tracklistItem.title})
                //       delete renamedTracklistItem.title
                //       renamedTracklistItem.availableOn = "discogs"
                //       renamedTracklistItem.onAlbum = release
                //       renamedTracklistItem.links = release.videos
                //       renamedTracklistItem.albumRole = release.albumRole
                //       // IF THERE ARE TRACKLIST ARTISTS
                //       if (tracklistItem.artists){
                //         tracklistItem.artists.forEach((artist) => {
                //           // CHECK IF ARTIST IS IN TRACKLIST ARTIST, ASSIGN ARTISTS
                //           if (Number(artist.id) === Number(discogsArtistId)){
                //             console.log("match in tracklist - artists")
                            
                //             renamedTracklistItem.artists = tracklistItem.artists
                //             // IF THERE ARE TRACKLIST EXTRA ARTISTS, ASSIGN TRACK ROLE 
                //             tracklistItem?.extraartists.forEach((extraartist) => {
                //                 if (Number(extraartist.id) === Number(discogsArtistId)){
                //                   trackRole = extraartist.role
                //                 }
                //               })
                            
                            
                //             renamedTracklistItem.trackRole = trackRole
                //             tracks.push(renamedTracklistItem)

                //             //IF ARTIST IS NOT IN ARTISTS, CHECK IF EXTRAARTISTS EXISTS
                //           } else if (tracklistItem.extraartists){
  
                            
                //             tracklistItem.extraartists.forEach((extraartist) => {

                            
                //               if (Number(extraartist.id) === Number(discogsArtistId)){
                //                 renamedTracklistItem.artists = tracklistItem.artists
                //                 renamedTracklistItem.trackRole = extraartist.role
                //                 tracks.push(renamedTracklistItem)
                //               }
                //             })
                //           }
                //         })
                //       } else if (tracklistItem.extraartists){
                //         tracklistItem.extraartists.forEach((extraartist) => {
                //           if (Number(extraartist.id) === Number(discogsArtistId)){
                //             renamedTracklistItem.artists = release.artists
                //             renamedTracklistItem.trackRole = extraartist.role
                //             tracks.push(renamedTracklistItem)
                //           }
                //         })
                        
                //       } else {
                //         foundInTrackList = false
                //       }
                //     })
                //   }
                // })

                

                
                
                

                // if (!foundInTrackList && release.extraartists){
                //         console.log("not found in tracklist, but release.extraartists exists")
                //   release.extraartists.forEach((extraartist) => {
                    
                //     if (Number(extraartist.id) === Number(discogsArtistId)){
                //         console.log("extraartist found")
                //         console.log(extraartist.role)
                //       if (extraartist.tracks){

                //         console.log("extraartist.tracks exists")
                //         console.log(extraartist.tracks)
                //         release.tracklist.forEach((tracklistItem) => {
                //           if (tracklistItem.position){
                //             if (tracklistItem.position === extraartist.tracks){
                //               const renamedTracklistItem = Object.assign({}, tracklistItem, {trackName: tracklistItem.title})
                //               delete renamedTracklistItem.title
                //               renamedTracklistItem.availableOn = "discogs"
                //               renamedTracklistItem.onAlbum = release
                //               renamedTracklistItem.links = release.videos
                //               renamedTracklistItem.artists = release.artists
                //               renamedTracklistItem.trackRole = extraartist.role
                //               renamedTracklistItem.albumRole = release.albumRole
                //               tracks.push(renamedTracklistItem)
                //             } else {
                //               console.log("no")
                //             }
                //           }
                //         })
                        
                //       } else {
                //         release.tracklist.forEach((tracklistItem) => {
                //           const renamedTracklistItem = Object.assign({}, tracklistItem, {trackName: tracklistItem.title})
                //           delete renamedTracklistItem.title
                //           renamedTracklistItem.availableOn = "discogs"
                //           renamedTracklistItem.onAlbum = release
                //           renamedTracklistItem.links = release.videos
                //           renamedTracklistItem.artists = release.artists
                //           renamedTracklistItem.trackRole = extraartist.role
                //           renamedTracklistItem.albumRole = release.albumRole
                //           tracks.push(renamedTracklistItem)
                //         })
                //         console.log("extraartist.tracks DNE")
                //         // loop through tracklist anyway and put all on (might cause some bad results to show)

                //       }
                //     }
                //   })
                // }
                // // if no match found, search extraartists for artist match
                // // if extraaartist match found, add all tracks to array
                break;

                default:
                    // do nothing
                break;
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
    getDiscogsArtistReleases(selectedArtist.discogsArtistId, 1)
  }
  },[isInMongo])

useEffect(() => {
  console.log("useeffect 1 ")
    
    if(allData.albums.length > 0){
      
      const combinedAlbums = [].concat(...allData.albums);

      const discogsAlbums = []
        
    combinedAlbums.forEach((album) => {
        album.availableOn === "discogs" && discogsAlbums.push(album)  
       })
       startFetching(allData.discogsArtistId, discogsAlbums)
    }
    },[discogsContentFetched])


const startFetching = (discogsArtistId, discogsAlbumsArray) => {
  let index = 0

    const interval = setInterval(() => {
      
      if (discogsAlbumsArray[index].type === "master"){
        getDiscogsMasters(discogsArtistId, discogsAlbumsArray[index].main_release, discogsAlbumsArray[index])   
        console.log("albums index - master", index, discogsAlbumsArray.length)
        
      } else {
        getDiscogsReleases(discogsArtistId, discogsAlbumsArray[index].id, discogsAlbumsArray[index])   
        console.log("albums index - release" , index, discogsAlbumsArray.length, discogsAlbumsArray[index].albumName)
        
      }
      

      if (index >= discogsAlbumsArray.length - 1){
        console.log("done")
        
        return clearInterval(interval)
      } else {
        index++
      }

    }, 3000 )

}

const getDiscogsArtistReleases = async (discogsArtistId, page) => {
    
    try {
      const response = await fetch(`/getDiscogsArtistReleases`, {
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

      setDiscogsContentFetched(true) 
      

      // if (data.data.pagination.urls.next){
        
        
      //   let nextPageUrl = data.data.pagination.urls.next
      
      //   for (let i = 0; i < pages - 1 ; i++){
          
      //     let nextPageResponse = await fetch(nextPageUrl)
      //     const data = await nextPageResponse.json();
          
      //     const renamedReleases = data.releases.map((release) => {
      //       const renamedData = Object.assign({},
      //         release, {albumName: release.title})
      //         renamedData.availableOn = "discogs"
      //         delete renamedData.title
      //         delete renamedData.status
      //         delete renamedData.stats
      //         delete renamedData.blocked_from_sale
      //         delete renamedData.community
      //         delete renamedData.companies
      //         delete renamedData.date_changed
      //         delete renamedData.estimated_weight
      //         delete renamedData.format_quantity
      //         delete renamedData.lowest_price
      //         delete renamedData.num_for_sale
      //         delete renamedData.series
      //         return renamedData
      //     })
          
      //     setAllData(prevState => ({
      //       ...prevState,
      //       albums: [...prevState.albums, renamedReleases]
      //     }))

      //     nextPageUrl = data.pagination.urls.next
          
          
      //    }
      // }
      
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
        
        {exactSpotifyNameMatch && <ArtistVerification getDiscogsMasters={getDiscogsMasters} getSpotifyContent={getSpotifyContent} getDiscogsArtistReleases={getDiscogsArtistReleases}/>}     
        {allData && <ResultsTable />}
        {/* 
        
        
        {isInMongo && <CompareButton onClick={showFoundSection}>Compare Results!</CompareButton>}
        {showFound && <Found/>}
        {releases && <Releases />} */}
        </Page>
    );
}
 
export default HomePage;

const Page = styled.div`
overflow: auto;
  font-family:Radio;
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

