import Joi from 'joi';

export default {
    create: {
        body: {
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
    update: {
        body: {
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