
import { Context } from "../Context";
import { useContext } from "react";



const Results = () => {

    const {discogsContent, spotifyContent} = useContext(Context)
    
    return ( <>
    {spotifyContent ? <>spotifycontentloaded</> : <>spotify not loaded</>}
            {/* {spotifyContent && <SpotifyResults / >} */}
            {/* {discogsContent && <DiscogsResults />} */}
        </> );
}
 
export default Results;