import {  useEffect, useState  } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components"

const App = () => {
  
const [albums, setAlbums] = useState()
const [artistSearchResults, setArtistSearchResults] = useState()
const [selectedArtist, setSelectedArtist] = useState()
const [spotifyAlbums, setSpotifyAlbums] = useState()
const [formData, setFormData] = useState()
const [allSpotifyTracks, setAllSpotifyTracks] = useState()
const [allSpotifyTrackNames, setAllSpotifyTrackNames] = useState()
const [submitted, setSubmitted] = useState(false)
const [seconds, setSeconds] = useState(0)
const [timedTracks, setTimedTracks] = useState([])
const [allTracksFromBoth, setAllTracksFromBoth] = useState()


const [discogsAlbums, setDiscogsAlbums] = useState()
const [discogsTracks, setDiscogsTracks] = useState()
const [discogsTrackNames, setDiscogsTrackNames] = useState()



useEffect(() => {
    fetch("/login")
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
    })
    .catch((err) => console.log(err));

    // fetch("/authorize")
    // .then((res) => res.json())
    // .then((data) => {
    //   console.log(data)
    // })
    // .catch((err) => console.log(err));
}, [])

// useEffect(() => {
//   const interval = setInterval(() => {
//     setSeconds(seconds => seconds + 1);
    
//      setTimedTracks([...timedTracks, allTracks[seconds]])
    
//   }, 1000);

//   return () => clearInterval(interval);
// }, [timedTracks]);


console.log("discogsAlbums", discogsAlbums)
console.log("discogsTracks", discogsTracks)

const handleChange = (value) => {
  setFormData(value);
  
};

const handleSubmit = (e, formData) => {
  e.preventDefault();
  
  fetch(`/searchArtist/${formData}`) 
  .then((res) => res.json())
  .then((data) => {
      setSubmitted(true)
      setArtistSearchResults(data.data.body.artists.items)
   })
   .catch((err) => console.log(err));
}

const getAllContentFromSpotifyAndDiscogs = (artistId, artistName) => {
  fetch(`/getSpotifyContent/${artistId}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({artistId, artistName}),
  }) 
    .then((res) => res.json())
    .then((data) => {
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
      setDiscogsAlbums(data.data.discogsAlbums)
      setDiscogsTracks(data.data.discogsTracks)
      
      
    })
    .catch((err) => console.log(err));
}

const discogsTrackNameArray = []

if(discogsTracks){
  discogsTracks.forEach((discogsTrack) => {
    discogsTrack.tracklist.forEach((track) => {
      if (track.artists){
      track.artists.forEach((artistOnTrack) => {
        if (artistOnTrack.id === 144193){
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


const filterDuplicates = (allSpotifyTracks) => {
  

  let filtered = []
  let remastered = []
  let radioEdit = []
  let liveVersion = []
  let remix = []
  
  // uniqueSpotify.forEach((track) => {
  //     if (track.toLowerCase().includes("remaster")){
  //       remastered.push(track)
  //     } else {
  //       filtered.push(track)
  //       setAllSpotifyTracks(filtered)
  //     } 
  //     })
  

  // uniqueSpotify.forEach((track) => {
  //     if (track.toLowerCase().includes("radio edit")){
  //       radioEdit.push(track)} 
  //     })

  // uniqueSpotify.forEach((track) => {
  //     if (track.toLowerCase().includes("- live"  || "live at" )){
  //       console.log(track)
  //       liveVersion.push(track)} 
  //     })

  // uniqueSpotify.forEach((track) => {
  //     if (track.toLowerCase().includes("remix")){
  //       remix.push(track)} 
  //     })

    // console.log("remastered", remastered.length)
    // console.log("radio edit", radioEdit.length)
    // console.log("live", liveVersion.length)
    // console.log("remix", remix.length)
    
    // const concatenatedFilters = remastered.concat(radioEdit,liveVersion,remix)

    function Unique(array) {
      var tmp = [];
      var result = [];
      
      if (array !== undefined /* any additional error checking */ ) {
        for (var i = 0; i < array.length; i++) {
          var val = array[i];
      
          if (tmp[val] === undefined) {
             tmp[val] = true;
             result.push(val);
           }
      
          }
        }
      
        return result;
      }
      
      Unique(uniqueSpotify)
      
setAllSpotifyTrackNames(uniqueSpotify)

    
  }
  
  
  const compare = () => {
    
    const both = uniqueSpotify.concat(uniqueDiscogs)

    
    function findSingle(arr) {
      return arr.filter(i => arr.filter(j => i.toLowerCase() === j.toLowerCase()).length === 1)
    }
    
    const result = findSingle(both)

return result      

  }
  










  return (
    <Page>
      
      
      <form onSubmit={(e) => handleSubmit(e, formData)}>
      {seconds} seconds have elapsed since mounting.
      <SearchBar 
          type="search" 
          placeholder={"Search For An Artist"}
          onChange={(e) => handleChange(e.target.value)}/>
      </form>
      <ResultsHeader>
      <div>SPOTIFY RESULTS</div>
      <div>DISCOGS RESULTS</div>
      </ResultsHeader>
      <Results>
        {artistSearchResults && submitted ? 
        <div>
          <div>Artist Results</div>
          {artistSearchResults.map((artistSearchResult, index) => {
          return <ArtistContainer key={index} onClick={() => {getAllContentFromSpotifyAndDiscogs(artistSearchResult.id, artistSearchResult.name)}
          }>
            {artistSearchResult.images[0] ? <Image src={artistSearchResult.images[0].url}/> : ""}        
            {artistSearchResult.name}
            </ArtistContainer>
        })}</div>
        : <></>
        }

    {allSpotifyTrackNames ? 
    <>
    <div>
      <h1>There are {uniqueSpotify.length} tracks by {selectedArtist} on Spotify</h1>
      <button onClick={() => {filterDuplicates(allSpotifyTrackNames)}}>Filter Out Remastered</button>
      
      
      {/* {timedTracks ? 
      timedTracks.map((timedTrack) => {
        return <div>{timedTrack}</div>
      })
    : <></>
    } */}
      
      {uniqueSpotify.map((track, index) => {
      return <div>
        {track}
        </div>
    })}
    </div>
    <div>
      
      <h1>... on {spotifyAlbums.length} albums</h1>
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
    {discogsAlbums && 
    <>
    <DiscogsResults>
    <h1>There are {uniqueDiscogs.length} tracks by {selectedArtist} on Discogs</h1>
    <ul>
      {uniqueDiscogs.map((trackName) => {
        return <li>{trackName}</li>
        })
      }
    </ul>
    </DiscogsResults>
    <ul>
    <h1>... on {discogsAlbums.length} albums</h1>
    {discogsAlbums.map((item) => {
      return <li>{item.artist} - {item.title}</li>  
    })}
    </ul>
    </>}
    </Results>
    <>
    {discogsAlbums ? 
    <>
    <h1>Let's Compare</h1>
    
    
    
    <div>There are {compare().length} tracks not on Spotify:</div>
    <div>{compare()} </div>
    <div>But we found it on YouTube</div>
    <iframe width="560" height="315" src="https://www.youtube.com/embed/vrM2EGghhqM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </>
  : <></>}
    </>
    </Page>
  )
}




export default App;

const Page = styled.div`
margin: 0 50px;

h1 {
  margin-bottom: 50px;
}
`

const SearchBar = styled.input`
border: 1px solid black;
border-radius: 3px;
width: 500px;
height: 50px;
font-size: 30px;
margin: 100px 100px 100px 300px;
`
const DiscogsResults = styled.div`
display: block;
`
const ResultsHeader = styled.div`
text-decoration: underline;
display: flex;
justify-content: space-around
`

const Results = styled.div`
display: flex;
justify-content: space-between
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