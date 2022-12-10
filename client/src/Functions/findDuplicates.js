const findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) !== index);

export default findDuplicates;