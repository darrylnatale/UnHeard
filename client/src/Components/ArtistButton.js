import styled from "styled-components";
import { useContext, useState } from "react";
import { Context } from "../Context";

const ArtistButton = ({ thumb, name, clickHandler, profile, discogsArtistId, aliases, nameVariations, realName }) => {
  
    const { setDiscogsArtistIdState, setDiscogsSearchResults } = useContext(Context);

    const formatProfileText = (profile) => {
      let formattedProfileText = profile;
    
      // Limit the profile text to 100 characters and add ellipsis
      if (formattedProfileText.length > 200) {
        formattedProfileText = profile.slice(0, 200) + "...";
      }
    
      // Remove square brackets and slashes
      formattedProfileText = formattedProfileText.replace(/[\]/]/g, '');
    
      // Remove text between square brackets
      formattedProfileText = formattedProfileText.replace(/\[[^\]]*]/g, '');
    
      return formattedProfileText;
    }

    let formattedProfileText = formatProfileText(profile)
  






    
    const [displayText, setDisplayText] = useState();

    return (
      <StyledArtistButton
        bgImage={thumb}
        onClick={() => {
          clickHandler();
          setDiscogsArtistIdState(discogsArtistId);
          setDiscogsSearchResults([]);
        }}
        onMouseEnter={() => setDisplayText(formattedProfileText)}
        onMouseLeave={() => setDisplayText(name.toUpperCase())}
      >
        <StyledArtistName textLength={displayText ? displayText.length : 0}>{displayText ? displayText : name.toUpperCase()}</StyledArtistName>
      </StyledArtistButton>
    );
  };
  
  export default ArtistButton;
  
  const StyledArtistButton = styled.button`
    background: url(${props => props.bgImage}) no-repeat center center;
    background-size: cover;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 425px;
    height: 250px;
    border-radius: 20px;
    margin: 25px 25px 0 25px;
    padding: 20px;
    border: none;
    color: white;
    transition: all 0.3s ease-in-out;
  `;
  
  const StyledArtistName = styled.p`
    font-size: ${props => (props.textLength > 25 ? 25 : 60)}px;
    text-align: center;
    width: 100%;
  
    @media (max-width: 425px) {
      font-size: ${props => (props.textLength > 25 ? 12.5 : 30)}px;
    }
  
    @media (max-width: 300px) {
      font-size: ${props => (props.textLength > 25 ? 10 : 20)}px;
    }
  `;