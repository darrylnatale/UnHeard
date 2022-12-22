const smush = (array) => {
  
  return array.map((item) => {
    if (typeof item["trackName"] === "string") {
      return item["trackName"].toLowerCase().replace(/[^0-9A-Za-z]/g, "");
    }
    return item;
  });
};

export default smush;
