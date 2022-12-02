import {  useEffect, useContext, useState  } from "react";
import styled from "styled-components"
import Searchbar from "./Components/Searchbar";
import { Context } from "./Context";
import ArtistButton from "./Components/ArtistButton";
import Found from "./Found";
import ArtistVerification from "./Components/ArtistVerification";

const App = () => {
  
  
  const c = (tolog) => {
    console.log(tolog)
  }

  const [index, setIndex] = useState(0)
  const [testTracks, setTestTracks] = useState()
  const [tempTracks, setTempTracks] = useState(["track 1","track 2","track 3","track 4","track 5","track 6","track 7","track 8","track 9","track 10","track 11","track 12","track 13","track 14","track 15","track 16","track 17","track 18","track 19","track 20","track 21","track 22","track 23"])
 

  const {
    exactSpotifyNameMatch,
    setExactSpotifyNameMatch,
    albums,
    setAlbums,
    correctGuess,
    setCorrectGuess,
    discogsSearchResults,
    setDiscogsSearchResults,
    spotifySearchResults,
    setSpotifySearchResults,
    selectedArtist,
    setSelectedArtist,
    spotifyAlbums,
    setSpotifyAlbums,
    formData,
    setFormData,
    allSpotifyTracks,
    setAllSpotifyTracks,
    allSpotifyTrackNames,
    setAllSpotifyTrackNames,
    submitted,
    setSubmitted,
    seconds,
    setSeconds,
    timedTracks,
    setTimedTracks,
    allTracksFromBoth,
    setAllTracksFromBoth,
    discogsAlbums,
    setDiscogsAlbums,
    discogsAlbumDetails,
    setDiscogsAlbumDetails,
    discogsVersions,
    setDiscogsVersions,
    discogsTrackNames,
    setDiscogsTrackNames,
    discogsArtistIdState, 
    setDiscogsArtistIdState,
     } = useContext(Context);
     

useEffect(() => {
    fetch("/login")
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
    })
    .catch((err) => console.log(err));

}, [])






const checkIfInMongo = (discogsArtistId, discogsArtistName) => {
  
  let dd = discogsArtistId

  
  
  

  const formattedDiscogsArtistName = formatDiscogsArtistName(discogsArtistName)
  
  fetch(`/checkIfInMongo`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({discogsArtistId}),
  })
  .then((res) => res.json())
  .then((data) => {
    console.log(data)
    
      if (data.data){
        const spotifyArtistId = data.data.spotifyArtistId
        const artistName = data.data.artistName
        
        getAllContentFromSpotifyAndDiscogs(spotifyArtistId, artistName, discogsArtistId)

      } else {
        
        
        crossReference(submitted, formattedDiscogsArtistName, discogsArtistId)
      }
      
      
     })
  .catch((err) => console.log(err));  
}

const formatDiscogsArtistName = (discogsArtistName) => {
  

  const containsNumbers = (str) => {
    return /\d/.test(str);
  }

  if (
    (discogsArtistName.charAt(discogsArtistName.length-1) === ")") && 
    (containsNumbers(discogsArtistName.charAt(discogsArtistName.lastIndexOf(")")-1)))
    )
    {
    
   const lastIndexOfOpenParentheses = discogsArtistName.lastIndexOf("(")
  
   return discogsArtistName.slice(0,lastIndexOfOpenParentheses-1)
  } 
  return discogsArtistName
}




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
      setSubmitted(false)
      setSelectedArtist(data.data.spotifyArtistName)
      setAllSpotifyTracks(data.data.spotifyTracks)
      setAllSpotifyTrackNames(data.data.spotifyTracks.map((spotifyTrack) => spotifyTrack.name))
      setSpotifyAlbums(data.data.spotifyAlbums)
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
        
        
      setDiscogsAlbums(data.data.discogsAlbums)
      setDiscogsAlbumDetails(data.data.discogsAlbumDetails)
      setDiscogsVersions(data.data.discogsVersions)
    })
    .catch((err) => console.log(err));
}

const crossReference = (submitted, formattedDiscogsArtistName, discogsArtistId) => {
  
  
  fetch(`/searchSpotify/${formattedDiscogsArtistName}`) 
        .then((res) => res.json())
        .then((data) => {
          
            setSpotifySearchResults(data.data.body.artists.items)
            
            

            let suggestedSpotifyArtists = []

            data.data.body.artists.items.forEach((item) => {
              
              if (item.name.toLowerCase() === formattedDiscogsArtistName.toLowerCase()){
                suggestedSpotifyArtists.push(item)
                setExactSpotifyNameMatch(suggestedSpotifyArtists)
                
              }
            })
            
             
            
         })
         
         
         
         .catch((err) => console.log(err));
}

const discogsTrackNameArray = []

if(discogsAlbumDetails){
  discogsAlbumDetails.forEach((discogsAlbumDetail) => {
    discogsAlbumDetail.tracklist.forEach((track) => {
      if (track.artists){
      track.artists.forEach((artistOnTrack) => {
        
        if (artistOnTrack.id === discogsArtistIdState){
          discogsTrackNameArray.push(track.title)
        }
      })
        
    } else {
      discogsTrackNameArray.push(track.title)
    }
    })
  })
}

if(discogsVersions){
  discogsVersions.forEach((discogsVersion) => {
    discogsVersion.tracklist.forEach((track) => {
      if (track.artists){
        track.artists.forEach((artistOnTrack) => {
          
          if (artistOnTrack.id === discogsArtistIdState){
            discogsTrackNameArray.push(track.title)
          }
          })
    } else {
      discogsTrackNameArray.push(track.title)
    }
    })
  })
}

const uniqueSpotify = [...new Set(allSpotifyTrackNames)];
const uniqueDiscogs = [...new Set(discogsTrackNameArray)];




  
  
  const compare = () => {
    
    const both = uniqueSpotify.concat(uniqueDiscogs)
    function findSingle(arr) {
      return arr.filter(i => arr.filter(j => i.toLowerCase() === j.toLowerCase()).length === 1)
    }
    const result = findSingle(both)
    return result      
  }

  


useEffect(() => {
  let index2 = 0
  let tracks2 = []
  const interval = setInterval(() => {
    
    setIndex(prevIndex => prevIndex + 1 )
    index2++
  
    
    if (index2 > 3300){
      console.log(index2)
      return clearInterval(interval)
    }
  }, 40 )

}, [discogsAlbums])



  return (
    
    <Page>
      <Searchbar /> 
      
      
      
      
        {discogsSearchResults.length && submitted ? 
          <div>
          <DiscogsSearchResults>
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
          </DiscogsSearchResults>
         </div>
        : <></>
        }
  
    {(spotifySearchResults && exactSpotifyNameMatch) && 
      <div>
          <ArtistVerification getAllContentFromSpotifyAndDiscogs={ getAllContentFromSpotifyAndDiscogs } />        
      </div>
    }


    { allSpotifyTracks ? 
    <>
    <SpotifyResults>
      <h1>We found {allSpotifyTrackNames.length} tracks by {selectedArtist} on Spotify</h1>
      <Animation>
      {/* <button onClick={() => {filterDuplicates(allSpotifyTrackNames)}}>Filter Out Remastered</button> */}  
      {index > 1 && allSpotifyTrackNames.slice(0,index).map((testTrack) => {
        
        return <Track key={Math.floor(Math.random() * 16000000)}>{testTrack} </Track>
        
    })}
    </Animation>
    
    
    <div>
      
      <h1>... on {spotifyAlbums.length} albums</h1>
      <Album>
      {spotifyAlbums.map((spotifyAlbum) => {
      return <>
        <Image src={spotifyAlbum.images[0].url} key={Math.floor(Math.random() * 16000000)}/>
        {/* <div>{spotifyAlbum.name}</div> */}
        </>
            })}
            </Album>
    </div>
    </SpotifyResults>
    </>
    : 
    <></>
    }

    {(discogsAlbums && allSpotifyTracks) && 
    <>
    <SpotifyResults>
    <h1>There are <Number>{uniqueDiscogs.length}</Number> tracks by {selectedArtist} on Discogs</h1>
    
    <Animation>
    {index > 1 && uniqueDiscogs.slice(0,index).map((testTrack) => {
        
        return <Track>{testTrack} </Track>
        
    })}
</Animation>
      {/* {uniqueDiscogs.map((trackName) => {
        return <li>{trackName}</li>
        })
      } */}
    
    
    
    
    <h1>... on {discogsAlbums.length} albums</h1>
    <Album>
    {discogsAlbumDetails.map((item,index) => {
      
      return <div key={Math.floor(Math.random(index) * 160000000)}>
        {/* <div>{discogsAlbums.artist} - {item.title}</div> */}
        <Image src={item.images[0].uri} />
        </div>  
    })}
    </Album>
    
    </SpotifyResults>
    </>}

    
    <>
    



    {discogsAlbums ? 
    <Found />
  : <></>
  }
    </>
    </Page>
  )
}




export default App;

const Page = styled.div`
margin: 0 50px;
li{
  list-style: none;
}

h1 {
  margin-bottom: 50px;
  text-align: right;
}
`
const Album = styled.div`
display: flex;
flex-wrap: wrap;
`

const SpotifyResults = styled.div`

`
const DiscogsTracksResults = styled.div`
display: block;
text-align: center;
`
const DiscogsSearchResults = styled.div`
display: flex;
flex-wrap: wrap;
max-width: 1200px;
`
const Number = styled.p`
color: red;
`
const Animation = styled.div`
display: flex;
flex-wrap: wrap;
justify-content: space-between;
font-size: 10px;
`

const Track = styled.div`
margin: 0 10px;
`

const ResultsHeader = styled.div`
text-decoration: underline;
display: flex;
justify-content: space-around
`
const CompareMessage = styled.div`
text-align: center;

`
const Results = styled.div`
display: flex;
justify-content: space-between;
text-align: center;
`

const ArtistContainer = styled.button`
display: flex;
width: 200px;
border: 1 px solid lightblue;
margin: 5px;
padding: 5px;
`


const Image = styled.img`
width: 100px;
`

