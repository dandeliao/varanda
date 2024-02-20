const asyncHandler 							= require('express-async-handler');
const customError	 						= require('http-errors');
const serviceRelacoes						= require('../../services/bichos/serviceRelacoes');
const { params, renderiza, bicho_agente }	= require('../../utils/utilControllers');
require('dotenv').config();

exports.getPagina = asyncHandler(async (req, res, next) => {
    
    const { varanda_id, pagina_id } = params(req);

    let usuarie_id = await bicho_agente(req);

	let view;
	switch (pagina_id) {
		case 'clonar':
		case 'bisbilhotar':
			view = `blocos/${pagina_id}`;
			break;
		default:
			view = `varandas/${varanda_id}/${pagina_id}`;
			break;
	}

	renderiza(req, res, varanda_id, pagina_id, usuarie_id, view);

});

exports.getEditarPagina = asyncHandler(async (req, res, next) => {
	
	const { varanda_id, pagina_id } = params(req);

    let view = 'blocos/editar';

	let usuarie_id = await bicho_agente(req);

	if (usuarie_id !== varanda_id) {
		const permissoes = await serviceRelacoes.verRelacao(usuarie_id, varanda_id);
		if (!permissoes || !permissoes.editar) {
			req.flash('message', `Você não pode editar ${varanda_id}.`);
			return res.redirect(`/${varanda_id}`);
		}
	}

	renderiza(req, res, varanda_id, pagina_id, usuarie_id, view);

});

exports.postPagina = asyncHandler(async (req, res, next) => {
    
});

exports.putPagina = asyncHandler(async (req, res, next) => {
    
});

exports.deletePagina = asyncHandler(async (req, res, next) => {
    
});