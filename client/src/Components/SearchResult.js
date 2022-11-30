import styled from "styled-components";
import { useContext } from "react";
import { Context } from "../Context";

const SearchResult = (key, thumb, title) => {
    const { discogsSearchResults } = useContext(Context);

    return ( <>
    
    </> );
}
 
export default SearchResult;

const ArtistContainer = styled.button`
display: flex;
width: 200px;
border: 1 px solid lightblue;
margin: 5px;
padding: 5px;
`

const Image = styled.img`
width: 125px;
`