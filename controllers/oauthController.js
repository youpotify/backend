const oauthService = require("../services/oauthService.js");

const generatePKCE = async (req, res) => {
  const clientId = req.query.text;
  try {
    const { message, redirect_uri } = await oauthService.generatePKCE(clientId);

    res.status(201).json({ message, redirect_uri });
  } catch (err) {
    console.error(err);
  }
};

const getTokens = async (req, res) => {
  const code = req.query.text;
  try {
    const { message, tokens } = await oauthService.getTokens(code);

    res.status(201).json({ message, tokens });
  } catch (err) {
    console.error(err);
  }
};

module.exports = { generatePKCE, getTokens };
