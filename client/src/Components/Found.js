import { useContext } from "react";
import { Context } from "../Context";
import styled from "styled-components";
import filter from "../Functions/filter";
import YouTubeVideoSection from "./YouTubeVideoSection";
import { FiHeart } from "react-icons/fi";
import compare from "../Functions/compare";

const Found = () => {

    const {allSpotifyTrackNames, spotifyAlbums, allDiscogsTrackNames, mongoUser} = useContext(Context)
    
    const uniqueSpotify = [...new Set(allSpotifyTrackNames)];
    const uniqueDiscogs = [...new Set(allDiscogsTrackNames)]

    
    const filteredSpotify = filter(uniqueSpotify).sort()   
    const filteredDiscogs = filter(uniqueDiscogs).sort()

  //   const compare = (array1, array2) => {
    
  //       const mergedFilteredArrays = array1.concat(array2)
        
  //       function findSingle(arr) {
  //       return arr.filter(i => arr.filter(j => i.toLowerCase() === j.toLowerCase()).length === 1)
  //       }
  //       const result = findSingle(mergedFilteredArrays).sort()
  //       return result   
  // }

  


  const gems = compare(filteredSpotify,filteredDiscogs)

  let message = ""

  if (gems.length === 0){
    message = "Looks like Spotify has everything!"
  } else if (gems.length > 0){
    message = `We found ${gems.length} tracks not available on Spotify:`
  }

  const save = (songToSave) => {
    console.log(mongoUser)
  }

    return ( 
        <StyledContainer>
            
                <h1>{message}</h1>
            <TrackListContainer>
            {gems.length > 0 && gems.map((gem, index) => {
                return <StyledGemContainer key={index}>
                <Gem >{gem}</Gem>
                <StyledHeartButton onClick={() => save(gem)}><FiHeart/></StyledHeartButton>
                </StyledGemContainer>
            }
            )
            }
            </TrackListContainer>
            {gems.length > 0 && <div>
            <Message><h1><span>Here's one we found on YouTube!</span></h1></Message>
            <YouTubeVideoSection gems={gems}/>
            </div>
            }
            
            
            {/* <iframe width="560" height="315" src="https://www.youtube.com/embed/vrM2EGghhqM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            <iframe width="560" height="315" src="https://www.youtube.com/embed/YB2LivWtHfw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            <iframe width="560" height="315" src="https://www.youtube.com/embed/X0puqUVPxLs" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> */}
        </StyledContainer> );
}
 
export default Found;

const TrackListContainer = styled.div`
overflow: auto;
max-height: 500px;
border: 1px solid black;
border-radius: 20px;
`
const StyledContainer = styled.div`
padding: 20px;

margin: 10px 0;


padding: 20px 0; 

font-family: "Zen Dots", cursive;
text-align: center;
h1{ 
  font-size: 20px;
}
span{
  color: red;
  font-size: 30px;
}
`
const Gem = styled.p`
margin: 0 10px;
`

const StyledHeartButton = styled.button`

  font-family: "Zen Dots", cursive;
  display: flex;
  justify-content: center;
  align-items: center;
  
  font-size: 20px;

  background: none;
  
  
  border: none;
`
const StyledGemContainer = styled.div`
display: flex;
text-align: center;
flex-direction: row;
justify-content: center;
align-items: center;
line-height: 2;
margin-bottom: 10px;
`
const Message = styled.div`
padding: 15px;
`