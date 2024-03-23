const asyncHandler = require('express-async-handler');
const { objetoRenderizavel, objetoRenderizavelBloco, quemEstaAgindo } 	= require('../utils/utilControllers');
require('dotenv').config();

exports.getBloco = asyncHandler(async (req, res, next) => {

    const bloco_id = req.params.bloco_id;
    const view = `blocos/${bloco_id}`;

    const varanda_id = req.query.varanda ? req.query.varanda : null;
	const pagina_id	 = req.query.pagina ? req.query.pagina : null;
	const artefato_id = req.query.artefato ? req.query.artefato : null;

	const usuarie_id = await quemEstaAgindo(req);

	let obj_render = await objetoRenderizavel(req, res, varanda_id, pagina_id, usuarie_id, false);
	if (varanda_id && pagina_id && artefato_id) {
		obj_render.artefato_pid = `${varanda_id}/${pagina_id}/${artefato_id}`;
	}
	obj_render = await objetoRenderizavelBloco(obj_render, bloco_id);

	res.render(view, obj_render);

});