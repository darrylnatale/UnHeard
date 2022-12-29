const filter = (mergedTracks) => {

    const filters = ["iTunes Original", "Video CD", "Interview", "Remaster", "Remaaster","- Live", "12 Inch", "Ext.", "Side A", "Side B", "Disc One", "Disc Two", "Disc Three", "Disc Four", "Dub ", "(Live)", "Acoustic", "Alternate Take", "Outtake", "- Take", " Maxi", "Edit.", "(Dub)"," Mix", " Version", "Remix", " Edit", "(Edit)", "Dub Mix", "Live at", "Club Mix", "World Tour", " Vocal", `12"`, `7"`, "Instrumental", "Promo Video"]
    
    const filteredSongs = mergedTracks.filter((item) => {
        
        return filters.every(filter => !Object.keys(item)[0].toLowerCase().includes(filter.toLowerCase()))
    }
        );

    return filteredSongs;
}
 
export default filter;