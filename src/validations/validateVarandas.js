const htmlInput = require('joi-html-input');
const Joi = require('joi').extend(htmlInput);
const palavrasReservadas = ['inicio', 'editar', 'clonar', 'futricar'];

// a fazer: usar palavrasReservadas para validacoes

const validar = (schema) => (payload) =>
	schema.validate(payload, { abortEarly: false });

const schemaPutVaranda = Joi.object({
	// aberta, bicho_id
	aberta: Joi.boolean().required(),
	bicho_id: Joi.string().min(1).max(32),
});

const schemaPostPagina = Joi.object({
	// titulo, publica, html, bicho_id
	titulo: Joi.string().max(32),
	publica: Joi.boolean(),
	html: Joi.htmlInput().allowedTags(),
	bicho_id: Joi.string().min(1).max(32)
});

const schemaPutPagina = Joi.object({
	// pagina_id, titulo, publica, ordem, html, bicho_id
	pagina_id: Joi.number().integer().required(),
	titulo: Joi.string().max(32),
	publica: Joi.boolean(),
	ordem: Joi.number().integer(),
	html: Joi.htmlInput().allowedTags(),
	bicho_id: Joi.string().min(1).max(32)
});

exports.validarPutVaranda = validar(schemaPutVaranda);
exports.schemaPostPagina = validar(schemaPostPagina);
exports.schemaPutPagina = validar(schemaPutPagina);