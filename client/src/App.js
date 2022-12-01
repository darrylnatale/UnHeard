import {  useEffect, useContext, useState  } from "react";
import styled from "styled-components"
import Searchbar from "./Components/Searchbar";
import { Context } from "./Context";
import ArtistButton from "./Components/ArtistButton";
import Found from "./Found";
import CrossReference from "./Components/CrossReference";

const App = () => {

  const c = (tolog) => {
    console.log(tolog)
  }

  const [index, setIndex] = useState(0)
  const [testTracks, setTestTracks] = useState()
  const [tempTracks, setTempTracks] = useState(["track 1","track 2","track 3","track 4","track 5","track 6","track 7","track 8","track 9","track 10","track 11","track 12","track 13","track 14","track 15","track 16","track 17","track 18","track 19","track 20","track 21","track 22","track 23"])
 

  const {
    answer,
    setAnswer,
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
    discogsArtistId, 
    setDiscogsArtistId } = useContext(Context);


useEffect(() => {
    fetch("/login")
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
    })
    .catch((err) => console.log(err));

}, [])






const checkIfInMongo = (discogsArtistId, discogsArtistName) => {

  setDiscogsArtistId(discogsArtistId)

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
        
        getAllContentFromSpotifyAndDiscogs(spotifyArtistId, artistName)

      } else {
        
        
        crossReference(submitted, formattedDiscogsArtistName)
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

const matchArtistIds = (spotifyArtistId, artistName) => {
  fetch(`/matchArtistIds`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({spotifyArtistId, artistName, discogsArtistId}),
  })
  .then((res) => res.json())
    .then((data) => {
      console.log(data)
     })
     .catch((err) => console.log(err));
}
const getAllContentFromSpotifyAndDiscogs = (spotifyArtistId, artistName) => {

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

  fetch(`/getDiscogsContent/`) 
      .then((res) => res.json())
      .then((data) => {
        console.log("content from discogs", data)
      setDiscogsAlbums(data.data.discogsAlbums)
      setDiscogsAlbumDetails(data.data.discogsAlbumDetails)
      setDiscogsVersions(data.data.discogsVersions)
    })
    .catch((err) => console.log(err));
}

const crossReference = (submitted, formattedDiscogsArtistName) => {
  
  
  fetch(`/searchSpotify/${formattedDiscogsArtistName}`) 
        .then((res) => res.json())
        .then((data) => {
          
            setSpotifySearchResults(data.data.body.artists.items)
            console.log(data.data.body.artists.items)
            

            let suggestedSpotifyArtists = []

            data.data.body.artists.items.forEach((item) => {
              
              if (item.name.toLowerCase() === formattedDiscogsArtistName.toLowerCase()){
                suggestedSpotifyArtists.push(item)
                setAnswer(suggestedSpotifyArtists)
                
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
        if (artistOnTrack.id === 3818000){
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
          if (artistOnTrack.id === 86857){
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

const showMore = (answer) => {
  if (answer === "yes"){
    setCorrectGuess((prev) => true)
  }
  else {
    setCorrectGuess((prev) => false)
  }
  
}


  
  
  const compare = () => {
    
    const both = uniqueSpotify.concat(uniqueDiscogs)
    function findSingle(arr) {
      return arr.filter(i => arr.filter(j => i.toLowerCase() === j.toLowerCase()).length === 1)
    }
    const result = findSingle(both)
    return result      
  }

  


// useEffect(() => {
//   let index2 = 0
//   let tracks2 = []
//   const interval = setInterval(() => {
    
//     setIndex(prevIndex => prevIndex + 1 )
//     index2++
  
//     if (index2 > tempTracks.length){
      
//       return clearInterval(interval)
//     }
//   }, 75)

// }, [])



  return (
    
    <Page>
      <Searchbar /> 
      
      {/* <Animation>
     {index > 1 && tempTracks.slice(0,index).map((testTrack) => {
        
          return <Track>{testTrack} </Track>
          
      })}
      </Animation> */}
      
      <Results>
        {discogsSearchResults.length && submitted ? 
          <div>
          <DiscogsSearchResults>
              {discogsSearchResults.map((discogsSearchResult, index) => {

                if (index < 10 && discogsSearchResult.images) {
                  return <ArtistButton 
                          key={index} 
                          fxn={() => {checkIfInMongo(discogsSearchResult.id, discogsSearchResult.name)}} 
                          thumb={discogsSearchResult.images ? discogsSearchResult.images[0].uri : ""} 
                          profile={discogsSearchResult.profile ? discogsSearchResult.profile : ""} 
                          name={discogsSearchResult.name}/>}
                          // onClick={() => {getAllContentFromSpotifyAndDiscogs(artistSearchResult.id, artistSearchResult.title)}}
                          })}
          </DiscogsSearchResults>
         </div>
        : <></>
        }


    {(spotifySearchResults && answer) && 
    <>
      <div>
        <div>
          <CrossReference />          
          <div>
            <button onClick={() => {matchArtistIds(spotifySearchResults[0].id, spotifySearchResults[0].name)}}>Yes</button>
            <button onClick={() => {showMore()}}>No</button>
          </div>
        </div>
        
      </div>
    </>
      }
    {discogsAlbums && allSpotifyTracks ? 
    <>
    <div>
      <h1>There are <Number>{uniqueSpotify.length}</Number> tracks by {selectedArtist} on Spotify</h1>
      {/* <button onClick={() => {filterDuplicates(allSpotifyTrackNames)}}>Filter Out Remastered</button> */}  
      {uniqueSpotify.map((track, index) => {
      return <div>
        {track}
        </div>
    })}
    </div>
    <div>
      
      <h1>... on <Number>{spotifyAlbums.length}</Number> albums</h1>
      {spotifyAlbums.map((spotifyAlbum) => {
      return <div>
        <Image src={spotifyAlbum.images[0].url} />
        <div>{spotifyAlbum.name}</div>
            </div>
            })}
    </div>
    </>
    : 
    <></>
    }
    {(discogsAlbums && allSpotifyTracks) && 
    <>
    <DiscogsTracksResults>
    <h1>There are <Number>{uniqueDiscogs.length}</Number> tracks by {selectedArtist} on Discogs</h1>
    <ul>
      {uniqueDiscogs.map((trackName) => {
        return <li>{trackName}</li>
        })
      }
    </ul>
    </DiscogsTracksResults>
    <DiscogsTracksResults>
    <ul>
    <h1>... on <Number>{discogsAlbums.length}</Number> albums</h1>
    {discogsAlbums.map((item,index) => {
      return <li>{item.artist} - {item.title}</li>  
    })}
    </ul>
    </DiscogsTracksResults>
    </>}
    </Results>
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
}
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
const Number = styled.h1`
color: red;
`
const Animation = styled.div`
display: flex;
flex-wrap: wrap;
font-size: 100px;
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
width: 125px;
`

