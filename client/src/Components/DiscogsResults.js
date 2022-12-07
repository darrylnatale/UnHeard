import styled from "styled-components";
import { Context } from "../Context";
import { useContext, useEffect } from "react";
import Albums from "./Albums";
import Tracks from "./Tracks";
import filter from "../Functions/filter";

const DiscogsResults = () => {

    const { animationIndex, setAnimationIndex, discogsAlbums, discogsContent, setAllDiscogsTrackNames, selectedArtist, allDiscogsTrackNames} = useContext(Context)
    const unique = [...new Set(allDiscogsTrackNames)];
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
        
        setAnimationIndex(prevIndex => prevIndex + 1 )
        index2++      
        if (index2 > 3300){
          return clearInterval(interval)
        }
      }, 1000 )
    
    }, [])

    return ( <>
    { allDiscogsTrackNames ?
    <StyledDiscogsResults>
          <div>
            <h1>Out of a total of <span>{cleanedUp.length}</span> tracks :</h1>
          </div>
          <Animation>
              {animationIndex > 1 && cleanedUp.slice(0,animationIndex).map((testTrack, index) => {
           
            return <Track key={index}>{testTrack} / </Track>
              })   
            }
          </Animation>
          
    </StyledDiscogsResults> : 
    <>Searching The Rest of The Web... This Might Take Even Longer... </>
    }</>
    );
}
 
export default DiscogsResults;

const StyledDiscogsResults = styled.div`
margin: 10px 0;
padding: 20px 0; 
border: 1px solid black;
border-radius: 10px;
width: 100%;
min-height: 40%;
max-height: 40%;
max-width: 80%;
overflow:auto;
font-family: "Zen Dots", cursive;
h1{ 
  font-size: 18px;
}
span{
  color: red;
  font-size: 30px;
}

`
const Animation = styled.div`
  /* display: flex;
  flex-direction: row;
  flex-wrap: wrap; */
  min-height:80%;
  justify-content: center;
  align-items: center;
  font-size: 20px;
`

const Track = styled.div`
margin: 0 5px;
font-size: 18px;
`



