const serviceComunidades = require('../../services/bichos/serviceComunidades');
const serviceRelacoes = require('../../services/bichos/serviceRelacoes');
const serviceBichos =  require('../../services/bichos/serviceBichos');
const serviceBichosPadrao = require('../../services/bichos/serviceBichosPadrao');
const asyncHandler = require('express-async-handler');
const customError = require('http-errors');
require('dotenv').config();

exports.getComunidades = asyncHandler(async (req, res, next) => {
	const comunidades = await serviceComunidades.verComunidades();
	res.status(200).json(comunidades);
});

exports.getComunidade = asyncHandler(async (req, res, next) => {
	const comunidade = await serviceComunidades.verComunidade(req.params.arroba);
	if (!comunidade) throw customError(404, `Comunidade @${req.params.arroba} não encontrada.`);
	res.status(200).json(comunidade);
});

exports.postComunidade = asyncHandler(async (req, res, next) => { // req.body = {bicho_id, nome, descricao, bicho_criador_id}

	console.log(req.body.bicho_id);
	const bichoExiste = await serviceBichos.verBicho(req.body.bicho_id);
	console.log(bichoExiste);
	if (bichoExiste) throw customError(409, `O apelido @${req.body.bicho_id} já existe. Por favor, escolha outro apelido.`);

	let bichoCriadorId = req.user.bicho_id;
	if (req.body.bicho_criador_id) {
		const permissoes = await serviceRelacoes.verRelacao(req.user.bicho_id, req.body.bicho_criador_id);
		if (!permissoes.representar) {
			throw customError(403, `O bicho @${req.user.bicho_id} não pode criar comunidades em nome de ${req.body.bicho_criador_id}. Procure representantes da comunidade.`);
		}
		bichoCriadorId = req.body.bicho_criador_id;
	}

	console.log(bichoCriadorId);

	const comunidade = await serviceComunidades.criarComunidade(req.body, bichoCriadorId);

	// adiciona avatar e fundo padrão
	const bichoPadrao = await serviceBichosPadrao.sortearBichoPadrao();
	const novaComunidade = await serviceBichos.editarBicho(comunidade.bicho_id, {
		//descricao: bichoPadrao.descricao,
		avatar: 'avatar.jpg',
		descricao_avatar: bichoPadrao.descricao_avatar,
		fundo: 'fundo.jpg',
		descricao_fundo: bichoPadrao.descricao_fundo
	});
	await serviceBichos.copiarAvatar(novaComunidade.bicho_id, `${serviceBichosPadrao.caminhoAvatarPadrao}/${bichoPadrao.avatar}`, novaComunidade.avatar);
	await serviceBichos.copiarFundo(novaComunidade.bicho_id, `${serviceBichosPadrao.caminhoFundoPadrao}/${bichoPadrao.fundo}`, novaComunidade.fundo);
	
	// cria relação entre o bicho criador e a comunidade, com todas as habilidades (participar, editar, moderar e representar)
	const bichoCriador = req.body.bicho_criador_id ? req.body.bicho_criador_id : req.user.bicho_id;
	await serviceRelacoes.criarRelacao(bichoCriador, novaComunidade.bicho_id, {participar: true, editar: true, moderar: true, representar: true});
	res.status(201).json(novaComunidade);
});

exports.putComunidade = asyncHandler(async (req, res, next) => { // req.body = {participacao_livre, participacao_com_convite, periodo_geracao_convite}
	const permissoes = await serviceRelacoes.verRelacao(req.user.bicho_id, req.params.arroba);
	if (!permissoes.moderar) {
		throw customError(403, `O bicho @${req.user.bicho_id} não pode alterar as opções de entrada na comunidade ${req.params.arroba}. Procure a equipe de moderação da comunidade.`);
	}
	const comunidade = await serviceComunidades.editarComunidade(req.params.arroba, req.body);
	console.log(comunidade);
	res.status(200).json(comunidade);
});

exports.deleteComunidade = asyncHandler (async (req, res, next) => {
	const permissoes = await serviceRelacoes.verRelacao(req.user.bicho_id, req.params.arroba);
	if (!permissoes.representar) {
		const permissoesGlobais = await serviceRelacoes.verRelacao(req.user.bicho_id, process.env.INSTANCIA_ID);
		if (!permissoesGlobais.moderar) {
			throw customError(403, `O bicho @${req.user.bicho_id} não pode deletar a comunidade ${req.params.arroba}. Procure representantes da comunidade ou a equipe de moderação da instância.`);
		}
	}
	await serviceComunidades.deletarComunidade(req.params.arroba);
	res.status(204).end();
});