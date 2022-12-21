const filter = (mergedTracks) => {

    const filters = ["Remaster", "Remaaster","- Live", "Dub", "(Live)", "Acoustic", "Alternate Take", "Outtake", "- Take", "Maxi", "Mix", "Version", "Remix", "Edit", "Dub Mix", "Live at", "Club Mix", "World Tour", "Vocal", `12"`, `7"`, "Instrumental"]
    
    const filteredSongs = mergedTracks.filter((item) => {
        
        return filters.every(filter => !Object.keys(item)[0].toLowerCase().includes(filter.toLowerCase()))
    }
        );

    return filteredSongs;
}
 
export default filter;