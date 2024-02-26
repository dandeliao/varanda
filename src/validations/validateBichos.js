const Joi = require('joi');
const { messages } = require('joi-translation-pt-br');

const validar = (schema) => (payload) =>
	schema.validate(payload, { abortEarly: false, messages: messages });

const schemaPostPessoa = Joi.object({
	// bicho_id, nome, email, senha, convite_id
	bicho_id: Joi.string().min(3).max(32).required(),
	email: Joi.string().email(),
	senha: Joi.string().min(8).required(),
	confirma_senha: Joi.string().valid(Joi.ref('senha')).required(),
	convite_id: Joi.string().guid().required()
});

const schemaPutPessoa = Joi.object({
	// nome, descricao, descricao_avatar, descricao_fundo, email, senha
	nome: Joi.string().max(64),
	descricao: Joi.string().max(500),
	descricao_avatar: Joi.string().max(500),
	descricao_fundo: Joi.string().max(500),
	email: Joi.string().email(),
	senha: Joi.string().min(8)
});

const schemaPostComunidade = Joi.object({
	// bicho_id, nome, descricao, bicho_criador_id
	bicho_id: Joi.string().min(1).max(32).required(),
	nome: Joi.string().max(64),
	descricao: Joi.string().max(500),
	bicho_criador_id: Joi.string().min(1).max(32)
});

const schemaPutComunidade = Joi.object({
	// participacao_livre, participacao_com_convite, periodo_geracao_convite
	participacao_livre: Joi.boolean(),
	participacao_com_convite: Joi.boolean(),
	periodo_geracao_convite: Joi.number().integer()
});

const schemaPutBicho = Joi.object({
	// nome, descricao, descricao_avatar, descricao_fundo
	nome: Joi.string().max(64),
	descricao: Joi.string().max(500),
	descricao_avatar: Joi.string().max(500),
	descricao_fundo: Joi.string().max(500),
	participacao_livre: Joi.boolean(),
	participacao_com_convite: Joi.boolean()
});

const schemaPutAvatar = Joi.object({
	// descricao_avatar
	descricao_avatar: Joi.string().max(500)
});

const schemaPutFundo = Joi.object({
	// descricao_fundo
	descricao_fundo: Joi.string().max(500)
});

const schemaPostConvite = Joi.object({
	// comunidade_id, bicho_criador_id
	comunidade_id: Joi.string().min(1).max(32).required(),
	bicho_criador_id: Joi.string().min(1).max(32)
});

const schemaDeleteConvite = Joi.object({
	// convite_id
	convite_id: Joi.string().guid().required()
});

const schemaPostRelacao = Joi.object({
	// comunidade_id, convite_id
	comunidade_id: Joi.string().min(1).max(32).required(),
	convite_id: Joi.string().guid()
});

const schemaPutRelacao = Joi.object({
	// comunidade_id, participar, editar, moderar, representar
	comunidade_id: Joi.string().min(1).max(32).required(),
	participar: Joi.boolean(),
	editar: Joi.boolean(),
	moderar: Joi.boolean(),
	representar: Joi.boolean()
});

const schemaDeleteRelacao = Joi.object({
	// comunidade_id
	comunidade_id: Joi.string().min(1).max(32).required()
});

const schemaPostRecuperar = Joi.object({
	// recuperacao_id
	recuperacao_id: Joi.string().guid().required()
});

const schemaPutRecuperar = Joi.object({
	// recuperacao_id, senha
	recuperacao_id: Joi.string().guid().required(),
	senha: Joi.string().min(8).required()
});

exports.validarPostPessoa       = validar(schemaPostPessoa);
exports.validarPutPessoa        = validar(schemaPutPessoa);
exports.validarPostComunidade   = validar(schemaPostComunidade);
exports.validarPutComunidade    = validar(schemaPutComunidade);
exports.validarPutBicho         = validar(schemaPutBicho);
exports.validarPutAvatar        = validar(schemaPutAvatar);
exports.validarPutFundo         = validar(schemaPutFundo);
exports.validarPostConvite      = validar(schemaPostConvite);
exports.validarDeleteConvite    = validar(schemaDeleteConvite);
exports.validarPostRelacao      = validar(schemaPostRelacao);
exports.validarPutRelacao       = validar(schemaPutRelacao);
exports.validarDeleteRelacao    = validar(schemaDeleteRelacao);
exports.validarPostRecuperar    = validar(schemaPostRecuperar);
exports.validarPutRecuperar     = validar(schemaPutRecuperar);