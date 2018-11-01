import Joi from 'joi';

export default {
    create: {
        body: {
            username: Joi.string().alphanum().min(3).max(30).required(),
            email: Joi.string().email({minDomainAtoms: 2}).required(),
            password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
            confirmPassword: Joi.string().required().valid(Joi.ref('password')).options({
                language: {
                    any: {
                        allowOnly: 'Passwords do not match',
                    }
                }
            })

        }
    },
    addOrRemoveRole: {
        body: {
            roles: Joi.array().required().items(
                Joi.number().integer().min(0)
            )
        }
    },
    update: {
        body: {
            username: Joi.string().alphanum().min(3).max(30).required(),
            email: Joi.string().email({minDomainAtoms: 2}).required(),
            password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
            confirmPassword: Joi.string().required().valid(Joi.ref('password')).options({
                language: {
                    any: {
                        allowOnly: 'Passwords do not match',
                    }
                }
            })
        }
    },
};