const servicePaginas                            = require('../../services/varandas/servicePaginas');
const serviceEdicoes                            = require('../../services/varandas/serviceEdicoes');
const serviceBlocos								= require('../../services/varandas/serviceBlocos');
const serviceVarandas                           = require('../../services/varandas/serviceVarandas');
const serviceRelacoes                           = require('../../services/bichos/serviceRelacoes');
const { validarPostPagina, validarPutPagina }   = require('../../validations/validateVarandas');
const asyncHandler 				                = require('express-async-handler');
const customError	 			                = require('http-errors');
const path 						                = require('path');
require('dotenv').config();

exports.getPaginas = asyncHandler(async (req, res, next) => { // ?pagina_id=idDaPagina&publica=boolean (filtros opcionais)
	let pagina_id	= req.query.pagina_id 	? req.query.pagina_id 	: null;
	let publica 	= req.query.publica 	? req.query.publica 	: null;

	const varanda = await serviceVarandas.verVaranda(req.params.varanda_id);
	if (!varanda) throw customError(404, 'Varanda não encontrada.');

	const paginas = await servicePaginas.verPaginas(req.params.varanda_id, pagina_id, publica);
	if (!paginas) throw customError(404, 'Não foi possível encontrar páginas correspondentes à busca.');

	res.status(200).json(paginas);
});

exports.getPagina = asyncHandler(async (req, res, next) => { // ?pagina_id=idDaPagina
	let pagina_id = req.query.pagina_id     ? req.query.pagina_id   : null;

	const varanda = await serviceVarandas.verVaranda(req.params.varanda_id);
	if (!varanda) throw customError(404, 'Varanda não encontrada.');

	const pagina = await servicePaginas.verPaginas(req.params.varanda_id, pagina_id);
	if (!pagina) throw customError(404, 'Página não encontrada.');

	const html = path.join(path.resolve(__dirname, '../../../static'), 'varandas', 'em_uso', varanda.varanda_id, pagina_id);
	res.sendFile(html);
});

exports.postPagina = asyncHandler(async (req, res, next) => { // req.body = {titulo, publica, html, bicho_id} (bicho_id é opcional. Por padrão, bicho_id = req.user.bicho_id ) [adiciona versão inicial como 1a edição]
    
	const { erro, resultado } = validarPostPagina(req.body);
	if (erro) {
		console.log(erro);
		return res.status(400).json(erro.details);
	}
    
	let bicho_id;
	if (!req.body.bicho_id) {
		bicho_id = req.user.bicho_id;
	} else {
		if (req.body.bicho_id !== req.user.bicho_id) {
			const relacao = await serviceRelacoes.verRelacao(req.user.bicho_id, req.body.bicho_id);
			if (!relacao.representar) throw customError(403, `O bicho @${req.user.bicho_id} não pode representar o bicho @${req.body.bicho_id}`);
		}
		bicho_id = req.body.bicho_id;
	}

	const varanda = await serviceVarandas.verVaranda(req.params.varanda_id);
	const relacaoComVaranda = await serviceRelacoes.verRelacao(bicho_id, varanda.bicho_id);
	if (!relacaoComVaranda.editar) throw customError(403, `O bicho @${bicho_id} não pode editar a varanda de @${varanda.bicho_id}`);

	const novaPagina = await servicePaginas.criarPagina(varanda.varanda_id, req.body);

	const blocos = await serviceBlocos.atualizarBlocosEmUso(req.body.html, novaPagina.pagina_id);
	const html = await serviceBlocos.atualizarHtml(req.body.html, blocos);

	const dados = {
		titulo: req.body.titulo,
		publica: req.body.publica,
		html: html
	};

	const paginaFinal = await servicePaginas.editarPagina(novaPagina.pagina_id, dados);

	// cria a primeira edição da página, com os dados da página criada
	await serviceEdicoes.criarEdicao(bicho_id, paginaFinal, html);

	res.status(201).json(paginaFinal);
});

exports.putPagina = asyncHandler(async (req, res, next) => { // req.body = {pagina_id, titulo, publica, ordem, html, bicho_id} (bicho_id é opcional. Por padrão, bicho_id = req.user.bicho_id) [adiciona edição ao banco de dados]
	const { erro, resultado } = validarPutPagina(req.body);
	if (erro) {
		console.log(erro);
		return res.status(400).json(erro.details);
	}

	let bicho_id;
	if (!req.body.bicho_id) {
		bicho_id = req.user.bicho_id;
	} else {
		if (req.body.bicho_id !== req.user.bicho_id) {
			const relacao = await serviceRelacoes.verRelacao(req.user.bicho_id, req.body.bicho_id);
			if (!relacao.representar) throw customError(403, `O bicho @${req.user.bicho_id} não pode representar o bicho @${req.body.bicho_id}`);
		}
		bicho_id = req.body.bicho_id;
	}

	const varanda = await serviceVarandas.verVaranda(req.params.varanda_id);
	const relacaoComVaranda = await serviceRelacoes.verRelacao(bicho_id, varanda.bicho_id);
	if (!relacaoComVaranda.editar) throw customError(403, `O bicho @${bicho_id} não pode editar as páginas de @${varanda.bicho_id}`);  

	const blocos = await serviceBlocos.atualizarBlocosEmUso(req.body.html, req.params.pagina_id);
	const html = await serviceBlocos.atualizarHtml(req.body.html, blocos);

	const dados = {
		pagina_id: req.body.pagina_id,
		titulo: req.body.titulo,
		publica: req.body.publica,
		ordem: req.body.ordem,
		html: html
	};

	const paginaEditada = await servicePaginas.editarPagina(varanda.varanda_id, dados);
	await serviceEdicoes.criarEdicao(bicho_id, paginaEditada, html);

	res.status(200).json(paginaEditada);

});

exports.deletePagina = asyncHandler(async (req, res, next) => { // ?pagina_id=idDaPagina&bicho_id=idDoBicho (bicho_id é opcional. Por padrão, bicho_id = req.user.bicho_id)
	let bicho_id;
	if (!req.body.bicho_id) {
		bicho_id = req.user.bicho_id;
	} else {
		if (req.query.bicho_id !== req.user.bicho_id) {
			const relacao = await serviceRelacoes.verRelacao(req.user.bicho_id, req.query.bicho_id);
			if (!relacao.representar) throw customError(403, `O bicho @${req.user.bicho_id} não pode representar o bicho @${req.query.bicho_id}`);
		}
		bicho_id = req.query.bicho_id;
	}

	const varanda = await serviceVarandas.verVaranda(req.params.varanda_id);
	const relacaoComVaranda = await serviceRelacoes.verRelacao(bicho_id, varanda.bicho_id);
	if (!relacaoComVaranda.editar) throw customError(403, `O bicho @${bicho_id} não pode deletar as páginas de @${varanda.bicho_id}`);

	await servicePaginas.deletarPagina(req.query.pagina_id);
	res.status(204).end();
});