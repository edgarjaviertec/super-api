import expressValidation from 'express-validation';

function errorhandler(err, req, res, next) {
    if (err instanceof expressValidation.ValidationError) {
        let newErrorMessages = [];
        const re = /\"(.*?)\"/gm;
        const subst = '[$1]';
        // if (err.errors.length > 0) {
        err.errors.map(errorItem => { // If is declaration is empty don't run the loop
            const { types, messages, field } = errorItem; // Destructuring assignment 
            if (types.length > 0 && types.length === messages.length) {
                types.map((code, i, array) => newErrorMessages.push({ // Rename type to code for dynamic assign
                    code,
                    field: field.length > 1
                        ? `${field[0]} ${messages[i].replace(re, subst)}`
                        : messages[i].replace(/[\"]/g, '')
                }));
            }
        });
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