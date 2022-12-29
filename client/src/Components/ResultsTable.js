import styled from "styled-components";
import { Context } from "../Context";
import { useContext, useState, useEffect } from "react";
import filter from "../Functions/filter";
import smush from "../Functions/smush";
import smushString from "../Functions/smushString";
import React from "react";
import findDuplicates from "../Functions/findDuplicates";



const ResultsTable = () => {

    
    const {allData, setAllData} = useContext(Context)
    const combinedAlbums = [].concat(...allData.albums);
    const combinedTracks = [].concat(...allData.tracks);
    const [option, setOption] = useState(combinedTracks)
    const [selectedButton, setSelectedButton] = useState(combinedTracks)

    
    
    
    
    useEffect(() => {
      if (selectedButton === 'spellChecked') {
        setOption(spellChecked);
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
      } else if (selectedButton === "twice") {
        setOption(twice)
      } else if (selectedButton === "twiceFiltered") {
        setOption(twiceFiltered)
      } else (
        setOption(notOnSpotifyFiltered)
      )
    }, [allData, selectedButton]);

    

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










// Create a new array containing only the elements that are not being removed
const spellChecked = mergedTracks.filter((_, i) => !indexes.includes(i));


const filtered = filter(mergedTracks)


const notOnSpotify = spellChecked.filter(item => {
  // Destructure the key/value pair of the object
  const [, value] = Object.entries(item)[0];
  // Check if the value array contains an object with {availableOn: "spotify"}
  return !value.some(obj => obj.availableOn === "spotify");
});

const notOnSpotifyFiltered = filter(notOnSpotify)



const onlyOneOccurrence = (array) => {
  return array.filter(item => {
    // Destructure the key/value pair of the object
    const [, value] = Object.entries(item)[0];
    // Check if the length of the value array is less than or equal to 1
    return value.length <= 1;
  });
}

const twoOccurrences = (array) => {
  return array.filter(item => {
    // Destructure the key/value pair of the object
    const [, value] = Object.entries(item)[0];
    // Check if the length of the value array is less than or equal to 1
    return value.length === 2;
  });
}

  const onlyOnce = onlyOneOccurrence(notOnSpotify)
  const onlyOnceFiltered = filter(onlyOnce)
  const twice = twoOccurrences(notOnSpotify)
  const twiceFiltered = filter(twice)

  if (allData.albums && allData.artistName){
    
  return (
    <>
      <button onClick={() => {
        setOption(spellChecked)
        setSelectedButton('spellChecked')
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
      <button onClick={() => {
        setOption(twice)
        setSelectedButton('twice')
      }}>twice</button>
      <button onClick={() => {
        setOption(twiceFiltered)
        setSelectedButton('twiceFiltered')
      }}>twiceFiltered</button>
      <div>{option.length} SHOWING FOUND (option)</div>
      <div>{combinedTracks.length} TRACKS FOUND (combinedTracks)</div>
      <div>{spellChecked.length} SPELLCHECKED TRACKS FOUND (spellChecked)</div>
      <div>{filtered.length} AFTER FILTERED TRACKS FOUND (filtered)</div>
      <div>{notOnSpotify.length} NOT ON SPOTIFY TRACKS FOUND (notOnSpotify)</div>
      <div>{notOnSpotifyFiltered.length} NOT ON SPOTIFY FILTERED TRACKS FOUND (notOnSpotifyFiltered)</div>
      <div>{onlyOnce.length} ONLY ONCE TRACKS FOUND (ONLYONCE)</div>
      <div>{onlyOnceFiltered.length} ONLY ONCE FILTERED TRACKS FOUND (ONLYONCEFILTERED)</div>
      <div>{twice.length} TWICE TRACKS FOUND (twice)</div>
      <div>{twiceFiltered.length} TWICE FILTERED TRACKS FOUND (twiceFiltered)</div>
      <div>Here's a song you might not know:</div>


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
  {React.Children.toArray(
    Object.values(item)[0]
      .map((value) => {
        return (
          <div>- <a href={value.onAlbum.uri}>{value.onAlbum.albumName}</a></div>
        );
      })
      // .filter((value, index, self) => self.indexOf(value) === index)
  )}
</td>

            <td>{Object.values(item)[0].map((value) => value.availableOn).filter((value, index, self) => self.indexOf(value) === index).join(", ")}
            </td>   
            <td>
            {React.Children.toArray(
    Object.values(item)[0]
    .filter(value => value.availableOn && value.links[0]?.uri)
    .map(value => {
      if (smushString(value.links[0]?.trackName).includes(smushString(track))){
        return (
          <a href={value.links[0]?.uri}>{value.links[0]?.trackName}</a>
          )
      }
    })
      
  )}
              </td>
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
