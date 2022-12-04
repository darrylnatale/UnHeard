import { Context } from "../Context";
import { useContext , useState} from "react";

const YouTubeVideoSection = ({gems}) => {

    const [youTubeResult, setYouTubeResult] = useState(null);
    
    
    

    const searchYouTube = async (q) => {
        q = encodeURIComponent(q);
        const response = await fetch("https://youtube-search-results.p.rapidapi.com/youtube-search/?q=" + q, {
          "method": "GET",
          "headers": {
            "x-rapidapi-host": "youtube-search-results.p.rapidapi.com",
            "x-rapidapi-key": "927bd409c8msh1f5aa5364e29a18p1b210ajsn944bc399a834"
          }
        });
        const body = await response.json();
        
        setYouTubeResult(body.items[0])
        return body.items.filter(item => item.type === 'video');
      }


    const {discogsData} = useContext(Context)

    const videos = []

    discogsData.masters.mainReleases.roles.main.forEach((masterMainReleaseMainRole) => {
        if (masterMainReleaseMainRole.videos){
            let newTitle = ""
            masterMainReleaseMainRole.videos.forEach((video) => {

                
                
                if (video.title.includes("- ")){
                    let indexToSliceAt = video.title.indexOf("- ")
                    newTitle = video.title.slice(indexToSliceAt + 2, video.title.length)
                }
                

                videos.push({
                    title: newTitle,
                    uri: video.uri
                })
                
            })
        }
    })
    console.log(youTubeResult)

    
    
    return ( <>
    <button onClick={() => {searchYouTube("Venise - Wien Is")}}>Venise - Wien Is...</button>
    {youTubeResult && 
    <iframe src={youTubeResult.id}/>
    }
    
    </>);
}
 
export default YouTubeVideoSection;