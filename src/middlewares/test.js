import express from "express";
var router = express.Router();

let prueba = router.use(function (req, res, next) {
    console.log("esto me mandaste en el body: ");
    console.log(req.body);
    next();
});

module.exports = {
    prueba: prueba
};



