const levenshteinDistance = (a, b) => {
    // Create a matrix to store the distances between each pair of characters
    const distanceMatrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));
  
    // Initialize the first row and column of the matrix
    for (let i = 0; i <= a.length; i += 1) {
      distanceMatrix[0][i] = i;
    }
    for (let j = 0; j <= b.length; j += 1) {
      distanceMatrix[j][0] = j;
    }
  
    // Calculate the distance between each pair of characters
    for (let j = 1; j <= b.length; j += 1) {
      for (let i = 1; i <= a.length; i += 1) {
        const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
        distanceMatrix[j][i] = Math.min(
          distanceMatrix[j][i - 1] + 1, // deletion
          distanceMatrix[j - 1][i] + 1, // insertion
          distanceMatrix[j - 1][i - 1] + indicator, // substitution
        );
      }
    }
  
    // The distance is the last value in the matrix
    return distanceMatrix[b.length][a.length];
  }
  
  export default levenshteinDistance;