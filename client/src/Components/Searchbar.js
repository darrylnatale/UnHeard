import styled from "styled-components";
import { useContext, useEffect } from "react";
import { Context } from "../Context";

const Searchbar = () => {

    const { setSubmitted, setDiscogsSearchResults, searchFormData, setSearchFormData, setSpotifySearchResults, setExactSpotifyNameMatch, setDiscogsContent } = useContext(Context);
    
    const handleChange = (value) => {
          setSearchFormData(value);
          };
      
    const handleSubmit = (e, searchFormData) => {
        e.preventDefault();
        

        fetch(`/searchDiscogs/`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({searchFormData}),
          }) 
            .then((res) => res.json())
            .then((data) => {
              setDiscogsSearchResults([]) // resets searchResults to empty array on click (move this to later in process)
              setSpotifySearchResults(null) // resets searchResults to null to reset (move later?)
              setDiscogsContent(null) // resets discogsContent to null to reset (move later?)
              setSubmitted(searchFormData)
              setExactSpotifyNameMatch(null)
                        data.data.results.forEach((result, index) => {
                          if (index < 5){
                          getDiscogsArtistDetails(result.id)
                          }
                        })
              
             })
             .catch((err) => console.log(err));
      }

      
    const getDiscogsArtistDetails = (results) => {
            fetch(`/getDiscogsArtistDetails`, {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({results}),
            })
            .then((res) => res.json())
            .then((data) => {
            
              setDiscogsSearchResults(prev => [...prev, data.data])
              
            })
            .catch((err) => console.log(err));
        }
      
       
    return (<StyledSearchForm onSubmit={(e) => handleSubmit(e, searchFormData)}>              
                <StyledSearchBarInput 
                    type="search" 
                    placeholder={"Search For A Musician"}
                    onChange={(e) => handleChange(e.target.value)}/>
                <StyledSubmitButton onClick={(e) => handleSubmit(e, searchFormData)}>💎</StyledSubmitButton>
           </StyledSearchForm>
    )
}

export default Searchbar;

const StyledSearchForm = styled.form`
display: flex;
`
const StyledSearchBarInput = styled.input`
  border: 1px solid black;
  border-radius: 20px;
  width: 500px;
  height: 75px;
  font-size: 30px;
  margin: 100px ;
  text-align: center;

::-webkit-input-placeholder {
  text-align: center;
  }

:-moz-placeholder {
  text-align: center;
  }
`

const StyledSubmitButton = styled.button`

width: 75px;
height: 75px;
border: none;
background: none;
font-size: 50px;
`