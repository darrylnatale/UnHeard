
import styled from "styled-components"
import { useContext } from "react";
import Found from "./Found"
import { Context } from "../Context";
import ArtistVerification from "./ArtistVerification"
import NotFound from "./NotFound"
import Results from "./Results";
import SearchResults from "./SearchResults"

const HomePage = () => {

    const {
        selectedArtist,
        exactSpotifyNameMatch,
        spotifySearchResults,
        setSpotifyContent
         } = useContext(Context);

    
    return ( 
        <>
        
        <SearchResults />
        {exactSpotifyNameMatch && <ArtistVerification />}      

        {/* <SearchResults getAllContentFromSpotifyAndDiscogs={ getAllContentFromSpotifyAndDiscogs } /> */}

        {/* {exactSpotifyNameMatch && <ArtistVerification getAllContentFromSpotifyAndDiscogs={ getAllContentFromSpotifyAndDiscogs } />}       */}
        
        {(!exactSpotifyNameMatch && spotifySearchResults) && <NotFound />}
        
         <Results />
        {selectedArtist && <Found />} 
        </>
    );
}
 
export default HomePage;

const Page = styled.div`
  border: 1px solid black;
  margin: 100px 50px;
  text-align: center;
  li{
    list-style: none;
    }

  h1 {
    margin-bottom: 50px;
    text-align: center;
      }

      
`














