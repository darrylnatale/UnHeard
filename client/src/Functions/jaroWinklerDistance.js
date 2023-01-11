const jaroWinklerDistance = (str1, str2) => {
    // Normalize the input strings by converting to lowercase
    str1 = str1.toLowerCase();
    str2 = str2.toLowerCase();

    // Define the Jaro distance between the two strings
    let jaroDistance = 0;
    let matchDistance = Math.floor(Math.max(str1.length, str2.length) / 2) - 1;
    let str1Matches = {};
    let str2Matches = {};
    let matches = 0;
    let transpositions = 0;
    for (let i = 0; i < str1.length; i++) {
        let start = Math.max(0, i - matchDistance);
        let end = Math.min(i + matchDistance + 1, str2.length);
        for (let j = start; j < end; j++) {
            if (str2Matches[j]) continue;
            if (str1[i] !== str2[j]) continue;
            str1Matches[i] = true;
            str2Matches[j] = true;
            matches++;
            break;
        }
    }
    if (matches === 0) return 0;
    let k = 0;
    for (let i = 0; i < str1.length; i++) {
        if (!str1Matches[i]) continue;
        while (!str2Matches[k]) k++;
        if (str1[i] !== str2[k]) transpositions++;
        k++;
    }
    jaroDistance = (matches / str1.length + matches / str2.length + (matches - transpositions / 2) / matches) / 3;

    // Define the Jaro-Winkler distance
    let winklerDistance = jaroDistance;
    let commonPrefixLength = 0;
    for (let i = 0; i < 4; i++) {
        if (str1[i] === str2[i]) commonPrefixLength++;
        else break;
    }
    winklerDistance = winklerDistance + commonPrefixLength * 0.1 * (1 - winklerDistance);
   
    
    return winklerDistance;
}



export default jaroWinklerDistance;