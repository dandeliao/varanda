const serviceRelacoes   = require('../services/bichos/serviceRelacoes');
const serviceBichos     = require('../services/bichos/serviceBichos');

exports.params = (req) => {
    const varanda_id = req.params.bicho_id ? req.params.bicho_id : process.env.INSTANCIA_ID;
	const pagina_id = req.params.pagina_id ? req.params.pagina_id : 'inicio';
    return {
        varanda_id: varanda_id,
        pagina_id: pagina_id
    };
};

exports.objetoRenderizavel = async (req, res, varanda_id, pagina_id, usuarie_id, layout) => {

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
        bloco: {

        },
		query: req.query ? req.query : null,
    }

    if (layout !== undefined) {
        obj_render.layout = layout;
    }

    return obj_render;
};

exports.objetoRenderizavelBloco = async (obj_render) => {

    console.log('obj_render:', obj_render);

    let bicho = {};
    if (obj_render.query.bicho) {
        bicho = await serviceBichos.verBicho(obj_render.query.bicho);
        console.log('bicho:', bicho);
    }

    obj_render.bloco = bicho;
    console.log(obj_render);
    return obj_render;
}

exports.quemEstaAgindo = async (req) => {
    let usuarie_id;
	if (req.isAuthenticated()) {
		usuarie_id = req.user.bicho_id; // usuárie logade (req.user)
		if(req.query.bicho_id) {        // bicho declarado na query (req.query)
			const permissoesBicho = await serviceRelacoes.verRelacao(req.user.bicho_id, req.query.bicho_id);
			if (permissoesBicho.representar) usuarie_id = req.query.bicho_id;
		}
	}
    return usuarie_id;
};

exports.vidParaId = (pagina) => {
    return pagina.pagina_vid.match(/[^\/]*$/g)[0];
};