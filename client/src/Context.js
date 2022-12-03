
import {useState, createContext} from "react"

export const Context = createContext(null)

const Provider = ({children}) => {
    const [animationIndex, setAnimationIndex] = useState(0)
    const [exactSpotifyNameMatch, setExactSpotifyNameMatch] = useState(null)
    const [albums, setAlbums] = useState()
    const [correctGuess, setCorrectGuess] = useState(undefined)
    const [spotifySearchResults, setSpotifySearchResults] = useState()
    const [selectedArtist, setSelectedArtist] = useState()
    const [spotifyAlbums, setSpotifyAlbums] = useState()
    const [formData, setFormData] = useState()
    const [allSpotifyTracks, setAllSpotifyTracks] = useState()
    const [allSpotifyTrackNames, setAllSpotifyTrackNames] = useState()
    const [submitted, setSubmitted] = useState(false)
    const [seconds, setSeconds] = useState(0)
    const [timedTracks, setTimedTracks] = useState([])
    const [allTracksFromBoth, setAllTracksFromBoth] = useState()

    const [discogsSearchResults, setDiscogsSearchResults] = useState([])
    const [discogsData, setDiscogsData] = useState()
    const [discogsTrackNames, setDiscogsTrackNames] = useState()
    const [discogsArtistIdState, setDiscogsArtistIdState] = useState()
    
    
    return <Context.Provider value={{
        animationIndex,
        setAnimationIndex,
        exactSpotifyNameMatch,
        setExactSpotifyNameMatch,
        albums,
        setAlbums,
        correctGuess,
        setCorrectGuess,
        discogsSearchResults,
        setDiscogsSearchResults,
        spotifySearchResults,
        setSpotifySearchResults,
        selectedArtist,
        setSelectedArtist,
        spotifyAlbums,
        setSpotifyAlbums,
        formData,
        setFormData,
        allSpotifyTracks,
        setAllSpotifyTracks,
        allSpotifyTrackNames,
        setAllSpotifyTrackNames,
        submitted,
        setSubmitted,
        seconds,
        setSeconds,
        timedTracks,
        setTimedTracks,
        allTracksFromBoth,
        setAllTracksFromBoth,
        discogsData,
        setDiscogsData,
        discogsTrackNames,
        setDiscogsTrackNames,
        discogsArtistIdState, 
        setDiscogsArtistIdState,
    }}>
        {children}
    </Context.Provider>
}

export default Provider

