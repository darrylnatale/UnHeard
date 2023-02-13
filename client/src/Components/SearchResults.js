import { Context } from "../Context";
import { useContext } from "react";
import styled from "styled-components";
import ArtistButton from "./ArtistButton";
import getDiscogsContent from "../Functions/getDiscogsContent";
import formatDiscogsArtistName from "../Functions/formatDiscogsArtistName"

const SearchResults = () => {
    
    const { setExactSpotifyNameMatch, discogsSearchResults, setDiscogsReleases, setSelectedArtist, setDiscogsContent, setIsInMongo, setSubmitted, setLastSearched  } = useContext(Context);

      
      
         
      const crossReference = (formattedDiscogsArtistName, discogsArtistId) => {
        fetch(`/searchSpotify/${formattedDiscogsArtistName}`) 
          .then((res) => res.json())
          .then((data) => {
            // Create an array of suggested artists that match the formattedDiscogsArtistName
            const suggestedSpotifyArtists = data.data.body.artists.items.filter(item => item.name.toLowerCase() === formattedDiscogsArtistName.toLowerCase());
      
            // If no exact matches were found, get the discogs content and set the discogs releases
            if (suggestedSpotifyArtists.length === 0) {
              console.log(discogsArtistId)
              setDiscogsContent(getDiscogsContent(discogsArtistId))
              setDiscogsReleases()
            } else {
              // Otherwise, set the exactSpotifyNameMatch with the suggested artists
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
                  setSubmitted(false)
              }
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
    {discogsSearchResults
      .sort((a, b) => (a.images ? -1 : 1))
      .map((discogsSearchResult, index) => {
        const thumb = discogsSearchResult.images
          ? discogsSearchResult.images
            .filter(image => image.width > image.height)
            .map(image => image.uri)[0] || ""
          : "";
        return (
          <ArtistButton 
            key={index} 
            clickHandler={() => {
              checkIfInMongo(discogsSearchResult.id, discogsSearchResult.name)
              addSearchToUserHistory(discogsSearchResult.id)
            }} 
            thumb={thumb} 
            profile={discogsSearchResult.profile || ""} 
            name={discogsSearchResult.name}
            aliases={discogsSearchResult?.aliases || []}
            nameVariations={discogsSearchResult?.namevariations || []}
            realName={discogsSearchResult.realname || ""}
            discogsArtistId={discogsSearchResult.id}
          />
        );
      })}
  </StyledDiscogsSearchResults>
         
        : <>Searching Spotify... This Might Take a Second</>
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