import { Context } from "../Context";
import { useContext , useEffect, useState} from "react";
import Video from "./Video";


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
    <>
      
      
      <iframe
      width="560"
      height="315"
      src={`https://www.youtube.com/embed/${src}`}
      title="Youtube Player"
      frameBorder="0"
      allowFullScreen
      />
    </>
  }
    </>);
}
 
export default YouTubeVideoSection;