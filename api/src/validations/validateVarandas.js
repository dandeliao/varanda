const Joi = require('joi');

const validar = (schema) => (payload) =>
	schema.validate(payload, { abortEarly: false });

const schemaPutVaranda = Joi.object({
	// aberta, bicho_id
	aberta: Joi.boolean().required(),
	bicho_id: Joi.string().min(1).max(32),
});

exports.validarPutVaranda = validar(schemaPutVaranda);