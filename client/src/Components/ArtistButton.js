import styled from "styled-components";
import { useContext } from "react";
import { Context } from "../Context";

const ArtistButton = ({
  thumb,
  name,
  checkIfInMongoHandler,
  profile,
  discogsArtistId,
}) => {
  const { setDiscogsArtistIdState, discogsArtistIdState } = useContext(Context);

  let formattedProfileText = profile;

  if (formattedProfileText.length > 300) {
    formattedProfileText = formattedProfileText.slice(0, 299) + "...";
  }

  return (
    <StyledArtistButton
      onClick={() => {
        checkIfInMongoHandler();
        setDiscogsArtistIdState(discogsArtistId);
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
  display: flex;
  justify-content: center;
  align-items: center;
  width: 425px;
  height: 250px;
  border-radius: 20px;
  background: white;
  margin: 25px;
  padding: 20px;
  border: none;
`;
const StyledArtistName = styled.h1`
  font-size: 15px;
  text-decoration: underline;
  align-self: center;
`;
const StyledImage = styled.img`
  width: 180px;
  border-radius: 15px;
`;

const Bio = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

const StyledProfileText = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
`;
