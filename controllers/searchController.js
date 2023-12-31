const searchService = require("../services/searchService.js");

const getSearchResult = async (req, res) => {
  const authHeader = req.headers.authorization;
  const accessToken = authHeader && authHeader.split(" ")[1];
  const searchKeyword = req.query.text;

  try {
    const response = await searchService.getSearchResult(
      accessToken,
      searchKeyword
    );

    const message = response.message;
    const searchResult = response.searchResult;

    res.status(200).json({ message, searchResult });
  } catch (err) {
    console.error(err);
  }
};

module.exports = { getSearchResult };
