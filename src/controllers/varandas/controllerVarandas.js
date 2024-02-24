const asyncHandler 				                = require('express-async-handler');
const customError	 			                = require('http-errors');
const servicePessoas 							= require('../../services/bichos/servicePessoas');
const serviceBichos 							= require('../../services/bichos/serviceBichos');
const serviceBichosPadrao 						= require('../../services/bichos/serviceBichosPadrao');
const serviceConvites 							= require('../../services/bichos/serviceConvites');
const serviceComunidades 						= require('../../services/bichos/serviceComunidades');
const serviceRelacoes 							= require('../../services/bichos/serviceRelacoes');
const serviceVarandas 							= require('../../services/varandas/serviceVarandas');
const servicePaginasPadrao 						= require('../../services/varandas/servicePaginasPadrao');
const servicePaginas							= require('../../services/varandas/servicePaginas');
const serviceEdicoes							= require('../../services/varandas/serviceEdicoes');
const { params, objetoRenderizavel, quemEstaAgindo }	= require('../../utils/utilControllers');
require('dotenv').config();

exports.getVaranda = asyncHandler(async (req, res, next) => { // params.bicho_id == varanda_id; query.bicho_id == usuarie_id

	const { varanda_id } = params(req);
	const view = `varandas/${varanda_id}/inicio`
	const usuarie_id = await quemEstaAgindo(req);
	const obj_render = await objetoRenderizavel(req, res, varanda_id, 'inicio', usuarie_id);
	res.render(view, obj_render);
	
});

exports.getFutricarVaranda = asyncHandler(async (req, res, next) => {

	const { varanda_id } = params(req);
	const pagina_id = 'futricar';
    let view = 'blocos/futricar';
	let usuarie_id = await quemEstaAgindo(req);

	if (usuarie_id !== varanda_id) {
		const permissoes = await serviceRelacoes.verRelacao(usuarie_id, varanda_id);
		if (!permissoes || !permissoes.participar) {
			req.flash('error', `Você não pode futricar ${varanda_id}.`);
			return res.redirect(`/${varanda_id}`);
		}
	}

	let obj_render = await objetoRenderizavel(req, res, varanda_id, pagina_id, usuarie_id);
	const paginas = await servicePaginas.verPaginas(varanda_id);
	obj_render.bloco.paginas = paginas;

	res.render(view, obj_render);

});

exports.postVaranda = asyncHandler(async (req, res, next) => {

});

exports.putVaranda = asyncHandler(async (req, res, next) => { // :bicho_id

    
});

exports.deleteVaranda = asyncHandler(async (req, res, next) => { // :bicho_id

});