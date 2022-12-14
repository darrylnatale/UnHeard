import styled from "styled-components";
import { Context } from "../Context";
import { useContext } from "react";
import { Link } from "react-router-dom";
import filter from "../Functions/filter";
import cleanUp from "../Functions/cleanUp";
import findDuplicates from "../Functions/findDuplicates";

const ResultsTable = () => {
  console.log("resultstableloaded")
    const {allData, setAllData} = useContext(Context)
    console.log("alldata",allData)
    const combinedAlbums = [].concat(...allData.albums);
    const combinedTracks = [].concat(...allData.tracks);
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
      console.log("click")
      setAllData(prevState => ({
        ...prevState,
        tracks: combinedTracks.sort(compare)
      }))
    }
    

let uniqueObjArray = [...new Map(combinedTracks.map((item) => [item["trackName"], item])).values()]

const cleanedUp = cleanUp(uniqueObjArray);

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

// Print the list of indexes
console.log(indexes);
// Array to be modified





// Create a new array containing only the elements that are not being removed
const newArr = uniqueObjArray.filter((_, i) => !indexes.includes(i));

// Print the new array
console.log(newArr); // [1, 3, 5]
console.log("combined",combinedTracks.length)
console.log("unique",uniqueObjArray.length)
console.log("newarr",newArr.length)
const filtered = filter(newArr)
console.log("filtered",filtered.length)




  if (allData.albums && allData.artistName){
    
  return (
    <table>
      <thead>
        <tr>
          <th>Tracks<button onClick={() => compared()}>filter</button></th>
          <th>Appears On</th>
          <th>Link</th>
          <th>YouTube Link</th>
        </tr>
      </thead>
      <tbody>
        {filtered.map((track, index) => (
          <tr key={index}>
            <td>{track.trackName}</td>
            <td>{combinedAlbums.find((album) => album.id === track.onAlbum || album.id === track.onAlbum.id).albumName}</td>   
            <td>{track.availableOn === "spotify" && <a href={track.external_urls.spotify}>Spotify Link</a>}</td>  
            <td>{(track.availableOn === "discogs" && track.onAlbum.videos && track.onAlbum.videos.length > 0) ? <a href={track.onAlbum.videos[0].uri}>YouTube Link</a> : <>no</>}</td>   
          </tr>
        ))}
      </tbody>
    </table>
  );
};
      

    };

export default ResultsTable;
