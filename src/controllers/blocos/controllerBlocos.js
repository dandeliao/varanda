const asyncHandler 				                = require('express-async-handler');
require('dotenv').config();

exports.getBloco = asyncHandler(async (req, res, next) => {

    const bloco_id = req.params.bloco_id;
    const bloco = `blocos/${bloco_id}`

    const varanda_id = req.query.varanda ? req.query.varanda : null

	let usuarie_id;
	if (req.isAuthenticated()) {
		usuarie_id = req.user.bicho_id;
		if(req.query.bicho_id) {
			const permissoesBicho = await serviceRelacoes.verRelacao(req.user.bicho_id, req.query.bicho_id);
			if (permissoesBicho.representar) usuarie_id = req.query.bicho_id;
		}
	}

	let flash_message;
	if (req.flash) {
		flash_message = req.flash('message')[0];
	} else {
		flash_message = req.session.flash.error ? req.session.flash.error[0] : null; // flash message da sessão (confirmação de login, por exemplo)
	}

    res.render(`blocos/${bloco_id}`, {
        layout: false,
        varanda: {
            bicho_id: varanda_id
        },
        usuarie: {
			logade: req.isAuthenticated(),
            bicho_id: usuarie_id
        },
		query: req.query ? req.query : null,
        flash_message: flash_message
    });

    /* res.render(`blocos/${req.params.bloco_id}`, {usuarie: {bicho_id: req.user.bicho_id}}); */

});