import mod from "../models";
import bcrypt from "bcrypt";
import config from "../config";
import jwt from "jsonwebtoken";

module.exports = {
    login(req, res) {
        let username = req.body.username;
        let password = req.body.password;
        mod.User.findOne({where: {username: username}}).then((user) => {
            return user;
        }).then((user) => {
            let userPassword = '';
            if (user !== null) {
                userPassword = user.password;
            }
            bcrypt.compare(password, userPassword).then(function (isMatch) {
                if (isMatch) {
                    const payLoad = {
                        "id": user.id
                    };
                    const accessToken = jwt.sign(payLoad, config.accessTokenSecret,
                        {
                            expiresIn: config.accessTokenLife
                        });
                    const response = {
                        "access_token": accessToken,
                        "token_type": "Bearer"
                    };
                    res.status(200).send(response);
                } else {
                    let error = {};
                    error.message = "Bad credentials";
                    throw error
                }
            }).catch((err) => {
                res.status(401).send(err);
            });
        }).catch((e) => {
            res.status(500).send(e);
        })
    }
};