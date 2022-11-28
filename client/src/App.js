import {  useEffect, useState  } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components"

const App = () => {
  
const [albums, setAlbums] = useState()
const [artistSearchResults, setArtistSearchResults] = useState()
const [selectedArtist, setSelectedArtist] = useState()
const [spotifyAlbums, setSpotifyAlbums] = useState()
const [formData, setFormData] = useState()
const [allTracks, setAllSpotifyTracks] = useState()
const [submitted, setSubmitted] = useState(false)
const [seconds, setSeconds] = useState(0)
const [timedTracks, setTimedTracks] = useState([])

// const { artistSearched } = useParams();



useEffect(() => {
    fetch("/login")
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
    })
    .catch((err) => console.log(err));

    fetch("/authorize")
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
    })
    .catch((err) => console.log(err));
}, [])

// useEffect(() => {
//   const interval = setInterval(() => {
//     setSeconds(seconds => seconds + 1);
    
//      setTimedTracks([...timedTracks, allTracks[seconds]])
    
//   }, 1000);

//   return () => clearInterval(interval);
// }, [timedTracks]);




const handleChange = (value) => {
  setFormData(value);
  console.log(formData);
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
const getAllTracksFromAlbums = (artistId, artistName) => {
  fetch(`/getAllAlbums/${artistId}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({artistId, artistName}),
  }) 
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
      setSubmitted(false)
      setSelectedArtist(data.data.spotifyArtistName)
      setAllSpotifyTracks(data.data.spotifyTracks)
      setSpotifyAlbums(data.data.spotifyAlbums)
     })
     .catch((err) => console.log(err));
}
console.log(spotifyAlbums)
const unique = [...new Set(allTracks)];

const filterDuplicates = (allTracks) => {
  console.log("allTracks", allTracks.length)
  console.log("unique", unique.length)

  let filtered = []
  let remastered = []
  let radioEdit = []
  let liveVersion = []
  let remix = []
  
  unique.forEach((track) => {
      if (track.toLowerCase().includes("remaster")){
        remastered.push(track)
      } else {
        filtered.push(track)
        setAllSpotifyTracks(filtered)
      } 
      })
  

  unique.forEach((track) => {
      if (track.toLowerCase().includes("radio edit")){
        radioEdit.push(track)} 
      })

  unique.forEach((track) => {
      if (track.toLowerCase().includes("- live"  || "live at" )){
        console.log(track)
        liveVersion.push(track)} 
      })

  unique.forEach((track) => {
      if (track.toLowerCase().includes("remix")){
        remix.push(track)} 
      })

    console.log("remastered", remastered.length)
    console.log("radio edit", radioEdit.length)
    console.log("live", liveVersion.length)
    console.log("remix", remix.length)
    
    const concatenatedFilters = remastered.concat(radioEdit,liveVersion,remix)

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
      
      Unique(unique)
      


    
  }
  
  
  










  return (
    <Page>
      <form onSubmit={(e) => handleSubmit(e, formData)}>
      {seconds} seconds have elapsed since mounting.
      <SearchBar 
          type="search" 
          placeholder={"Search For An Artist"}
          onChange={(e) => handleChange(e.target.value)}/>
      <button type="submit">Search Artist</button>
      </form>
      <Results>
        {artistSearchResults && submitted ? 
        <div>
          <div>Artist Results</div>
          {artistSearchResults.map((artistSearchResult) => {
          return <ArtistContainer onClick={() => {getAllTracksFromAlbums(artistSearchResult.id, artistSearchResult.name)}
          }>
            {artistSearchResult.images[0] ? <Image src={artistSearchResult.images[0].url}/> : ""}        
            {artistSearchResult.name}
            </ArtistContainer>
        })}</div>
        : <>loading</>
        }

    {allTracks ? 
    <>
    <div>
      <h1>There are {allTracks.length} tracks by {selectedArtist} on Spotify</h1>
      <button onClick={() => {filterDuplicates(allTracks)}}>Filter Out Remastered</button>
      
      
      {/* {timedTracks ? 
      timedTracks.map((timedTrack) => {
        return <div>{timedTrack}</div>
      })
    : <></>
    } */}
      
      {unique.map((track, index) => {
      return <div>
        {track.name}
        </div>
    })}
    </div>
    <div>
    <h1>... and {spotifyAlbums.length} albums</h1>
    {spotifyAlbums.map((spotifyAlbum) => {
      return <div>
        <Image src={spotifyAlbum.images[0].url} />
        <div>{spotifyAlbum.name}</div>
        </div>
    })}
    </div>
    </>
    : <>loading</>
    }
    </Results>
    </Page>
  )
}




export default App;

const Page = styled.div`
margin: 0 50px;
`

const SearchBar = styled.input`
border: 1px solid black;
border-radius: 3px;
width: 500px;
height: 50px;
font-size: 30px;
margin: 100px 100px 100px 300px;
`
const Results = styled.div`
display: flex;`

const ArtistContainer = styled.button`
display: flex;
width: 400px;
border: 1 px solid lightblue;
margin: 5px;
padding: 5px;
`

const Image = styled.img`
width: 125px;
`