import styled from "styled-components";
import { Context } from "../Context";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import filter from "../Functions/filter";
import cleanUp from "../Functions/cleanUp";
import findDuplicates from "../Functions/findDuplicates";
import { useEffect } from "react";


const ResultsTable = () => {

    
    const {allData, setAllData} = useContext(Context)
    const combinedAlbums = [].concat(...allData.albums);
    const combinedTracks = [].concat(...allData.tracks);
    const [option, setOption] = useState(combinedTracks)
    console.log("alldata",allData)
    console.log("combinedalbums",combinedAlbums)
    console.log("combinedtracks",combinedTracks)
    

    function compare(a, b) {
      if (a.trackName < b.trackName) {
        return -1;
      }
      if (a.trackName > b.trackName) {
        return 1;
      }
      return 0;
    }

    const compared = () => {
      setAllData(prevState => ({
        ...prevState,
        tracks: combinedTracks.sort(compare)
      }))
    }
    

let uniqueTracks = [...new Map(combinedTracks.map((item) => [item["trackName"], item])).values()]

const cleanedUp = cleanUp(uniqueTracks);

// List to hold the indexes of items that are the second or greater occurrence in the array
const indexes = [];

// Set to hold the items that have already been seen
const seen = new Set();

// Iterate over the array
cleanedUp.forEach((item, i) => {
  // If the item has already been seen, add its index to the list of indexes
  if (seen.has(item)) {
    indexes.push(i);
  }
  // Otherwise, add the item to the set of seen items
  else {
    seen.add(item);
  }
});




// Create a new array containing only the elements that are not being removed
const spellChecked = uniqueTracks.filter((_, i) => !indexes.includes(i));


const filtered = filter(spellChecked)





const oneTime = (tracks) => {
  // Create an empty object to store the unique track names
  var oneTime = {};

  // Loop through the array of tracks
  for (var i = 0; i < tracks.length; i++) {
    // Get the track name
    var trackName = tracks[i].trackName;

    // If the track name hasn't been seen before, add it to the unique tracks object
    if (!oneTime[trackName]) {
      oneTime[trackName] = 1;
    } else {
      oneTime[trackName] += 1 
    }
  }
  var y = []
  for (var trackName in oneTime){
    if (oneTime[trackName] <= 1){
y.push(trackName)
    }
  }

  // Return the array of unique track names
  return y;
}
var t = [  {trackName: "track1"},  {trackName: "track2"},  {trackName: "track3"},  {trackName: "track2"},  {trackName: "track3"},];

const x = oneTime(combinedTracks)

const cleanedUp2 = cleanUp(x) 
const indexes2 = [];

// Set to hold the items that have already been seen
const seen2 = new Set();

// Iterate over the array
cleanedUp2.forEach((item, i) => {
  // If the item has already been seen, add its index to the list of indexes
  if (seen2.has(item)) {
    indexes2.push(i);
  }
  // Otherwise, add the item to the set of seen items
  else {
    seen2.add(item);
  }
});

const spellChecked2 = x.filter((_, i) => !indexes2.includes(i));

const filterff = (uniqueTracks) => {

  const filters = ["Remaster", "Remaaster","- Live", "Dub", "(Live)", "Acoustic", "Alternate Take", "Outtake", "- Take", "Maxi", "Mix", "Version", "Remix", "Edit", "Dub Mix", "Live at", "Club Mix", "World Tour", "Vocal", `12"`, `7"`, "Instrumental"]
  const filteredSongs = uniqueTracks.filter((song) => {
      
      return filters.every(filter => !song.toLowerCase().includes(filter.toLowerCase()))
  }
      );

  return filteredSongs;
}
const filtered2 = filterff(spellChecked2)



  if (allData.albums && allData.artistName){
    
  return (
    <>

      <button onClick={() => compared()}>sort a-z</button>
      <button onClick={() => setOption(combinedTracks)}>combinedTracks</button>
      <button onClick={() => setOption(uniqueTracks)}>uniqueTracks</button>
      <button onClick={() => setOption(spellChecked)}>spellChecked</button>
      <button onClick={() => setOption(filtered)}>filtered</button>
      <div>{option.length} SHOWING FOUND (option)</div>
      <div>{combinedTracks.length} TRACKS FOUND (combinedTracks)</div>
      <div>{uniqueTracks.length} UNIQUE TRACKS FOUND (uniqueTracks)</div>
      <div>{spellChecked.length} SPELLCHECKED TRACKS FOUND (spellChecked)</div>
      <div>{filtered.length} AFTER FILTERED TRACKS FOUND (filtered)</div>
      <div>{filtered2.length} RAREST TRACKS FOUND (filtered2)</div>
    <StyledTable>
      <thead>
        <tr>
          <th>Index No.</th>
          <th>Artist</th>
          <th>Tracks</th>
          <th>Appears On</th>
          <th>Available On</th>
          <th>Link</th>
          <th>Track Role</th>
          <th>Album Role</th>
        </tr>
      </thead>
      <tbody>
        {option.map((track, index) => (
          <tr key={index}>
            <td>{index}</td>
            <td>{track.artists && track.artists.map((artist, index) => {
              if (index > 0){
                return <>{artist.name} & </>
              } else {
                return <> {artist.name}</>
              }
            })}</td>
            <td>{track.trackName}</td>
            <td>{combinedAlbums.find((album) => album.id === track.onAlbum || album.id === track.onAlbum.id).albumName}</td>   
            <td>{track.availableOn}</td>   
            <td>{track.availableOn === "discogs" && track.onAlbum.videos && track.onAlbum.videos.length > 0 ? <a href={track.onAlbum.videos[0].uri}>YouTube Link</a> : track.availableOn === "spotify" && <a href={track.external_urls.spotify}>Spotify Link</a>}</td>  
            <td>{track.trackRole && <>track role: {track.trackRole}</>}</td> 
            <td>{track.onAlbum ? <>album role: {track.onAlbum.role}</> : <>no role</>}</td>  
          </tr>
        ))}
      </tbody>
    </StyledTable>
    
    </>
  );
};
      

    };

export default ResultsTable;

const StyledTable = styled.table`

text-align: left;

td, th {
  padding: 10px 15px; 
  text-align: left;
}
`
