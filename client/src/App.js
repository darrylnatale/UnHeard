import {  useEffect, useContext, useState  } from "react";
import styled from "styled-components"
import Searchbar from "./Components/Searchbar";
import { Context } from "./Context";
// import ArtistButton from "./Components/ArtistButton";
import Found from "./Components/Found";
import ArtistVerification from "./Components/ArtistVerification";
import SearchResults from "./Components/SearchResults";
import Header from "./Components/Header";
import Results from "./Components/Results";

const App = () => {
  
  
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
    setAllSpotifyTracks,
    allSpotifyTrackNames,
    setAllSpotifyTrackNames,
    setSubmitted,
    discogsData,
    setDiscogsData,
     } = useContext(Context);
     

useEffect(() => {
    fetch("/login")
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
    })
    .catch((err) => console.log(err));

}, [])






// const checkIfInMongo = (discogsArtistId, discogsArtistName) => {
  
//   let dd = discogsArtistId

  
  
  

//   const formattedDiscogsArtistName = formatDiscogsArtistName(discogsArtistName)
  
//   fetch(`/checkIfInMongo`, {
//     method: "POST",
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({discogsArtistId}),
//   })
//   .then((res) => res.json())
//   .then((data) => {
//     console.log(data)
    
//       if (data.data){
//         const spotifyArtistId = data.data.spotifyArtistId
//         const artistName = data.data.artistName
        
//         getAllContentFromSpotifyAndDiscogs(spotifyArtistId, artistName, discogsArtistId)

//       } else {
        
        
//         crossReference(submitted, formattedDiscogsArtistName, discogsArtistId)
//       }
      
      
//      })
//   .catch((err) => console.log(err));  
// }






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
      setAllSpotifyTracks(data.data.spotifyTracks)
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






const uniqueSpotify = [...new Set(allSpotifyTrackNames)];


  
  // const compare = () => {
    
  //   const both = uniqueSpotify.concat(uniqueDiscogs)
  //   function findSingle(arr) {
  //     return arr.filter(i => arr.filter(j => i.toLowerCase() === j.toLowerCase()).length === 1)
  //   }
  //   const result = findSingle(both)
  //   return result      
  // }

  
useEffect(() => {
  let index2 = 0
  let tracks2 = []
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
      <Header />
      <Searchbar /> 
      <SearchResults getAllContentFromSpotifyAndDiscogs={ getAllContentFromSpotifyAndDiscogs } />

      {(spotifySearchResults && exactSpotifyNameMatch) && 
      <ArtistVerification getAllContentFromSpotifyAndDiscogs={ getAllContentFromSpotifyAndDiscogs } />        
      }

  {discogsData && <Results />}

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














// PREVIOUS DISCOGS SEARCH RESULTS 

        // const StyledDiscogsSearchResults = styled.div`
        // display: flex;
        // flex-wrap: wrap;
        // max-width: 1200px;
        // align-items: center;
        // justify-content: center;
        // `


        {/* {discogsSearchResults.length && submitted ? 
                  <div>
                  <StyledDiscogsSearchResults>
                      {discogsSearchResults.map((discogsSearchResult, index) => {

                        if (discogsSearchResult) {
                          // console.log("discogs search result", discogsSearchResult)
                          return <ArtistButton 
                                  key={index} 
                                  checkIfInMongoHandler={() => {checkIfInMongo(discogsSearchResult.id, discogsSearchResult.name)}} 
                                  thumb={discogsSearchResult.images ? discogsSearchResult.images[0].uri : ""} 
                                  profile={discogsSearchResult.profile ? discogsSearchResult.profile : ""} 
                                  name={discogsSearchResult.name}
                                  discogsArtistId={discogsSearchResult.id}/>}
                                  // onClick={() => {getAllContentFromSpotifyAndDiscogs(artistSearchResult.id, artistSearchResult.title)}}
                                  })}
                  </StyledDiscogsSearchResults>
                </div>
                : <></>
                } */}

  // PREV FORMATDISCOGSARTISTNAME FXN

              // const formatDiscogsArtistName = (discogsArtistName) => {
              
              //   const containsNumbers = (str) => {
              //     return /\d/.test(str);
              //   }

              //   if (
              //     (discogsArtistName.charAt(discogsArtistName.length-1) === ")") && 
              //     (containsNumbers(discogsArtistName.charAt(discogsArtistName.lastIndexOf(")")-1)))
              //     )
              //     {
                  
              //    const lastIndexOfOpenParentheses = discogsArtistName.lastIndexOf("(")
                
              //    return discogsArtistName.slice(0,lastIndexOfOpenParentheses-1)
              //   } 
              //   return discogsArtistName
              // }


// PREV CROSSREFERENCE FXN

        // const crossReference = (submitted, formattedDiscogsArtistName, discogsArtistId) => {
          
        //   fetch(`/searchSpotify/${formattedDiscogsArtistName}`) 
        //         .then((res) => res.json())
        //         .then((data) => {
                  
        //             setSpotifySearchResults(data.data.body.artists.items)
                    
                    

        //             let suggestedSpotifyArtists = []

        //             data.data.body.artists.items.forEach((item) => {
                      
        //               if (item.name.toLowerCase() === formattedDiscogsArtistName.toLowerCase()){
        //                 suggestedSpotifyArtists.push(item)
        //                 setExactSpotifyNameMatch(suggestedSpotifyArtists)
                        
        //               }
        //             })
                    
                    
                    
        //          })
                
                
                
        //          .catch((err) => console.log(err));
        // }




              {/* {uniqueDiscogs.map((trackName) => {
        return <li>{trackName}</li>
        })
      } */}

    //   {discogsData && 
    //     <>
    //     <div>
    //     <h1>There are <Number>{uniqueDiscogs.length}</Number> tracks by {selectedArtist} on Discogs</h1>
        
    //     {/* <Animation>
    //     {index > 1 && uniqueDiscogs.slice(0,index).map((testTrack) => {
            
    //         return <Track>{testTrack} </Track>
            
    //     })}
    // </Animation> */}
    
        
        
        
        
    //     <h1>... on {discogsData.length} albums</h1>
    //     <Album>
    //     {discogsData.map((item,index) => {
          
    //       return <div key={Math.floor(Math.random(index) * 160000000)}>
    //         {/* <div>{discogsData.artist} - {item.title}</div> */}
    //         <Image src={item.images[0].uri} />
    //         </div>  
    //     })
    //     }
    //     </Album>
        
    //     </div>
    //     </>}