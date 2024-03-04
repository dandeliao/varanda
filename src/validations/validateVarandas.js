const htmlInput = require('joi-html-input');
const Joi = require('joi').extend(htmlInput);
const palavrasReservadas = ['inicio', 'editar', 'clonar', 'futricar'];

// a fazer: usar palavrasReservadas para validacoes

exports.schemaPutVaranda = Joi.object().keys({
	// aberta, bicho_id
	aberta: Joi.boolean().required(),
	bicho_id: Joi.string().min(1).max(32),
});

exports.schemaPostPagina = Joi.object().keys({
	// titulo, publica, html, bicho_id
	varanda_id: Joi.string().max(32),
	titulo: Joi.string().min(1).max(32),
	publica: Joi.boolean(),
	html: Joi.htmlInput().allowedTags(),
});

exports.schemaPutPagina = Joi.object().keys({
	// pagina_vid, varanda_id, titulo, publica, html
	pagina_vid: Joi.string().required(),
	varanda_id: Joi.string().max(32),
	titulo: Joi.string().max(32),
	publica: Joi.boolean(),
	html: Joi.htmlInput().allowedTags()
});