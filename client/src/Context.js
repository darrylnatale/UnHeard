
import {useState, createContext} from "react"

export const Context = createContext(null)

const Provider = ({children}) => {
    const [allData, setAllData] = useState({
        artistName: null,
        albumOverviews: [],
        fetchedAlbumOverviews: [],
        albums: [],
        tracks: [],
        discogsPages: null,
        discogsPagesFetched: 1,
        spotifyArtistId: null,
        discogsArtistId: null,

    })
    const [discogsContentFetched, setDiscogsContentFetched] = useState(false)
    const [spotifyContentFetched, setspotifyContentFetched] = useState(false)
    const [timerIndex, setTimerIndex] = useState(0)
    const [showFound, setShowFound] = useState()
    const [mongoUser, setMongoUser] = useState(null)
    const [exactSpotifyNameMatch, setExactSpotifyNameMatch] = useState(null)
    const [albums, setAlbums] = useState()
    const [spotifySearchResults, setSpotifySearchResults] = useState()
    const [selectedArtist, setSelectedArtist] = useState()
    const [spotifyAlbums, setSpotifyAlbums] = useState()
    const [searchFormData, setSearchFormData] = useState()
    const [moreToFetch, setMoreToFetch] = useState()
    const [allSpotifyTrackNames, setAllSpotifyTrackNames] = useState()
    const [allDiscogsTrackNames, setAllDiscogsTrackNames ] = useState([])
    const [submitted, setSubmitted] = useState(false)
    const [allTracksFromBoth, setAllTracksFromBoth] = useState()
    const [discogsSearchResults, setDiscogsSearchResults] = useState([])
    const [discogsContent, setDiscogsContent] = useState()
    const [spotifyContent, setSpotifyContent] = useState()
    const [discogsTrackNames, setDiscogsTrackNames] = useState()
    const [discogsArtistIdState, setDiscogsArtistIdState] = useState()
    const [lastSearched, setLastSearched] = useState()
    const [isInMongo, setIsInMongo] = useState()
    const [releases, setReleases] = useState([])
    const [discogsMastersDone, setDiscogsMastersDone] = useState(false)
    
    return <Context.Provider value={{
        timerIndex,
        setTimerIndex,
        exactSpotifyNameMatch,
        setExactSpotifyNameMatch,
        albums,
        setAlbums, 
        discogsSearchResults,
        setDiscogsSearchResults,
        spotifySearchResults,
        setSpotifySearchResults,
        selectedArtist,
        setSelectedArtist,
        spotifyAlbums,
        setSpotifyAlbums,
        searchFormData,
        setSearchFormData,
        allSpotifyTrackNames,
        setAllSpotifyTrackNames,
        submitted,
        setSubmitted,
        allTracksFromBoth,
        setAllTracksFromBoth,
        discogsContent,
        setDiscogsContent,
        spotifyContent,
        setSpotifyContent,
        discogsTrackNames,
        setDiscogsTrackNames,
        discogsArtistIdState, 
        setDiscogsArtistIdState,
        allDiscogsTrackNames,
        setAllDiscogsTrackNames,
        isInMongo, 
        setIsInMongo,
        mongoUser, setMongoUser,
        lastSearched, setLastSearched,
        moreToFetch, setMoreToFetch,
        showFound, setShowFound,
        releases, setReleases,
        allData, setAllData,
        discogsContentFetched, setDiscogsContentFetched,
        discogsMastersDone, setDiscogsMastersDone,
        spotifyContentFetched, setspotifyContentFetched
    }}>
        {children}
    </Context.Provider>
}

export default Provider

