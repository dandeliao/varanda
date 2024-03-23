const Joi = require('joi');

exports.schemaPostArtefato = Joi.object().keys({
    artefato_pid: 		Joi.string().required(),
	varanda_id: 		Joi.string().max(32).required(),
	pagina_vid: 		Joi.string().required(),
	bicho_criador_id: 	Joi.string().max(32).required(),
	em_resposta_a_id: 	Joi.string().allow(null),
	nome_arquivo: 		Joi.string().max(255).allow(null),
	extensao: 			Joi.string().max(16).allow(null),
	descricao: 			Joi.string().allow(null),
	titulo: 			Joi.string().max(500).allow(null),
	texto: 				Joi.string().allow(null),
	sensivel: 			Joi.boolean(),
	respondivel: 		Joi.boolean(),
	indexavel: 			Joi.boolean(),
	denuncia: 			Joi.boolean()
});

exports.schemaPutArtefato = Joi.object().keys({
	pagina_vid: 	Joi.string().required(),
	descricao:		Joi.string().allow(null),
	titulo: 		Joi.string().max(500).allow(null),
	texto: 			Joi.string().allow(null),
	sensivel: 		Joi.boolean(),
	respondivel: 	Joi.boolean(),
	indexavel: 		Joi.boolean(),
	denuncia: 		Joi.boolean()
});