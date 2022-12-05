import { Context } from "../Context";
import { useContext } from "react";
import styled from "styled-components";
import ArtistButton from "./ArtistButton";
import getDiscogsContent from "../Functions/getDiscogsContent";
import formatDiscogsArtistName from "../Functions/formatDiscogsArtistName"

const SearchResults = () => {
    
    const { setExactSpotifyNameMatch, 
      discogsSearchResults, 
      setDiscogsSearchResults, 
      setSelectedArtist,      
      setDiscogsContent,
      setSpotifyContent, spotifyContent, setIsInMongo, setLastSearched  } = useContext(Context);

      
      
         
      const crossReference = (formattedDiscogsArtistName, discogsArtistId) => {
        console.log(discogsArtistId)
            fetch(`/searchSpotify/${formattedDiscogsArtistName}`) 
                  .then((res) => res.json())
                  .then((data) => {
                    console.log(data)
                    
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
              if (data.data !== null){
                setIsInMongo(true)
                setSelectedArtist(data.data)
                console.log(data)
                return data
              } else {
                      console.log(discogsArtistId)
                  const formattedDiscogsArtistName = formatDiscogsArtistName(discogsArtistName)
                  
                  console.log(formattedDiscogsArtistName)
                  crossReference(formattedDiscogsArtistName, discogsArtistId)
              }
              
              
              
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

          const addSearchToUserHistory = (discogsArtistId) => {
            fetch(`/addSearchToUserHistory`, {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({discogsArtistId}),
            })
            .then((res) => res.json())
            .then((data) => {
              setLastSearched(data.data)
              console.log(data)
            })
          }
          
    return ( <>
    {discogsSearchResults.length ? 
          
          <StyledDiscogsSearchResults>
              {discogsSearchResults.map((discogsSearchResult, index) => {

                if (discogsSearchResult) {
                  return <ArtistButton 
                              key={index} 
                              clickHandler={() => {
                                checkIfInMongo(discogsSearchResult.id, discogsSearchResult.name)
                                addSearchToUserHistory(discogsSearchResult.id)
                              }
                                
                              } 
                              thumb={discogsSearchResult.images ? discogsSearchResult.images[0].uri : ""} 
                              profile={discogsSearchResult.profile ? discogsSearchResult.profile : ""} 
                              name={discogsSearchResult.name}
                              discogsArtistId={discogsSearchResult.id}/>}
                          })}
          </StyledDiscogsSearchResults>
         
        : <>Searching... This Might Take a Moment</>
        }
    </> );
}
 
export default SearchResults;

const StyledDiscogsSearchResults = styled.div`
 
font-family: "Zen Dots", cursive;
display: flex;
flex-wrap: wrap;
max-width: 1200px;
align-items: center;
justify-content: center;
`