const express = require("express");
require('dotenv').config(); 
const { User } = require("../database/models/User.js");


const emailCheck = async (email) => {
    try {
        const user = await User.findOne({ email: email });

        if (user) {
            return {
                success: false,
                info: null,
                error: {
                    message: "이미 가입된 이메일입니다.",
                    status: 400
                }
            };
        } else {
            return {
                success: true,
                info: "사용가능한 이메일입니다.",
                status: 200
            };
        }
    } catch (err) {
        console.error(err);
        return {
            success: false,
            info: null,
            error: {
                message: "오류가 발생했습니다.",
                status: 500
            }
        };
    }
};

module.exports = { emailCheck };
