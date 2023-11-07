const serviceVarandas 			= require('../../services/varandas/serviceVarandas');
const serviceRelacoes 			= require('../../services/bichos/serviceRelacoes');
const { validarPutVaranda } 	= require('../../validations/validateVarandas');
const asyncHandler 				= require('express-async-handler');
const customError	 			= require('http-errors');

exports.getVarandas = asyncHandler(async (req, res, next) => { // ?bicho_id=idDoBicho&comunitaria=boolean&aberta=boolean (filtros opcionais)
	let bicho_id	= req.query.bicho_id 	? req.query.bicho_id 	: null;
	let comunitaria	= req.query.comunitaria	? req.query.comunitaria	: null;
	let aberta 		= req.query.aberta		? req.query.aberta		: null;

	const varandas = await serviceVarandas.verVarandas(bicho_id, comunitaria, aberta);
	if (!varandas) throw customError(404, 'Não foi possível encontrar varandas correspondentes à busca.');
	res.status(200).json(varandas);
});

exports.getVaranda = asyncHandler(async (req, res, next) => { // req.params.varanda_id
	const varanda = await serviceVarandas.verVaranda(req.params.varanda_id);
	if (!varanda) throw customError(404, `Varanda @${req.params.varanda_id} não encontrada.`);
	res.status(200).json(varanda);
});

exports.putVaranda = asyncHandler(async (req, res, next) => { // req.params.varanda_id && req.body = {aberta, bicho_id} (bicho_id é opcional. Por padrão usa req.user.bicho_id)
	const {erro, resultado} = validarPutVaranda(req.body);
	if (erro) {
		console.log(erro);
		return res.status(400).json(erro.details);
	}

	console.log(resultado);

	const varanda = await serviceVarandas.verVaranda(req.params.varanda_id);
	if (!varanda) throw customError(404, `Varanda @${req.params.varanda_id} não encontrada.`);

	let permissoesVaranda;
	if (req.body.bicho_id) {
		if (req.body.bicho_id !== req.user.bicho_id) {
			const permissoesBicho = await serviceRelacoes.verRelacao(req.user.bicho_id, req.body.bicho_id);
			if (!permissoesBicho.representar) throw customError(403, `O bicho @${req.user.bicho_id} não é representante do bicho @${req.body.bicho_id}`);
		}
		permissoesVaranda = await serviceRelacoes.verRelacao(req.body.bicho_id, varanda.bicho_id);
		if (!permissoesVaranda.representar) throw customError(403, `O bicho @${req.body.bicho_id} não é representante de @${varanda.bicho_id}`);
	} else {
		permissoesVaranda = await serviceRelacoes.verRelacao(req.user.bicho_id, varanda.bicho_id);
		if (!permissoesVaranda.representar) throw customError(403, `O bicho @${req.user.bicho_id} não é representante de @${varanda.bicho_id}.`);
	}

	const varandaEditada = await serviceVarandas.editarVaranda(req.params.varanda_id, { aberta: req.body.aberta });
	res.status(200).json(varandaEditada);
});