const authService = require("../services/authService.js");

const emailCheck = async (req, res) => {
    const requestCheckEmail = req.query.email;
    try {
        const { success, info, status, error } =
            await authService.emailCheck(requestCheckEmail);
    
        if (success == false) return res.status(400).json({ success, info, error});

        res.status(200).json({ success, info, status });
    } catch (err) {
        console.error(err);
    }
}

module.exports = { emailCheck };