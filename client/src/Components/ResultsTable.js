import styled, {keyframes} from "styled-components";
import { Context } from "../Context";
import { useContext, useState, useEffect } from "react";
import filter from "../Functions/filter";
import smush from "../Functions/smush";
import smushString from "../Functions/smushString";
import React from "react";
import levenshteinDistance from "../Functions/levenshteinDistance";
import jaroWinklerDistance from "../Functions/jaroWinklerDistance";


const ResultsTable = () => {

    
    const {allData, setAllData} = useContext(Context)
    const combinedTracks = [].concat(...allData.tracks);
    const [option, setOption] = useState(combinedTracks)
    const [selectedButton, setSelectedButton] = useState(combinedTracks)
    const [youTubeResults, setYouTubeResults] = useState()
    const [src, setSrc] = useState()
    
    
    
    
    useEffect(() => {
      if (selectedButton === 'spellChecked') {
        setOption(spellChecked);
      } else if (selectedButton === 'filtered') {
        setOption(filtered);
      } else if (selectedButton === 'notOnSpotify'){
        setOption(notOnSpotify)
      } else if (selectedButton === "notOnSpotifyFiltered") {
        setOption(notOnSpotifyFiltered)
      } else (
        setOption(notOnSpotifyFiltered)
      )
    }, [allData, selectedButton]);

    

const smushed = smush(combinedTracks);

const result = [];
console.log(smushed)
console.log(result)

smushed.forEach((element, index) => {
  let found = false;
  result.forEach(group => {
    if (group[0] === element || levenshteinDistance(group[0], element) < 3) {
      group.push(index);
      found = true;
    }
  });
  if (!found) {
    result.push([element, index]);
  }
  
});

result.forEach((item) => item.shift())
console.log(result)

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


console.log(mergedTracks)

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




  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '7eaac4f35amshb2b47d7e7ccf339p1f9f9cjsn47889e84eb9c',
      'X-RapidAPI-Host': 'simple-youtube-search.p.rapidapi.com'
    }
  };
  
  async function getYouTubeResults(songTitle) {
    console.log(songTitle)
      const songQuery = allData.artistName + '%2B' + songTitle.replace(/ /g, '%2B')

      console.log(songQuery)
      try {
        const response = await fetch(`https://simple-youtube-search.p.rapidapi.com/search?query=${songQuery}&safesearch=false`, options);
        const data = await response.json();


        let found = data.results.find(result => smushString(result.title).includes(smushString(songTitle))) 

          console.log(smushString(result.title))
          console.log(smushString(songTitle))
          console.log(found)
        
        
        // setYouTubeResults([...(youTubeResults || []), data])
        console.log(found.url)
        setSrc(found.url)
        
      } catch (err) {
        console.error(err);
      }
    
  }




  if (allData.albums && allData.artistName){
    
  return (
    <>
    <Overview>
    <ButtonContainer>
        <ButtonIcon>{filtered.length > 0 ? <>found {filtered.length} track{filtered.length > 1 && <>s</> } total</> : <>searching</>} </ButtonIcon>
        <ButtonBorder /> 
    </ButtonContainer>

    <ButtonContainer>
        <ButtonIcon>{notOnSpotifyFiltered.length > 0 ? <>found {notOnSpotifyFiltered.length} track{notOnSpotifyFiltered.length > 1 && <>s</>} not available on Spotify</> : <>searching</>} </ButtonIcon>
        <ButtonBorder /> 
    </ButtonContainer>
    </Overview>


      
      
      
      
      
      <div>Here are some songs not available on Spotify:</div>


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
            <button onClick={() => getYouTubeResults(track)}>find song</button>
            
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
    {src ? <FrameWrapper>
      {src.split("?v=")[1]}
      
      <StyledIFrame
      width="560"
      height="315"
      src={`https://www.youtube.com/embed/${src.split("?v=")[1]}`}
      title="Youtube Player"
      frameBorder="0"
      allowFullScreen
      />
    </FrameWrapper> : <></>}
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

const Rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Overview = styled.div`
  display: flex;
  
`;

const ButtonContainer = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  margin: 0 100px;
`;

const ButtonIcon = styled.i`
  position: absolute;
  left: 50%;
  top: 50%;
  right: 0;
  bottom: 0;
  margin-left: -5px;
  margin-top: -5px;
`;

const ButtonBorder = styled.div`
  width: 200px;
  height: 200px;
  background: transparent;
  border-radius: 50%;
  border: 2px dashed #000;
  animation-name: ${Rotate};
  animation-duration: 10s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
`;

const FrameWrapper = styled.div `

--border-radius: 10px;
  position: relative;
  aspect-ratio: 16 / 9;
  
  border-radius: var(--border-radius);
  box-shadow: 0 0 6px rgb(0 0 0 / 50%);
  background-color: rgba(0, 0, 0, 0.3);
  overflow: auto;
`

const StyledIFrame = styled.iframe`

/* overflow: auto; */
    /* position: absolute; */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    clip-path: inset(0% 0% 0% 0% round var(--border-radius));
  
`
