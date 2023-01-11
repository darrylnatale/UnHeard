import { BsGem } from "react-icons/bs";
import styled, {keyframes} from "styled-components"
import { useContext, useEffect, useState } from "react";
import { Context } from "../Context";
import ArtistVerification from "./ArtistVerification"
import SearchResults from "./SearchResults"
import { useAuth0 } from "@auth0/auth0-react";
import ResultsTable from "./ResultsTable";
import modifyTracklistItem from "../Functions/modifyTracklistItem";

const HomePage = () => {
    const { isLoading, error, isAuthenticated, user } = useAuth0();
    const {
        selectedArtist, submitted, setMoreToFetch, discogsContentFetched, setDiscogsContentFetched, 
        exactSpotifyNameMatch, setSubmitted,allData, setAllData, setLastSearched, isInMongo,setAllSpotifyTrackNames, setMongoUser, spotifyContentFetched, setspotifyContentFetched
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
                    albums: [...prevState.albums, ...data.data.spotifyAlbums],
                    tracks: data.data.spotifyTracks
                  }));
                  
                  setspotifyContentFetched(true)
              }
           })
           .catch((err) => console.log(err));
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
          
          
    
          const renamedReleases = data.data.releases.map((release) => {
              
            const { title, status, stats, blocked_from_sale, community, companies, date_changed, estimated_weight, format_quantity, lowest_price, num_for_sale, series, ...rest } = release;
            const renamedRelease = {
              ...rest,
              albumName: title,
              availableOn: "discogs"
            };
              return renamedRelease
            })
    
          setAllData(prevState => ({
            ...prevState,
            discogsArtistId: discogsArtistId,
            discogsPages: data.data.pagination,
            albumOverviews: [...prevState.albumOverviews, ...renamedReleases],
          }))
          
          console.log("data.data.pagination",data.data.pagination)
    
            setDiscogsContentFetched(true)
          
        }
        catch (err){
          console.log(err)
        }
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
  console.log("useEffect run, (discogsContentFetched)")
  console.log(allData)
  
    if(discogsContentFetched && spotifyContentFetched){
      
      const albumOverviews = allData.albumOverviews
      
      const filteredAlbumOverviews = albumOverviews.filter((album, index, self) => 
      self.findIndex((a) => a.id === album.id) === index
      );
      
      
      const discogsAlbums = []
        
      filteredAlbumOverviews.forEach((albumOverview) => {
      
        albumOverview.role === "Main" && discogsAlbums.push(albumOverview) 
        
       })

       setAllData(prevState => ({
        ...prevState,
        albumOverviews: [],
        fetchedAlbumOverviews: [...prevState.albums, ...albumOverviews],
      }));
      
       startFetching(allData.discogsArtistId, discogsAlbums)
       
    } 
    },[discogsContentFetched, spotifyContentFetched])

useEffect(() => {
  console.log("allData.discogsPagesFetched changed")
  if (allData.discogsPagesFetched > 1){
  getDiscogsArtistReleases(selectedArtist.discogsArtistId, allData.discogsPagesFetched)
  }
},[allData.discogsPagesFetched])

const saveToMongo = (dataToSave) => {
  fetch(`/saveToMongo`, {
    method: "POST",
    headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    },
    body: JSON.stringify({dataToSave}),
    }) 
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
    })
}

const startFetching = (discogsArtistId, discogsAlbumsArray) => {
  let index = 0

    const interval = setInterval(() => {
      console.log(discogsAlbumsArray)
      if (discogsAlbumsArray[index].type === "master"){
        getDiscogsMasters(discogsArtistId, discogsAlbumsArray[index].main_release, discogsAlbumsArray[index])   
        console.log("albums index - master", index, "of", discogsAlbumsArray.length-1)
        
      } else {
        getDiscogsReleases(discogsArtistId, discogsAlbumsArray[index].id, discogsAlbumsArray[index])   
        console.log("albums index - release" , index, "of", discogsAlbumsArray.length-1)
      }
      

      if (index >= discogsAlbumsArray.length - 1){
        console.log("done batch")
        
        if (allData.discogsPages.pages > allData.discogsPagesFetched){
          console.log("more to fetch, adding one")
          console.log("allData.discogsPagesFetched",allData.discogsPagesFetched)

          setAllData(prevState => ({
            ...prevState,
            discogsPagesFetched: prevState.discogsPagesFetched + 1,
          }))
          
          console.log("allData.discogsPagesFetched",allData.discogsPagesFetched)
          setDiscogsContentFetched(false)
          setMoreToFetch(true)
        } else {
          console.log("no more to fetch, settdiscogscontentfetched to false")
          setDiscogsContentFetched(false)
        }
        
        return clearInterval(interval)
      } else {
        index++
      }

    }, 3000 )

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

