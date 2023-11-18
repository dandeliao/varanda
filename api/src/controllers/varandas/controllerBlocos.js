const serviceBlocos             = require('../../services/varandas/serviceBlocos');
const asyncHandler 				= require('express-async-handler');
const customError	 			= require('http-errors');
require('dotenv').config();

exports.getBlocos = asyncHandler(async (req, res, next) => { // ?comunitario=boolean (opcional)
	let comunitario = req.query.comunitario ? req.query.comunitario : null;

	const blocos = await serviceBlocos.verBlocos(comunitario);
	if (!blocos) throw customError(404, 'Não foi possível encontrar blocos correspondentes à busca.');
	res.status(200).json(blocos);
});

exports.getBloco = asyncHandler(async (req, res, next) => { // ?bloco_id=IdDoBloco
	if (!req.query.bloco_id) throw customError(404, 'Falta o id do bloco.');
	const bloco = await serviceBlocos.verBloco(req.query.IdDoBloco);
	if (!bloco) throw customError(404, 'Não foi possível encontrar o bloco.');
	res.status(200).json(bloco);
});

exports.getBlocosEmUso = asyncHandler(async (req, res, next) => { // ?pagina_id=idDaPagina
	if (!req.query.pagina_id) throw customError(404, 'Falta o id da página.');
	const blocos = await serviceBlocos.verBlocosEmUso(req.query.pagina_id);
	res.status(200).json(blocos);
});