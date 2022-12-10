const compare = (array1, array2) => {
    const merged = array1.concat(array2);
    const result = merged
    .filter(i => merged.filter(j => i.toLowerCase() === j.toLowerCase()).length === 1)
    .sort();
    return result;
    }
    
export default compare;
    