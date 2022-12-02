import { Context } from "./Context";
import { useContext } from "react";
import styled from "styled-components";
import ArtistButton from "./Components/ArtistButton";

const SearchResults = ({getAllContentFromSpotifyAndDiscogs}) => {
    
    const {
        exactSpotifyNameMatch,
        setExactSpotifyNameMatch,
        albums,
        setAlbums,
        correctGuess,
        setCorrectGuess,
        discogsSearchResults,
        setDiscogsSearchResults,
        spotifySearchResults,
        setSpotifySearchResults,
        selectedArtist,
        setSelectedArtist,
        spotifyAlbums,
        setSpotifyAlbums,
        formData,
        setFormData,
        allSpotifyTracks,
        setAllSpotifyTracks,
        allSpotifyTrackNames,
        setAllSpotifyTrackNames,
        submitted,
        setSubmitted,
        seconds,
        setSeconds,
        timedTracks,
        setTimedTracks,
        allTracksFromBoth,
        setAllTracksFromBoth,
        discogsAlbums,
        setDiscogsAlbums,
        discogsAlbumDetails,
        setDiscogsAlbumDetails,
        discogsVersions,
        setDiscogsVersions,
        discogsTrackNames,
        setDiscogsTrackNames,
        discogsArtistIdState, 
        setDiscogsArtistIdState,
         } = useContext(Context);

         
         const formatDiscogsArtistName = (discogsArtistName) => {

            const containsNumbers = (str) => {
              return /\d/.test(str);
            }
          
            if (
              (discogsArtistName.charAt(discogsArtistName.length-1) === ")") && 
              (containsNumbers(discogsArtistName.charAt(discogsArtistName.lastIndexOf(")")-1)))
              )
              {
              
             const lastIndexOfOpenParentheses = discogsArtistName.lastIndexOf("(")
            
             return discogsArtistName.slice(0,lastIndexOfOpenParentheses-1)
            } 
            return discogsArtistName
          }

          const crossReference = (submitted, formattedDiscogsArtistName, discogsArtistId) => {
  
            fetch(`/searchSpotify/${formattedDiscogsArtistName}`) 
                  .then((res) => res.json())
                  .then((data) => {
                    
                      setSpotifySearchResults(data.data.body.artists.items)

                      let suggestedSpotifyArtists = []
          
                      data.data.body.artists.items.forEach((item) => {
                        
                        if (item.name.toLowerCase() === formattedDiscogsArtistName.toLowerCase()){
                          suggestedSpotifyArtists.push(item)
                          setExactSpotifyNameMatch(suggestedSpotifyArtists)
                          
                        }
                      })
                      
                       
                      
                   })
                   
                   
                   
                   .catch((err) => console.log(err));
          }

         const checkIfInMongo = (discogsArtistId, discogsArtistName) => {
          
            const formattedDiscogsArtistName = formatDiscogsArtistName(discogsArtistName)
            
            fetch(`/checkIfInMongo`, {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({discogsArtistId}),
            })
            .then((res) => res.json())
            .then((data) => {
              
            // IF IT EXISTS IN MONGO, PROCEED TO GETTING ALL CONTENT
                if (data.data){
                  const spotifyArtistId = data.data.spotifyArtistId
                  const artistName = data.data.artistName      
                  getAllContentFromSpotifyAndDiscogs(spotifyArtistId, artistName, discogsArtistId)
            
            // ELSE CROSS REFERENCE THE ARTIST WITH THE SPOTIFY API
                } else {
                  crossReference(submitted, formattedDiscogsArtistName, discogsArtistId)
                }
               })
            .catch((err) => console.log(err));  
          }


    return ( <>
    {discogsSearchResults.length ? 
          
          <StyledDiscogsSearchResults>
              {discogsSearchResults.map((discogsSearchResult, index) => {

                if (discogsSearchResult) {
                  return <ArtistButton 
                          key={index} 
                          checkIfInMongoHandler={() => {checkIfInMongo(discogsSearchResult.id, discogsSearchResult.name)}} 
                          thumb={discogsSearchResult.images ? discogsSearchResult.images[0].uri : ""} 
                          profile={discogsSearchResult.profile ? discogsSearchResult.profile : ""} 
                          name={discogsSearchResult.name}
                          discogsArtistId={discogsSearchResult.id}/>}
                          // onClick={() => {getAllContentFromSpotifyAndDiscogs(artistSearchResult.id, artistSearchResult.title)}}
                          })}
          </StyledDiscogsSearchResults>
         
        : <></>
        }
    </> );
}
 
export default SearchResults;

const StyledDiscogsSearchResults = styled.div`
display: flex;
flex-wrap: wrap;
max-width: 1200px;
align-items: center;
justify-content: center;
`