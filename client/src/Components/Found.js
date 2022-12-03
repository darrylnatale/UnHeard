import { useContext } from "react";
import { Context } from "../Context";
import styled from "styled-components";

const Found = () => {

    
    return ( 
        <>
            <CompareMessage>
                <h1>We found <Number>x</Number> tracks not available on Spotify:</h1>
            </CompareMessage>
            <div>
                <h1>Track Name1, TrackName2,...</h1> 
            </div>
            <div>
            <h1>But we found it on YouTube</h1>
            </div>
            {/* <iframe width="560" height="315" src="https://www.youtube.com/embed/vrM2EGghhqM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            <iframe width="560" height="315" src="https://www.youtube.com/embed/YB2LivWtHfw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            <iframe width="560" height="315" src="https://www.youtube.com/embed/X0puqUVPxLs" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> */}
        </> );
}
 
export default Found;

const Number = styled.h1`
color: red;
`

const CompareMessage = styled.div`
text-align: center
`

