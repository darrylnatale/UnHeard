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



// useEffect(() => {
// setOption(combinedTracks)
// }, [combinedTracks])

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
    <table>
      <thead>
        <tr>
          <th>Index No.</th>
          <th>Artist</th>
          <th>Tracks</th>
          <th>Appears On</th>
          <th>Available On</th>
          <th>Link</th>
        </tr>
      </thead>
      <tbody>
        {option.map((track, index) => (
          <tr key={index}>
            <td>{index}</td>
            <td>{track.artists && track.artists.map((artist) => <>{artist.name} </>)}</td>
            <td>{track.trackName}</td>
            <td>{combinedAlbums.find((album) => album.id === track.onAlbum || album.id === track.onAlbum.id).albumName}</td>   
            <td>{track.availableOn}</td>   
            <td>{track.availableOn === "discogs" && track.onAlbum.videos && track.onAlbum.videos.length > 0 ? <a href={track.onAlbum.videos[0].uri}>YouTube Link</a> : track.availableOn === "spotify" && <a href={track.external_urls.spotify}>Spotify Link</a>}</td>  
          </tr>
        ))}
      </tbody>
    </table>
    </>
  );
};
      

    };

export default ResultsTable;
