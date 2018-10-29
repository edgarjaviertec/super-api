import Joi from 'joi';

export default {
    create: {
        body: {
            // La expresión regular valida que el nombre del role tenga un formato tipo slug
            name: Joi.string().min(3).max(75).required().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).options({
                language: {
                    string: {
                        regex: {
                            base: 'must be a valid slug',
                        }
                    }
                }
            }),
            displayName: Joi.string().min(3).max(100).required(),
            description: Joi.string().min(3).max(255).required(),
        }
    },
};