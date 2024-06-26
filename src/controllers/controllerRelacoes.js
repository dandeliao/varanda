const asyncHandler 				                = require('express-async-handler');
const serviceComunidades 						= require('../services/bichos/serviceComunidades');
const serviceRelacoes 							= require('../services/bichos/serviceRelacoes');
const { params, quemEstaAgindo }            	= require('../utils/utilControllers');
require('dotenv').config();

exports.postParticipar = asyncHandler(async (req, res, next) => {
	
	const { varanda_id } = params(req);
	const usuarie_id = await quemEstaAgindo(req);

	const comunidade = await serviceComunidades.verComunidade(varanda_id);
	if (!comunidade.participacao_livre) {
		req.flash('erro', `A comunidade @${varanda_id} está com as inscrições fechadas.`);
		return res.redirect(303, `/${varanda_id}`);
	}

	await serviceRelacoes.criarRelacao(usuarie_id, varanda_id, {participar: true, editar: false, moderar: false, representar: false});

	req.flash('aviso', `Agora você está participando de @${varanda_id}`);
	return  res.redirect(303, `/${varanda_id}`);
});

exports.putRelacao = asyncHandler(async (req, res, next) => {

});

exports.deleteRelacao = asyncHandler(async (req, res, next) => {
	const { varanda_id } = params(req);
	const usuarie_id = await quemEstaAgindo(req);

	if (varanda_id === process.env.INSTANCIA_ID) {
		req.flash('erro', `Você não pode deixar a varanda (*risada maligna*). Desculpe, não implementei ainda. Na verdade, não era pra ter essa opção na interface. Como você chegou aqui?`);
		return res.redirect(303, `/${varanda_id}/futricar`);
	}

	const relacao = await serviceRelacoes.verRelacao(usuarie_id, varanda_id);
	if (relacao.representar) {
		const equipe = await serviceRelacoes.verEquipe(varanda_id);
		if (equipe.representantes.length < 2) {
			req.flash('erro', `Você não pode sair da comunidade @${varanda_id}, pois ela ficaria sem representantes.`);
			return res.redirect(303, `/${varanda_id}/futricar`)
		}
	}

	await serviceRelacoes.deletarRelacao(usuarie_id, varanda_id);

	req.flash('aviso', `Você deixou de fazer parte de @${varanda_id}`);
	return res.redirect(303, `/${varanda_id}`);
});