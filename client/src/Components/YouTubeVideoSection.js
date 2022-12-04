import { Context } from "../Context";
import { useContext } from "react";

const YouTubeVideoSection = ({gems}) => {

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
    
    
    return ( <>
    {videos.map((video) => {
    return <div>{video.title}</div>
    })}
    
    </>);
}
 
export default YouTubeVideoSection;