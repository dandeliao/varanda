const asyncHandler 				                = require('express-async-handler');
const serviceBichos 							= require('../services/bichos/serviceBichos');
const serviceBichosPadrao 						= require('../services/bichos/serviceBichosPadrao');
const serviceComunidades 						= require('../services/bichos/serviceComunidades');
const serviceRelacoes 							= require('../services/bichos/serviceRelacoes');
const servicePaginasPadrao 						= require('../services/varandas/servicePaginasPadrao');
const servicePaginas							= require('../services/varandas/servicePaginas');
const serviceEdicoes							= require('../services/varandas/serviceEdicoes');
const { schemaPostComunidade, schemaPutBicho }	= require('../validations/validateBichos');
const { params, quemEstaAgindo, palavrasReservadas } = require('../utils/utilControllers');
const { messages } 								= require('joi-translation-pt-br');
require('dotenv').config();

exports.getVaranda = asyncHandler(async (req, res, next) => {

	const { varanda_id } = params(req);
	let redirectPage = `/${varanda_id}/inicio`;
	if (varanda_id === process.env.INSTANCIA_ID) {
		varandaExiste = await serviceBichos.verBicho(varanda_id);
		if (!varandaExiste) {
			redirectPage = '/autenticacao/cadastro';
		}
	}
	return res.redirect(redirectPage);
});

exports.postVaranda = asyncHandler(async (req, res, next) => {

	const usuarie_id = await quemEstaAgindo(req);
	const arroba = req.body.arroba ? req.body.arroba : null;
	const bicho = {
		bicho_id:			arroba,
		nome: 				req.body.nome 		? req.body.nome 		: arroba,
		descricao:			req.body.descricao	? req.body.descricao	: '',
		bicho_criador_id:	usuarie_id
	};

	const { error, value } = schemaPostComunidade.validate(bicho, { messages });
	if (error) {
		console.log(error.details);
		req.flash('erro', `Erro ao validar as informações da nova comunidade. Detalhes: ${error.details[0].message}`);
		return res.redirect(303, '/criar-comunidade');
	}

	if (palavrasReservadas().includes(bicho.bicho_id)) {
		req.flash('erro', `Você não pode criar um bicho com o nome de perfil @${bicho.bicho_id}.`);
		return res.redirect(303, `/criar-comunidade`);
	}

	const bichoExiste = await serviceBichos.verBicho(req.body.bicho_id);
	if (bichoExiste) {
		req.flash('erro', `O bicho @${req.body.bicho_id} já existe. Por favor, escolha outra arroba.`);
		return res.redirect(303, '/criar-comunidade');
	}

	const comunidade = await serviceComunidades.criarComunidade(bicho, bicho.bicho_criador_id);

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
	await serviceRelacoes.criarRelacao(usuarie_id, novaComunidade.bicho_id, {participar: true, editar: true, moderar: true, representar: true});

	// cria relação entre a comunidade e a instância, com a habilidade de participar
	await serviceRelacoes.criarRelacao(novaComunidade.bicho_id, process.env.INSTANCIA_ID, {participar: true, editar: false, moderar: false, representar: false});

	// cria página inicial da comunidade, com página padrão
	const comunitaria = true;
	let paginaPadrao = {};
	paginaPadrao = await servicePaginasPadrao.gerarPaginaPadrao(comunitaria);
	paginaPadrao.pagina_vid = `${comunidade.bicho_id}/inicio`;
	const novaPagina = await servicePaginas.criarPagina(comunidade.bicho_id, paginaPadrao);
	await serviceEdicoes.criarEdicao(comunidade.bicho_id, novaPagina, paginaPadrao.html);

	// cria páginas temáticas
	const temas = ['Geral','Off-topic'];
	for (let tema of temas) {
		let paginaTema = {}
		paginaTema = await servicePaginasPadrao.gerarPaginaTematica(tema, comunitaria);
		paginaTema.pagina_vid = `${comunidade.bicho_id}/${tema.toLowerCase()}`;
		const novaPaginaTema = await servicePaginas.criarPagina(comunidade.bicho_id, paginaTema);
		await serviceEdicoes.criarEdicao(comunidade.bicho_id, novaPaginaTema, paginaTema.html);
	}

	req.flash('aviso', 'Comunidade criada com sucesso!');
	return res.redirect(303, `/${comunidade.bicho_id}`);

});

exports.putVaranda = asyncHandler(async (req, res, next) => {
    
	const arquivo_avatar = req.files.avatar ? req.files.avatar[0] : null;
	const arquivo_fundo  = req.files.fundo  ? req.files.fundo[0]  : null;

	const { varanda_id, pagina_id } = params(req);
	let bichoOriginal = await serviceBichos.verBicho(varanda_id);
	const comunidade = await serviceComunidades.verComunidade(varanda_id);
	if (comunidade) {
		bichoOriginal.participacao_livre = comunidade.participacao_livre,
		bichoOriginal.participacao_com_convite = comunidade.participacao_com_convite
	}

	let bicho = {
		nome: 						req.body.nome 								? req.body.nome 			: bichoOriginal.nome,
		descricao:					req.body.descricao 							? req.body.descricao 		: bichoOriginal.descricao,
		descricao_avatar:			req.body.descricao_avatar 					? req.body.descricao_avatar : '',
		descricao_fundo:			req.body.descricao_fundo 					? req.body.descricao_fundo 	: '',
		participacao_livre: 		req.body.participacao_livre				 	? true 						: false,
		participacao_com_convite:	req.body.participacao_com_convite 			? true 						: false
	}

	const { error, value } = schemaPutBicho.validate(bicho, { messages });
	if (error) {
	    req.flash('erro', `Erro ao validar as informações. Detalhes: ${error.details[0].message}`);
        return res.redirect(303, `/${varanda_id}`);
	}
	
	let usuarie_id = await quemEstaAgindo(req);

	if (usuarie_id !== varanda_id) {
		const permissoes = await serviceRelacoes.verRelacao(usuarie_id, varanda_id);
		if (!permissoes || !permissoes.representar) {
			req.flash('erro', `Você não pode editar o perfil de ${varanda_id}.`);
			return res.redirect(303, `/${varanda_id}`);
		}
	}

	if (arquivo_avatar) {
		let dadosArquivo = await serviceBichos.subirAvatar(varanda_id, arquivo_avatar);
		if (!dadosArquivo) {
			req.flash('erro', 'Houve um erro ao carregar o arquivo. Por favor, tente novamente.');
			return res.redirect(303, `/${varanda_id}/editar-bicho`);
		}
		bicho.avatar = dadosArquivo.nome;
	}
	
	if (arquivo_fundo) {
		let dadosArquivo = await serviceBichos.subirFundo(varanda_id, arquivo_fundo);
		if (!dadosArquivo) {
			req.flash('erro', 'Houve um erro ao carregar o arquivo. Por favor, tente novamente.');
			return res.redirect(303, `/${varanda_id}/editar-bicho`);
		}
		bicho.fundo = dadosArquivo.nome;
	}

	await serviceBichos.editarBicho(varanda_id, bicho);
	if (comunidade) await serviceComunidades.editarComunidade(varanda_id, bicho);

	req.flash('aviso', 'O perfil foi editado com sucesso!');
	return res.redirect(303, `/${varanda_id}`);
});

exports.deleteVaranda = asyncHandler(async (req, res, next) => {

	const { varanda_id, pagina_id } = params(req);
	let usuarie_id = await quemEstaAgindo(req);

	if (usuarie_id !== varanda_id) {
		const permissoes = await serviceRelacoes.verRelacao(usuarie_id, varanda_id);
		if (!permissoes.representar) {
			const permissoesGlobais = await serviceRelacoes.verRelacao(usuarie_id, process.env.INSTANCIA_ID);
			if (!permissoesGlobais.moderar) {
				req.flash('erro', `O bicho @${req.user.bicho_id} não pode deletar @${varanda_id}. Procure representantes da comunidade ou a equipe de moderação da instância.`)
				res.redirect(303, `/varandas/${varanda_id}`);
			}
		}
	}
	await serviceBichos.deletarBicho(varanda_id);
	req.flash('aviso', `@${varanda_id} deletada com sucesso.`);
	res.redirect(303, `/`);
});