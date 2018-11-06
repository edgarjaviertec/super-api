import Joi from 'joi';

export default {
    forgotPassword: {
        body: {
            email: Joi.string().email({minDomainAtoms: 2}).required(),
        }
    },
    resetPassword: {
        body: {
            token: Joi.string().required(),
            newPassword: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
            confirmPassword: Joi.string().required().valid(Joi.ref('newPassword')).options({
                language: {
                    any: {
                        allowOnly: 'passwords do not match',
                    }
                }
            })
        }
    },

    confirmation: {
        body: {
            token: Joi.string().required(),
        }
    },
};