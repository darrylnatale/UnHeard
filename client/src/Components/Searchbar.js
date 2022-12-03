import styled from "styled-components";
import { useContext, useEffect } from "react";
import { Context } from "../Context";

const Searchbar = () => {

  
    
  

    const { setSubmitted, setDiscogsSearchResults, formData, setFormData, setSpotifySearchResults, setExactSpotifyNameMatch, setAllSpotifyTracks, setDiscogsData } = useContext(Context);
    
    const handleChange = (value) => {
        setFormData(value);
      };
      
    const handleSubmit = (e, formData) => {
        e.preventDefault();
        
        
        fetch(`/searchDiscogs/`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({formData}),
          }) 
            .then((res) => res.json())
            .then((data) => {
              setDiscogsSearchResults([])
              setSubmitted(formData)
              
              

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
          setExactSpotifyNameMatch(null)
          setSpotifySearchResults(null)
          setAllSpotifyTracks(null)
          setDiscogsData(null)
        })
        .catch((err) => console.log(err));
        }
      
       
    return (<>
        <form onSubmit={(e) => handleSubmit(e, formData)}>
        <SearchBar 
          type="search" 
          placeholder={"Search For A Musician"}
          onChange={(e) => handleChange(e.target.value)}/>
        </form>
      </>
    )
}

export default Searchbar;

const SearchBar = styled.input`
  border: 1px solid black;
  border-radius: 15px;
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