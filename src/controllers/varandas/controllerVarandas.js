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
const { validarPostPessoa, validarPutPessoa } 	= require('../../validations/validateBichos');
const { params, objetoRenderizavel }			= require('../../utils/utilControllers');
require('dotenv').config();

exports.getVaranda = asyncHandler(async (req, res, next) => { // params.bicho_id == varanda_id; query.bicho_id == usuarie_id

	const { varanda_id } = params(req);

	const view = `varandas/${varanda_id}/inicio`

	let usuarie_id;
	if (req.isAuthenticated()) {
		usuarie_id = req.user.bicho_id;
		if(req.query.bicho_id) {
			const permissoesBicho = await serviceRelacoes.verRelacao(usuarie_id, req.query.bicho_id);
			if (permissoesBicho.representar) usuarie_id = req.query.bicho_id;
		}
	}

	const obj_render = objetoRenderizavel(req, res, varanda_id, 'inicio', usuarie_id);
	res.render(view, obj_render);
	
});

exports.postVaranda = asyncHandler(async (req, res, next) => {

});

exports.putVaranda = asyncHandler(async (req, res, next) => { // :bicho_id

    
});

exports.deleteVaranda = asyncHandler(async (req, res, next) => { // :bicho_id

});