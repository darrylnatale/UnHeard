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

    
    
    console.log("combinedtracks",combinedTracks)
    
    useEffect(() => {
      if (selectedButton === 'combinedTracks') {
        setOption(spellChecked);
      } else if (selectedButton === 'sortedTracks') {
        setOption(sortedTracks);
      } else if (selectedButton === 'filtered') {
        setOption(filtered);
      } else if (selectedButton === 'notOnSpotify'){
        setOption(notOnSpotify)
      } else if (selectedButton === "notOnSpotifyFiltered") {
        setOption(notOnSpotifyFiltered)
      } else if (selectedButton === "onlyOnce") {
        setOption(onlyOnce)
      } else if (selectedButton === "onlyOnceFiltered") {
        setOption(onlyOnceFiltered)
      }else (
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

    const smushed = smush(combinedTracks);

    

    




const result = [];

smushed.forEach((element, index) => {
  let found = false;
  result.forEach(group => {
    if (group[0] === element) {
      group.push(index);
      found = true;
    }
  });
  if (!found) {
    result.push([element, index]);
  }
  
});
result.forEach((item) => item.shift())






    

let indexes = []




const mergedTracks = result.map(indexes => {
  // Get the tracks at the given indexes
  const tracks = indexes.map(index => combinedTracks[index]);

  // Create a count of the track names
  const trackNameCount = tracks.reduce((counts, track) => {
    const name = track.trackName;
    counts[name] = (counts[name] || 0) + 1;
    return counts;
  }, {});

  // Find the track name that appears the most frequently
  const mostFrequentTrackName = Object.keys(trackNameCount).reduce((a, b) => trackNameCount[a] > trackNameCount[b] ? a : b);

  // Return an object with the most frequent track name as the key and the tracks as the value
  return { [mostFrequentTrackName]: tracks };
});

const sortedTracks = mergedTracks.sort((a, b) => {
  // Get the track names
  const trackNameA = Object.keys(a)[0];
  const trackNameB = Object.keys(b)[0];

  // Get the frequency of the track names
  const frequencyA = a[trackNameA].length;
  const frequencyB = b[trackNameB].length;

  // Return a negative value if A appears less frequently than B, a positive value if A appears more frequently than B, or 0 if they appear the same number of times
  return frequencyA - frequencyB;
});



console.log(mergedTracks)






// Create a new array containing only the elements that are not being removed
const spellChecked = mergedTracks.filter((_, i) => !indexes.includes(i));


const filtered = filter(mergedTracks)





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




const notOnSpotify = spellChecked.filter(item => {
  // Destructure the key/value pair of the object
  const [, value] = Object.entries(item)[0];
  // Check if the value array contains an object with {availableOn: "spotify"}
  return !value.some(obj => obj.availableOn === "spotify");
});

const notOnSpotifyFiltered = filter(notOnSpotify)

console.log(notOnSpotifyFiltered)

const onlyOneOccurrence = (array) => {
  return array.filter(item => {
    // Destructure the key/value pair of the object
    const [, value] = Object.entries(item)[0];
    // Check if the length of the value array is less than or equal to 1
    return value.length <= 1;
  });
}
  const onlyOnce = onlyOneOccurrence(notOnSpotify)
  const onlyOnceFiltered = filter(onlyOnce)
console.log("onlyoneoccurence - notonspotify",onlyOneOccurrence(notOnSpotify))
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
        setOption(sortedTracks)
        setSelectedButton('sortedTracks')
      }
      }>spellChecked</button>
      <button onClick={() => {
        setOption(filtered)
        setSelectedButton('filtered')
      }}>filtered</button>
      <button onClick={() => {
        setOption(notOnSpotify)
        setSelectedButton('notOnSpotify')
      }}>not on Spotify</button>
      <button onClick={() => {
        setOption(notOnSpotifyFiltered)
        setSelectedButton('notOnSpotifyFiltered')
      }}>notOnSpotifyFiltered</button>
      <button onClick={() => {
        setOption(onlyOnce)
        setSelectedButton('onlyOnce')
      }}>onlyOnce</button>
      <button onClick={() => {
        setOption(onlyOnceFiltered)
        setSelectedButton('onlyOnceFiltered')
      }}>onlyOnceFiltered</button>
      <div>{option.length} SHOWING FOUND (option)</div>
      <div>{combinedTracks.length} TRACKS FOUND (combinedTracks)</div>
      <div>{spellChecked.length} SPELLCHECKED TRACKS FOUND (spellChecked)</div>
      <div>{filtered.length} AFTER FILTERED TRACKS FOUND (filtered)</div>
      <div>{notOnSpotify.length} NOT ON SPOTIFY TRACKS FOUND (notOnSpotify)</div>
      <div>{notOnSpotifyFiltered.length} NOT ON SPOTIFY FILTERED TRACKS FOUND (notOnSpotifyFiltered)</div>
      <div>{onlyOnce.length} ONLY ONCE TRACKS FOUND (ONLYONCE)</div>
      <div>{onlyOnceFiltered.length} ONLY ONCE FILTERED TRACKS FOUND (ONLYONCEFILTERED)</div>
    <StyledTable>
      <thead>
        <tr>
          <th>Index No.</th>
          <th>Artist</th>
          <th>Tracks</th>
          <th>Appears On</th>
          <th>Available On</th>
          <th>Link</th>
          <th>Album Role</th>
          <th>Track Role</th>
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
            <td>{
  Object.values(item)[0]
    .filter(value => value.availableOn && value.links[0]?.uri)
    .map(value => value.links[0]?.uri)
    .filter((value, index, self) => self.indexOf(value) === index)
    .join(", ")
}</td>
<td>{Object.values(item)[0]
                  .map((value) => value?.albumRole)
                  .flat()
                  .filter((value, index, self) => self.indexOf(value) === index)
                  .join(", ")}</td> 
<td>{Object.values(item)[0]
                  .map((value) => value?.trackRole)
                  .flat()
                  .filter((value, index, self) => self.indexOf(value) === index)
                  .join(", ")}</td>  
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
