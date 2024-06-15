const Joi = require('joi');
const rgx_arroba 	= /^[A-Za-z0-9_-]+$/;

exports.schemaPostPessoa = Joi.object().keys({
	// bicho_id, nome, email, senha, convite_id
	bicho_id: Joi.string().min(3).max(32).pattern(rgx_arroba).required(),
	email: Joi.string().email().allow(null, ''),
	senha: Joi.string().min(8).required(),
	confirma_senha: Joi.string().valid(Joi.ref('senha')).required(),
	convite_id: Joi.string().guid().allow(null, '')
});

exports.schemaPutPessoa = Joi.object().keys({
	// nome, descricao, descricao_avatar, descricao_fundo, email, senha
	nome: Joi.string().max(64),
	descricao: Joi.string().max(500).allow(null, ''),
	descricao_avatar: Joi.string().max(500).allow(null, ''),
	descricao_fundo: Joi.string().max(500).allow(null, ''),
	email: Joi.string().email(),
	senha: Joi.string().min(8)
});

exports.schemaPostComunidade = Joi.object().keys({
	// bicho_id, nome, descricao, bicho_criador_id
	bicho_id: Joi.string().min(1).max(32).pattern(rgx_arroba).required(),
	nome: Joi.string().max(64),
	descricao: Joi.string().max(500).allow(null, ''),
	bicho_criador_id: Joi.string().min(1).max(32).required()
});

exports.schemaPutComunidade = Joi.object().keys({
	// participacao_livre, participacao_com_convite, periodo_geracao_convite
	participacao_livre: Joi.boolean(),
	participacao_com_convite: Joi.boolean(),
	periodo_geracao_convite: Joi.number().integer()
});

exports.schemaPutBicho = Joi.object().keys({
	// nome, descricao, descricao_avatar, descricao_fundo
	nome: Joi.string().max(64),
	descricao: Joi.string().max(500).allow(null, ''),
	descricao_avatar: Joi.string().max(500).allow(null, ''),
	descricao_fundo: Joi.string().max(500).allow(null, ''),
	participacao_livre: Joi.boolean(),
	participacao_com_convite: Joi.boolean()
});

exports.schemaPutAvatar = Joi.object().keys({
	// descricao_avatar
	descricao_avatar: Joi.string().min(0).max(1000)
});

exports.schemaPutFundo = Joi.object().keys({
	// descricao_fundo
	descricao_fundo: Joi.string().min(0).max(1000)
});

exports.schemaPutPreferencias = Joi.object().keys({
	// número do tema
	tema: Joi.number().integer().min(0).max(3).required()
});

exports.schemaPostConvite = Joi.object().keys({
	// comunidade_id, bicho_criador_id
	comunidade_id: Joi.string().min(1).max(32).required(),
	bicho_criador_id: Joi.string().min(1).max(32)
});

exports.schemaDeleteConvite = Joi.object().keys({
	// convite_id
	convite_id: Joi.string().guid().required()
});

exports.schemaPostRelacao = Joi.object().keys({
	// comunidade_id, convite_id
	comunidade_id: Joi.string().min(1).max(32).pattern(rgx_arroba).required(),
	convite_id: Joi.string().guid()
});

exports.schemaPutRelacao = Joi.object().keys({
	// comunidade_id, participar, editar, moderar, representar
	comunidade_id: Joi.string().min(1).max(32).pattern(rgx_arroba).required(),
	participar: Joi.boolean(),
	editar: Joi.boolean(),
	moderar: Joi.boolean(),
	representar: Joi.boolean()
});

exports.schemaDeleteRelacao = Joi.object().keys({
	// comunidade_id
	comunidade_id: Joi.string().min(1).max(32).pattern(rgx_arroba).required()
});

exports.schemaPostRecuperar = Joi.object().keys({
	// recuperacao_id
	recuperacao_id: Joi.string().guid().required()
});

exports.schemaPutRecuperar = Joi.object().keys({
	// recuperacao_id, senha
	recuperacao_id: Joi.string().guid().required(),
	senha: Joi.string().min(8).required()
});