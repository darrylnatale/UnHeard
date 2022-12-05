import { Context } from "../Context";
import { useContext } from "react";
import styled from "styled-components";
import ArtistButton from "./ArtistButton";
import formatDiscogsArtistName from "../Functions/formatDiscogsArtistName";
import getDiscogsContent from "../Functions/getDiscogsContent";
import getSpotifyContent from "../Functions/getSpotifyContent";
const SearchResults = () => {
    
    const { setExactSpotifyNameMatch, 
      discogsSearchResults, 
      setSelectedArtist,      
      setDiscogsContent,
      setSpotifyContent, spotifyContent, setIsInMongo } = useContext(Context);

      
      
         
      const crossReference = (formattedDiscogsArtistName, discogsArtistId) => {
        console.log(discogsArtistId)
            fetch(`/searchSpotify/${formattedDiscogsArtistName}`) 
                  .then((res) => res.json())
                  .then((data) => {
                    
                    
                    let suggestedSpotifyArtists = []
                    
                      data.data.body.artists.items.forEach((item) => {
                        
                            if (item.name.toLowerCase() === formattedDiscogsArtistName.toLowerCase()){
                              suggestedSpotifyArtists.push(item)
                            }                               
                      }) 
                      
                      if (suggestedSpotifyArtists.length === 0){
                        console.log(discogsArtistId)
                        setDiscogsContent(getDiscogsContent(discogsArtistId))
                      } else {
                        console.log("yes")
                        setExactSpotifyNameMatch(suggestedSpotifyArtists)
                      }
                   })
                   .catch((err) => console.log(err));
                  }

        const checkIfInMongo = (discogsArtistId, discogsArtistName) => {
        
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
              setIsInMongo(true)
              setSelectedArtist(data.data)
              console.log(data)
              return data
              
              //     const spotifyArtistId = data.data.spotifyArtistId
              //     const discogsArtistId = data.data.discogsArtistId
              //     const artistName = data.data.artistName   
              // console.log(getSpotifyContent(spotifyArtistId, artistName))
            // IF IT EXISTS IN MONGO, PROCEED TO GETTING ALL CONTENT
            //     if (data.data){
                  
                  
            //       setSelectedArtist(data.data)

            //       const spotifyArtistId = data.data.spotifyArtistId
            //       const discogsArtistId = data.data.discogsArtistId
            //       const artistName = data.data.artistName    

                   
            //       getSpotifyContent(spotifyArtistId, artistName)
            //       setDiscogsContent(getDiscogsContent(discogsArtistId))

                  
            
            // // ELSE CROSS REFERENCE THE ARTIST WITH THE SPOTIFY API
            // //     } else {                
            //       console.log(discogsArtistId)
            //       const formattedDiscogsArtistName = formatDiscogsArtistName(discogsArtistName)
                  
                  
            //       crossReference(formattedDiscogsArtistName, discogsArtistId)
            //     }
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