import styled from "styled-components";
import { useContext, useEffect } from "react";
import { Context } from "../Context";
import _ from 'lodash';

const Searchbar = () => {
  
  const {
    setSubmitted, setDiscogsSearchResults, searchFormData, setSearchFormData, setExactSpotifyNameMatch, setDiscogsContent, setAllData} = useContext(Context);

    const debouncedHandleSubmit = _.debounce((e, searchTerm) => {
      console.log("debounce run")
      setDiscogsSearchResults([])
      setSearchFormData(e.target.value);
      handleSubmit(e, e.target.value);
    }, 2000);
  
  const handleChange = (e) => {
    setDiscogsSearchResults([])
    setSearchFormData(e.target.value);
    debouncedHandleSubmit(e, e.target.value);
  };

  const handleSubmit = (e, searchFormData) => {
    console.log("handlesubmit run")
    e.preventDefault();

    fetch(`/searchDiscogs/`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ searchFormData }),
    })
      .then((res) => res.json())
      .then((data) => {
        setDiscogsSearchResults([]); // resets searchResults to empty array on click (move this to later in process)
        setDiscogsContent(null); // resets discogsContent to null to reset (move later?)
        setSubmitted(searchFormData);
        setExactSpotifyNameMatch(null);
        data.data.results.forEach((result, index) => {
          if (index < 4) {
            getDiscogsArtistDetails(result.id);
          }
        });
      })
      .catch((err) => console.log(err));
  };
  
  const getDiscogsArtistDetails = (results) => {
    fetch(`/getDiscogsArtistDetails`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ results }),
    })
      .then((res) => res.json())
      .then((data) => {
        setDiscogsSearchResults((prev) => [...prev, data.data]);  
      })
      .catch((err) => console.log(err));
  };

  return (
    <StyledSearchForm onSubmit={(e) => handleSubmit(e, searchFormData)}>
      <StyledSearchBarInput
        type="search"
        placeholder={"Search For A Musician"}
        onInput={debouncedHandleSubmit}
      />
    </StyledSearchForm>
  );
};

export default Searchbar;

const StyledSearchForm = styled.form`
  display: flex;
  
  justify-content: center;
  align-items: center;
`;
const StyledSearchBarInput = styled.input`
  
  border: 1px solid black;
  border-radius: 50px;
  width: 850px;
  height: 75px;
  font-size: 30px;
  margin: 25px;
  text-align: center;
  border: none;

  ::-webkit-input-placeholder {
    text-align: center;
  }

  :-moz-placeholder {
    text-align: center;
  }
`;

const StyledSubmitButton = styled.button`
  width: 75px;
  height: 75px;
  border: none;
  background: none;
  font-size: 50px;
`;