import { Context } from "../Context";
import { useContext , useEffect, useState} from "react";
import Video from "./Video";
import styled from "styled-components";

const YouTubeVideoSection = ({gems}) => {
  const {selectedArtist} = useContext(Context)
  const [youTubeResults, setYouTubeResults] = useState()
  const [src, setSrc] = useState()

    useEffect(() => {

      const songQuery = selectedArtist.artistName + '%2B' + gems[0].replace(/ /g, '%2B')
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': '7eaac4f35amshb2b47d7e7ccf339p1f9f9cjsn47889e84eb9c',
          'X-RapidAPI-Host': 'simple-youtube-search.p.rapidapi.com'
        }
      };
      
      fetch(`https://simple-youtube-search.p.rapidapi.com/search?query=${songQuery}&safesearch=false`, options)
        .then(response => response.json())
        .then(data => {
          console.log(data)
          console.log(songQuery)
          setYouTubeResults(data)
          setSrc(data.results[1].id)
        })
        .catch(err => console.error(err));
    },[])
    
    
    return ( <>
    
    {src && 
    <FrameWrapper>
      
      
      <StyledIFrame
      width="560"
      height="315"
      src={`https://www.youtube.com/embed/${src}`}
      title="Youtube Player"
      frameBorder="0"
      allowFullScreen
      />
    </FrameWrapper>
  }
    </>);
}
 
export default YouTubeVideoSection;

const FrameWrapper = styled.div `
font-family: "Zen Dots", cursive;
--border-radius: 10px;
  position: relative;
  aspect-ratio: 16 / 9;
  
  border-radius: var(--border-radius);
  box-shadow: 0 0 6px rgb(0 0 0 / 50%);
  background-color: rgba(0, 0, 0, 0.3);
  
`

const StyledIFrame = styled.iframe`
font-family: "Zen Dots", cursive;
    /* position: absolute; */
    top: 0;
    left: 0;
    /* width: 100%;
    height: 100%; */
    clip-path: inset(0% 0% 0% 0% round var(--border-radius));
  
`