const serviceRelacoes = require('../services/bichos/serviceRelacoes');

exports.params = (req) => {
    const varanda_id = req.params.bicho_id ? req.params.bicho_id : process.env.INSTANCIA_ID;
	const pagina_id = req.params.pagina_id ? req.params.pagina_id : 'inicio';
    return {
        varanda_id: varanda_id,
        pagina_id: pagina_id
    };
};

exports.bicho_agente = async (req) => {
    let usuarie_id;
	if (req.isAuthenticated()) {
		usuarie_id = req.user.bicho_id;
		if(req.query.bicho_id) {
			const permissoesBicho = await serviceRelacoes.verRelacao(usuarie_id, req.query.bicho_id);
			if (permissoesBicho.representar) usuarie_id = req.query.bicho_id;
		}
	}
    return usuarie_id;
}

exports.objetoRenderizavel = (req, res, varanda_id, pagina_id, usuarie_id, layout) => {

    let obj_render =  {
        varanda: {
            bicho_id: varanda_id
        },
		pagina: {
            pagina_id: pagina_id
		},
        usuarie: {
			logade: req.isAuthenticated(),
            bicho_id: usuarie_id
        },
        flash: {
            aviso: res.locals.flash_message,
            erro: res.locals.flash_error
        },
		query: req.query ? req.query : null,
    }

    if (layout !== undefined) {
        obj_render.layout = layout;
    }

    return obj_render;
};