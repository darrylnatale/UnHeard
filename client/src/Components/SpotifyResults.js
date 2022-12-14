import styled from "styled-components";
import { Context } from "../Context";
import { useContext , useEffect} from "react";
import Tracks from "./Tracks";
import filter from "../Functions/filter";

const SpotifyResults = () => {

    const { timerIndex, setTimerIndex, allSpotifyTrackNames, spotifyAlbums, spotifyContent, setAllSpotifyTrackNames, selectedArtist} = useContext(Context)
    const unique = [...new Set(allSpotifyTrackNames)];
    unique.sort()

    const cleanUp = (array) => {
    
      const tempWords = []
      
        array.forEach((item) => {      
          const split = item.split("")
          
          const tempString = []
          
          split.forEach((char, index) => {
              if ((char === " ") || (char === "-") || (char === "(") || (char === ")" )){
                  
              } else {
              tempString.push(char)
              }
          })
          
          const joined = tempString.join()
          
          tempWords.push(joined) 
        })
          
        return tempWords
        
      }
      
const x = cleanUp(unique)
  
const findDuplicates = x => x.filter((item, index) => x.indexOf(item) !== index)
const duplicateElements = findDuplicates(x);

const duplicateIndexes = (arr, el) => {

  let duplicate = [];
  for (let i = 0; i < arr.length; i++){
      if (arr[i] == el){
          duplicate.push(i)
      } 
  }
  return duplicate
}

const indexesOfDuplicates = []

duplicateElements.forEach((duplicateElement) => {
    let indexesArray = duplicateIndexes(x, duplicateElement)
    indexesOfDuplicates.push(indexesArray)
})

for (let i = 0; i< indexesOfDuplicates.length ; i++){
  indexesOfDuplicates[i].shift()
}

let array = []
indexesOfDuplicates.forEach((indexArray) => {
    
    indexArray.forEach((index) => {
        array.push(index)
    })
})
const newArray = [...new Set(array)];

const indexes = new Set(newArray); // Faster lookups

const cleanedUp = unique.filter((_, i) => !indexes.has(i));



    

    useEffect(() => {
      let index2 = 0
      const interval = setInterval(() => {
        
        setTimerIndex(prevIndex => prevIndex + 1 )
        index2++      
        if (index2 > cleanedUp.length){
          return clearInterval(interval)
        }
      }, 10 )
    
    }, [])

    let message = ""

    


    return ( <>
        { allSpotifyTrackNames ?
          <StyledSpotifyResults>
            
            <div>
            <h1>We found <span>{cleanedUp.length}</span> tracks by {selectedArtist.artistName} on Spotify...</h1></div>
            
            <Animation>
            
        {timerIndex > 1 && cleanedUp.slice(0,timerIndex).map((testTrack, index) => {
           
            return <Track key={index}>{testTrack} / </Track>
           
        })}

    </Animation>
    
        </StyledSpotifyResults>
        : <>LOADING</>}
         </>);
}
 
export default SpotifyResults;

const StyledSpotifyResults = styled.div`
margin: 10px 0;
border-radius: 10px;
padding: 20px 0; 
border: 1px solid black;
width: 100%;
min-height: 40%;
max-height: 40%;
max-width: 80%;
overflow:auto;


h1{ 
  font-size: 18px;
}
span{
  color: red;
  font-size: 30px;
}

`
const Animation = styled.div`
margin: 10px 0; 
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  min-height:80%;
  justify-content: center;
  align-items: center;
  font-size: 20px;
`;

const Track = styled.p`
  margin: 0 10px 0 5px;
font-size: 18px;

`;

const Row = styled.div`
  width: auto;
`;

const Album = styled.div`
  display: flex;
  flex-wrap: wrap;
`;