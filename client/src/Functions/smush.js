const smush = (array, type) => {
  if (type === "strings") {
    return array.map((item) => item.toLowerCase().replace(/[^0-9A-Za-z]/gi, ""));
  } else if (type === "objects") {
    return array.map((item) => {
      let key = Object.keys(item)[0];
      return key.toLowerCase().replace(/[^0-9A-Za-z]/g, "");
    });
  }
};

export default smush;
