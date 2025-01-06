module.exports = (query) => {
  let objectSearch = {
    keyword: "",
  };

  if (query.keyword) {
    objectSearch.keyword = query.keyword;

    const regex = new RegExp(objectSearch.keyword, "i");
    // console.log(regex);
    objectSearch.regex = regex;
  }

  return objectSearch;
};
