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

exports.renderiza = (req, res, varanda_id, pagina_id, usuarie_id, view, layout) => {
    /* let flash_message;
	if (req.flash) {
		flash_message = req.flash('message')[0];
	} else {
		flash_message = req.session.flash.error ? req.session.flash.error[0] : null; // flash message da sessão (confirmação de login, por exemplo)
	} */

    console.log('---');
    console.log(res.locals.flash_message);

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
		query: req.query ? req.query : null,
        flash_message: res.locals.flash_message
    }

    if (layout !== undefined) {
        obj_render.layout = layout;
    }

    res.render(view, obj_render);

    return;
};