const asyncHandler 				= require('express-async-handler');
const customError	 			= require('http-errors');
const serviceRelacoes			= require('../../services/bichos/serviceRelacoes');
require('dotenv').config();

exports.getPagina = asyncHandler(async (req, res, next) => {
    
    const varanda_id = req.params.bicho_id;
	const pagina_id = req.params.pagina_id;
    const view = `varandas/${varanda_id}/${pagina_id}`;

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

    res.render(view, {
        varanda: {
            bicho_id: varanda_id,
            pagina_id: pagina_id
        },
        usuarie: {
			logade: req.isAuthenticated(),
            bicho_id: usuarie_id
        },
		query: req.query ? req.query : null,
        flash_message: flash_message
    });
});

exports.getAcaoPagina = asyncHandler(async (req, res, next) => {
	const varanda_id = req.params.bicho_id;
	const { pagina_id, acao } = req.params;
    let view = `blocos/${acao}`;

    let usuarie_id;
	if (req.isAuthenticated()) {
		usuarie_id = req.user.bicho_id;
		if(req.query.bicho_id) {
			const permissoesBicho = await serviceRelacoes.verRelacao(req.user.bicho_id, req.query.bicho_id);
			if (permissoesBicho.representar) usuarie_id = req.query.bicho_id;
		}
	}

	if (usuarie_id !== varanda_id) {
		const permissoesEditore = await serviceRelacoes.verRelacao(usuarie_id, varanda_id);
		if (!permissoesEditore || !permissoesEditore.editar) {
			req.flash('message', `Você não pode editar ${varanda_id}.`);
			view = `varandas/${varanda_id}/${pagina_id}`
		}
	}

	let flash_message;
	if (req.flash) {
		flash_message = req.flash('message')[0];
	} else {
		flash_message = req.session.flash.error ? req.session.flash.error[0] : null; // flash message da sessão (confirmação de login, por exemplo)
	}

    res.render(view, {
        varanda: {
            bicho_id: varanda_id,
            pagina_id: pagina_id
        },
        usuarie: {
			logade: req.isAuthenticated(),
            bicho_id: usuarie_id
        },
		query: req.query ? req.query : null,
        flash_message: flash_message
    });
});

exports.postPagina = asyncHandler(async (req, res, next) => {
    
});

exports.putPagina = asyncHandler(async (req, res, next) => {
    
});

exports.deletePagina = asyncHandler(async (req, res, next) => {
    
});