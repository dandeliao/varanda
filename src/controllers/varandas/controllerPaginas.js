const asyncHandler 									= require('express-async-handler');
const customError	 								= require('http-errors');
const serviceRelacoes								= require('../../services/bichos/serviceRelacoes');
const servicePaginas								= require('../../services/varandas/servicePaginas');
const { params, objetoRenderizavel, quemEstaAgindo } = require('../../utils/utilControllers');
require('dotenv').config();

exports.getPagina = asyncHandler(async (req, res, next) => {
    
    const { varanda_id, pagina_id } = params(req);

    let usuarie_id = await quemEstaAgindo(req);

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

	const obj_render = await objetoRenderizavel(req, res, varanda_id, pagina_id, usuarie_id);
	res.render(view, obj_render);

});

exports.getEditarPagina = asyncHandler(async (req, res, next) => {
	
	/* é preciso pensar na relação entre pagina_id e a url da pagina. talvez usar url completa da pagina como id no banco de dados */

	const { varanda_id, pagina_id } = params(req);

	/* falta validar (validação putVaranda) */

    let view = 'blocos/editar';

	let usuarie_id = await quemEstaAgindo(req);

	if (usuarie_id !== varanda_id) {
		const permissoes = await serviceRelacoes.verRelacao(usuarie_id, varanda_id);
		if (!permissoes || !permissoes.editar) {
			req.flash('error', `Você não pode editar ${varanda_id}.`);
			return res.redirect(`/${varanda_id}/${pagina_id}`);
		}
	}

	let obj_render = await objetoRenderizavel(req, res, varanda_id, pagina_id, usuarie_id);
	const pagina = await servicePaginas.verPaginas(varanda_id, pagina_id);
	console.log('pagina:', pagina);
	obj_render.pagina.html = pagina.html;
	console.log('obj_render:', obj_render);

	res.render(view, obj_render);

});

exports.postPagina = asyncHandler(async (req, res, next) => {

});

exports.putPagina = asyncHandler(async (req, res, next) => {
    // fazer putPagina
});

exports.deletePagina = asyncHandler(async (req, res, next) => {

});