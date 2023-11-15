const serviceEdicoes            = require('../../services/varandas/serviceEdicoes');
const servicePaginas            = require('../../services/varandas/servicePaginas');
const serviceBlocos				= require('../../services/varandas/serviceBlocos');
const serviceVarandas           = require('../../services/varandas/serviceVarandas');
const serviceRelacoes           = require('../../services/bichos/serviceRelacoes');
const asyncHandler 				= require('express-async-handler');
const customError	 			= require('http-errors');
require('dotenv').config();

exports.getEdicoes = asyncHandler(async (req, res, next) => { // ?pagina_id=idDaPagina&edicao_id=idDaEdicao (edicao_id opcional)
	let pagina_id	= req.query.pagina_id 	? req.query.pagina_id 	: null;
	let edicao_id   = req.query.edicao_id   ? req.query.edicao_id   : null;

	const varanda = await serviceVarandas.verVaranda(req.params.varanda_id);
	if (!varanda) throw customError(404, 'Varanda não encontrada.');

	const edicoes = await serviceEdicoes.verEdicoes(pagina_id, edicao_id);
	if (!edicoes) throw customError(404, 'Não foi possível encontrar edições correspondentes à busca.');

	res.status(200).json(edicoes);
});

exports.deleteEdicoes = asyncHandler(async (req, res, next) => { // ?pagina_id=idDaPagina&edicao_id=idDaEdicao&bicho_id (edicao_id e bicho_id opcionais) [reverte página para edição mais recente não deletada]
	let pagina_id	= req.query.pagina_id 	? req.query.pagina_id 	: null;
	let edicao_id   = req.query.edicao_id   ? req.query.edicao_id   : null;
    
	const varanda = await serviceVarandas.verVaranda(req.params.varanda_id);
	if (!varanda) throw customError(404, 'Varanda não encontrada.');
    
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

	const permissoesVaranda = await serviceRelacoes.verRelacao(bicho_id, varanda.bicho_id);
	if (!permissoesVaranda.representar) {
		const permissoesGlobais = await serviceRelacoes.verRelacao(bicho_id, process.env.INSTANCIA_ID);
		if (!permissoesGlobais.moderar) {
			throw customError(403, `O bicho @${bicho_id} não pode deletar as edições de @${varanda.bicho_id}.`);
		}
	}

	await serviceEdicoes.deletarEdicoes(pagina_id, edicao_id);
	const edicoesRestantes =  await serviceEdicoes.verEdicoes(pagina_id, null);
	const edicaoAtual = edicoesRestantes[0];

	// atualiza blocos em uso e atualiza html da pagina
	const blocos = await serviceBlocos.atualizarBlocosEmUso(edicaoAtual.html, req.query.pagina_id);
	const html = await serviceBlocos.atualizarHtml(edicaoAtual.html, blocos);

	const dados = {
		pagina_id: req.query.pagina_id,
		bicho_id: bicho_id,
		titulo: edicaoAtual.titulo,
		publica: edicaoAtual.publica,
		ordem: edicaoAtual.ordem,
		html: html
	};

	const paginaRevertida = await servicePaginas.editarPagina(varanda.varanda_id, dados);
	await serviceEdicoes.criarEdicao(bicho_id, paginaRevertida, html);
    
	res.status(204).end();
});