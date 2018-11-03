import expressValidation from 'express-validation';

function errorhandler(err, req, res, next) {
    if (err instanceof expressValidation.ValidationError) {
        let newErrorMessages = [];
        if (err.errors.length > 0) {
            err.errors.forEach((errorItem) => {
                if (errorItem.types.length > 0 && errorItem.types.length === errorItem.messages.length) {
                    for (let i = 0; i < errorItem.types.length; i++) {
                        if (errorItem.field.length > 1) {
                            var re = /\"(.*?)\"/gm;
                            var subst = '[$1]';
                            newErrorMessages.push({
                                "code": errorItem.types[i],
                                "field": errorItem.field[0] + errorItem.messages[i].replace(re, subst)
                            });
                        } else {
                            newErrorMessages.push({
                                "code": errorItem.types[i],
                                "field": errorItem.messages[i].replace(/[\"]/g, '')
                            });
                        }
                    }
                }
            })
        }
        res.status(err.status).json({
            "errors": newErrorMessages
        });
    }
    else if (err.statusCode) {
        res.status(err.statusCode).send({
            "message": err.message
        });
    } else {
        res.status(500).send({
            "message": "Internal Server Error"
        });
    }
}

module.exports = errorhandler;