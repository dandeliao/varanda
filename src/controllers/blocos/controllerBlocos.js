const asyncHandler 	= require('express-async-handler');
const { renderiza } = require('../../utils/utilControllers');
require('dotenv').config();

exports.getBloco = asyncHandler(async (req, res, next) => {

    const bloco_id = req.params.bloco_id;
    const view = `blocos/${bloco_id}`;

    const varanda_id = req.query.varanda ? req.query.varanda : null;
	const pagina_id	 = req.query.pagina ? req.query.pagina : null;

	let usuarie_id;
	if (req.isAuthenticated()) {
		usuarie_id = req.user.bicho_id;
		if(req.query.bicho_id) {
			const permissoesBicho = await serviceRelacoes.verRelacao(req.user.bicho_id, req.query.bicho_id);
			if (permissoesBicho.representar) usuarie_id = req.query.bicho_id;
		}
	}

	renderiza(req, res, varanda_id, pagina_id, usuarie_id, view, false);
	return;

});