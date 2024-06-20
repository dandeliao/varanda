const asyncHandler 			= require('express-async-handler');
const { quemEstaAgindo } 	= require('../utils/utilControllers');
const { objetoRenderizavel, 
	objetoRenderizavelBloco}= require('../utils/utilRenderizacao');
const { vidParaId } 		= require('../utils/utilParsers');
const serviceArtefatos 		= require('../services/artefatos/serviceArtefatos');
const serviceBlocos			= require('../services/varandas/serviceBlocos');
require('dotenv').config();

exports.getBloco = asyncHandler(async (req, res, next) => {

    const bloco_id = req.params.bloco_id;
    const view = `blocos/${bloco_id}`;
	const usuarie_id = await quemEstaAgindo(req);
    let varanda_id 		= req.query.varanda ? req.query.varanda : (req.query.bicho ? req.query.bicho : null);
	let pagina_id		= req.query.pagina ? req.query.pagina : null;
	const artefato_id 	= req.query.artefato ? req.query.artefato : null;
	
	if (artefato_id) {
		if (!varanda_id || !pagina_id) {
			const artefato = await serviceArtefatos.verArtefato(artefato_id);
			varanda_id = artefato.varanda_id;
			pagina_id = vidParaId(artefato.pagina_vid);
		}
	}

	let obj_render = await objetoRenderizavel(req, res, varanda_id, pagina_id, artefato_id, usuarie_id, false);
	const bloco = (await serviceBlocos.verBloco(bloco_id));
	const variaveis = bloco ? bloco.variaveis : null;
	obj_render = await objetoRenderizavelBloco(obj_render, variaveis);

	res.render(view, obj_render);
});