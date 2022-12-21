import styled from "styled-components";
import { Context } from "../Context";
import { useContext, useState, useEffect } from "react";
import filter from "../Functions/filter";
import smush from "../Functions/smush";
import findDuplicates from "../Functions/findDuplicates";



const ResultsTable = () => {

    
    const {allData, setAllData} = useContext(Context)
    const combinedAlbums = [].concat(...allData.albums);
    const combinedTracks = [].concat(...allData.tracks);
    const [option, setOption] = useState(combinedTracks)
    const [selectedButton, setSelectedButton] = useState(combinedTracks)

    console.log("alldata",allData)
    console.log("combinedalbums",combinedAlbums)
    console.log("combinedtracks",combinedTracks)
    
    useEffect(() => {
      if (selectedButton === 'combinedTracks') {
        setOption(spellChecked);
      } else if (selectedButton === 'spellChecked') {
        setOption(spellChecked);
      } else if (selectedButton === 'filtered') {
        setOption(filtered);
      } else (
        setOption(spellChecked)
      )
    }, [allData, selectedButton]);

    function sort(a, b) {
      if (a.trackName < b.trackName) {
        return -1;
      }
      if (a.trackName > b.trackName) {
        return 1;
      }
      return 0;
    }

    const sorted = () => {
      setAllData(prevState => ({
        ...prevState,
        tracks: combinedTracks.sort(sort)
      }))
    }



let mergedTracks = [];

for (let track of combinedTracks) {
  let found = false;
  for (let mergedTrack of mergedTracks) {
    if (mergedTrack.hasOwnProperty(track.trackName)) {
      mergedTrack[track.trackName].push(track);
      found = true;
      break;
    }
  }
  if (!found) {
    let obj = {};
    obj[track.trackName] = [track];
    mergedTracks.push(obj);
  }
}






const c = () => {

}


const smushed = smush(mergedTracks, "objects");

// List to hold the indexes of items that are the second or greater occurrence in the array
const indexes = [];

// Set to hold the items that have already been seen
const seen = new Set();

// Iterate over the array
smushed.forEach((item, i) => {
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
const spellChecked = mergedTracks.filter((_, i) => !indexes.includes(i));


const filtered = filter(mergedTracks)



console.log(option)





const oneTime = (tracks) => {
  // Create an empty object to store the unique track names
  let oneTime = {};

  // Loop through the array of tracks
  for (let i = 0; i < tracks.length; i++) {
    // Get the track name
    let trackName = tracks[i].trackName;

    // If the track name hasn't been seen before, add it to the unique tracks object
    if (!oneTime[trackName]) {
      oneTime[trackName] = 1;
    } else {
      oneTime[trackName] += 1 
    }
  }
  let y = []
  for (let trackName in oneTime){
    if (oneTime[trackName] <= 1){
      y.push(trackName)
    }
  }

  // Return the array of unique track names
  return y;
}


const x = oneTime(combinedTracks)

const smush2 = smush(x, "objects") 

const indexes2 = [];

// Set to hold the items that have already been seen
const seen2 = new Set();

// Iterate over the array
smush2.forEach((item, i) => {
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

const filterff = (array) => {

  const filters = ["Remaster", "Remaaster","- Live", "Dub", "(Live)", "Acoustic", "Alternate Take", "Outtake", "- Take", "Maxi", "Mix", "Version", "Remix", "Edit", "Dub Mix", "Live at", "Club Mix", "World Tour", "Vocal", `12"`, `7"`, "Instrumental"]
  const filteredSongs = array.filter((song) => {
      
      return filters.every(filter => !song.toLowerCase().includes(filter.toLowerCase()))
  }
      );

  return filteredSongs;
}
const filtered2 = filterff(spellChecked2)



  if (allData.albums && allData.artistName){
    
  return (
    <>
      <button onClick={() => sorted()}>sort a-z</button>
      <button onClick={() => {
        setOption(combinedTracks)
        setSelectedButton('combinedTracks')
      }
        }>combinedTracks</button>
      <button onClick={() => {
        setOption(spellChecked)
        setSelectedButton('spellChecked')
      }
      }>spellChecked</button>
      <button onClick={() => {
        setOption(filtered)
        setSelectedButton('filtered')
      }}>filtered</button>
      <div>{option.length} SHOWING FOUND (option)</div>
      <div>{combinedTracks.length} TRACKS FOUND (combinedTracks)</div>
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
        {option.map((item, index) => {
          let track = Object.keys(item)[0]
          return (
          
          <tr key={index}>
            <td>{index}</td>
            <td>{Object.values(item)[0]
                  .map((value) => value.artists.map((a) => a.name))
                  .flat()
                  .filter((value, index, self) => self.indexOf(value) === index)
                  .join(", ")}
            </td>
            <td>{track}</td>
            <td>
                {Object.values(item)[0]
                  .map((value) => value.onAlbum.albumName)
                  .filter((value, index, self) => self.indexOf(value) === index)
                  .join(", ")}
              </td>
            <td>{Object.values(item)[0].map((value) => value.availableOn).filter((value, index, self) => self.indexOf(value) === index).join(", ")}
            </td>   
            {/* <td>{item.availableOn === "discogs" && item.onAlbum.videos && item.onAlbum.videos.length > 0 ? <a href={item.onAlbum.videos[0].uri}>YouTube Link</a> : item.availableOn === "spotify" && <a href={item.external_urls.spotify}>Spotify Link</a>}</td>   */}
            {/* <td>{item.itemRole && <>item role: {item.itemRole}</>}</td>  */}
            {/* <td>{item.onAlbum ? <>album role: {item.onAlbum.role}</> : <>no role</>}</td>    */}
          </tr>
        )})}
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
