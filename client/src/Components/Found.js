import { useContext } from "react";
import { Context } from "../Context";
import styled from "styled-components";
import filter from "../Functions/filter";
import YouTubeVideoSection from "./YouTubeVideoSection";
import { FiHeart } from "react-icons/fi";

const Found = () => {

    const {allSpotifyTrackNames, spotifyAlbums, allDiscogsTrackNames, mongoUser} = useContext(Context)
    const uniqueSpotify = [...new Set(allSpotifyTrackNames)];
    const uniqueDiscogs = [...new Set(allDiscogsTrackNames)]

    const filteredSpotify = filter(uniqueSpotify)    
    const filteredDiscogs = filter(uniqueDiscogs)

    const compare = (array1, array2) => {
    
        const mergedFilteredArrays = array1.concat(array2)
        
        function findSingle(arr) {
        return arr.filter(i => arr.filter(j => i.toLowerCase() === j.toLowerCase()).length === 1)
        }
        const result = findSingle(mergedFilteredArrays)
        return result   
  }

  const gems = compare(uniqueSpotify,uniqueDiscogs)

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
            
            {gems.length > 0 && gems.map((gem, index) => {
                return <StyledGemContainer>
                <Gem key={index}>{gem}</Gem>
                <StyledHeartButton onClick={() => save(gem)}><FiHeart/></StyledHeartButton>
                </StyledGemContainer>
            }
            )
            }
            {gems.length > 0 && <div>
            <h1>Here's one we found on YouTube!</h1>
            <YouTubeVideoSection gems={gems}/>
            </div>
            }
            
            
            {/* <iframe width="560" height="315" src="https://www.youtube.com/embed/vrM2EGghhqM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            <iframe width="560" height="315" src="https://www.youtube.com/embed/YB2LivWtHfw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            <iframe width="560" height="315" src="https://www.youtube.com/embed/X0puqUVPxLs" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> */}
        </StyledContainer> );
}
 
export default Found;

const StyledContainer = styled.div`
padding: 20px;
margin: 10px 0;
border-radius: 10px;
padding: 20px 0; 
border: 1px solid black;
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
const Number = styled.h1`
color: red;
`

const CompareMessage = styled.div`
text-align: center
`

