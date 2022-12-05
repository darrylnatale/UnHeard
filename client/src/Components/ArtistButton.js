import styled from "styled-components";
import { useContext } from "react";
import { Context } from "../Context";

const ArtistButton = ({ thumb, name, clickHandler, profile, discogsArtistId }) => {
  
    const { setDiscogsArtistIdState, discogsArtistIdState, setDiscogsSearchResults,  } = useContext(Context);

    const formatProfileText = (profile) => {
        let formattedProfileText = profile

        
        if (formattedProfileText.length > 100) {
            formattedProfileText = profile.slice(0, 100) + "...";
          }

          
          formattedProfileText = formattedProfileText.replaceAll(']', '').replaceAll("/","")
        
        const array = formattedProfileText.split("")
        const newArray = []
        array.forEach((item, index) => {
            if (item === "[" || item === "="){
                
            } else if (array[index-1] === "["){
                
            } else {
                newArray.push(item)
            }
        })
        formattedProfileText = newArray.join('')





        return formattedProfileText
    }

    let formattedProfileText = formatProfileText(profile)
  

  

  return (
    <StyledArtistButton
      onClick={() => {
        clickHandler();
        setDiscogsArtistIdState(discogsArtistId);
        setDiscogsSearchResults([])
        console.log("buttonclicke", discogsArtistIdState);
      }}
    >
      <StyledImage src={thumb} />
      <Bio>
        <StyledArtistName>{name}</StyledArtistName>
        <StyledProfileText>{formattedProfileText}</StyledProfileText>
      </Bio>
    </StyledArtistButton>
  );
};

export default ArtistButton;

const StyledArtistButton = styled.button`
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  font-family: "Zen Dots", cursive;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: auto;
  width: 425px;
  height: 250px;
  border-radius: 20px;
  background: white;
  margin: 25px 25px 0 25px;
  padding: 20px;
  border: none;
  
`;
const StyledArtistName = styled.h1`
  font-size: 15px;
  overflow: auto;
  text-decoration: underline;
  align-self: center;
`;
const StyledImage = styled.img`
  width: 180px;
  border-radius: 15px;
`;

const Bio = styled.div`
  display: flex;
  overflow: auto;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

const StyledProfileText = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
`;
