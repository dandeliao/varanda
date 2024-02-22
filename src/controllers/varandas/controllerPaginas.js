const asyncHandler 									= require('express-async-handler');
const customError	 								= require('http-errors');
const serviceRelacoes								= require('../../services/bichos/serviceRelacoes');
const servicePaginas								= require('../../services/varandas/servicePaginas');
const { params, objetoRenderizavel, bicho_agente }	= require('../../utils/utilControllers');
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

	const obj_render = objetoRenderizavel(req, res, varanda_id, pagina_id, usuarie_id);
	res.render(view, obj_render);

});

exports.getEditarPagina = asyncHandler(async (req, res, next) => {
	
	const { varanda_id, pagina_id } = params(req);

	/* falta validar (validação putVaranda) */

    let view = 'blocos/editar';

	let usuarie_id = await bicho_agente(req);

	if (usuarie_id !== varanda_id) {
		const permissoes = await serviceRelacoes.verRelacao(usuarie_id, varanda_id);
		if (!permissoes || !permissoes.editar) {
			req.flash('error', `Você não pode editar ${varanda_id}.`);
			return res.redirect(`/${varanda_id}/${pagina_id}`);
		}
	}

	//let pagina = await servicePaginas.verPaginas(varanda_id, pagina_id);

	let obj_render = objetoRenderizavel(req, res, varanda_id, pagina_id, usuarie_id);
	//obj_render.pagina.html = pagina.html;

	res.render(view, obj_render);

});

exports.postPagina = asyncHandler(async (req, res, next) => {
    
});

exports.putPagina = asyncHandler(async (req, res, next) => {
    
});

exports.deletePagina = asyncHandler(async (req, res, next) => {
    
});