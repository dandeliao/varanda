const serviceRelacoes   = require('../services/bichos/serviceRelacoes');
const serviceBichos     = require('../services/bichos/serviceBichos');
const serviceBlocos     = require('../services/varandas/serviceBlocos');
const servicePaginas    = require('../services/varandas/servicePaginas');

exports.params = (req) => {
    const varanda_id = req.params.bicho_id ? req.params.bicho_id : process.env.INSTANCIA_ID;
	const pagina_id = req.params.pagina_id ? encodeURIComponent(req.params.pagina_id) : 'inicio';
    return {
        varanda_id: varanda_id,
        pagina_id: pagina_id
    };
};

exports.objetoRenderizavel = async (req, res, varanda_id, pagina_id, usuarie_id, layout) => {

    const pagina = await servicePaginas.verPaginas(varanda_id, pagina_id);
    let obj_render =  {
        varanda: {
            bicho_id: varanda_id
        },
		pagina: {
            pagina_id: pagina_id,
            titulo: pagina ? pagina.titulo : null
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

exports.objetoRenderizavelBloco = async (obj_render, bloco_id) => {

    const bloco = await serviceBlocos.verBloco(bloco_id);

    let dados = {};
    for(let variavel of bloco.variaveis) {
        switch(variavel){
            case 'bicho':
                if (obj_render.query.bicho) {
                    const bicho = await serviceBichos.verBicho(obj_render.query.bicho);
                    dados = Object.assign({bicho: bicho});
                }
                break;
            case 'paginas':
                if (obj_render.varanda.varanda_id) {
                    const paginas = await servicePaginas.verPaginas(obj_render.varanda.varanda_id);
                    dados = Object.assign({paginas: paginas});
                }
                break;
            default:
                if (obj_render.query[variavel]) {
                    dados[variavel] = obj_render.query[variavel];
                }
        }
    }

    obj_render.bloco = dados;
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

exports.vidParaId = (vid) => {
    return vid.match(/[^\/]*$/g)[0];
};