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
	// pagina_vid, varanda_id, titulo, publica, html
	pagina_vid: Joi.string().required(),
	varanda_id: Joi.string().max(32),
	titulo: Joi.string().max(32),
	publica: Joi.boolean(),
	html: Joi.htmlInput().allowedTags()
});

exports.validarPutVaranda = validar(schemaPutVaranda);
exports.validarPostPagina = validar(schemaPostPagina);
exports.validarPutPagina = validar(schemaPutPagina);