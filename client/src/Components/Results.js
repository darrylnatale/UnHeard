import styled from "styled-components";
import { Context } from "../Context";
import { useContext } from "react";
import DiscogsResults from "./DiscogsResults";
import SpotifyResults from "./SpotifyResults";

const Results = () => {

    const {allSpotifyTrackNames, discogsContent} = useContext(Context)
    
    return ( <>
            {allSpotifyTrackNames && <SpotifyResults / >}
            {discogsContent && <DiscogsResults />}
        </> );
}
 
export default Results;