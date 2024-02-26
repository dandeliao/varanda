const asyncHandler 				                = require('express-async-handler');
const serviceComunidades 						= require('../services/bichos/serviceComunidades');
const serviceRelacoes 							= require('../services/bichos/serviceRelacoes');
const { params, quemEstaAgindo }            	= require('../utils/utilControllers');
require('dotenv').config();

exports.postParticipar = asyncHandler(async (req, res, next) => {
	
	const { varanda_id } = params(req);
	const usuarie_id = await quemEstaAgindo(req);

	const comunidade = await serviceComunidades.verComunidade(varanda_id);
	console.log(comunidade);
	if (!comunidade.participacao_livre) {
		req.flash('error', `A comunidade @${varanda_id} está com as inscrições fechadas.`);
	}

	await serviceRelacoes.criarRelacao(usuarie_id, varanda_id, {participar: true, editar: false, moderar: false, representar: false});

	req.flash('aviso', `Agora você está participando de @${varanda_id}`);
	res.redirect(`/${varanda_id}`);
});