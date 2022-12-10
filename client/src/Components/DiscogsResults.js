import styled from "styled-components";
import { Context } from "../Context";
import { useContext, useEffect } from "react";
import findDuplicates from "../Functions/findDuplicates";
import cleanUp from "../Functions/cleanUp";
import Albums from "./Albums";
import Tracks from "./Tracks";
import filter from "../Functions/filter";


const DiscogsResults = () => {

    const { animationIndex, setAnimationIndex, selectedArtist, allDiscogsTrackNames} = useContext(Context)
    const unique = [...new Set(allDiscogsTrackNames)];
    unique.sort()
      
    const cleanedUp = cleanUp(unique)
  
    const duplicateElements = findDuplicates(cleanedUp);

    const duplicateIndexes = (arr, el) => arr.reduce((acc, curr, i) => (curr === el ? [...acc, i] : acc), []);

    const indexesOfDuplicates = duplicateElements.map(dupEl => duplicateIndexes(cleanedUp, dupEl));
    const newArray = indexesOfDuplicates.flat();
    const indexes = new Set(newArray);
    const finalTrackArray = unique.filter((track, index) => !indexes.has(index));


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
      <>
      <StyledDiscogsResults>
            <div>
              <h1>Out of a total of <span>{finalTrackArray.length}</span> tracks :</h1>
            </div>
            <Animation>
                {animationIndex > 1 && finalTrackArray.slice(0,animationIndex).map((testTrack, index) => {
            
              return <Track key={index}>{testTrack} / </Track>
                })   
              }
            </Animation>
            
      </StyledDiscogsResults>

      </> : 
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



