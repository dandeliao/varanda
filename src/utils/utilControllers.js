const serviceRelacoes   = require('../services/bichos/serviceRelacoes');
const serviceBichos     = require('../services/bichos/serviceBichos');
const serviceComunidades = require('../services/bichos/serviceComunidades');
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
    const varanda = await serviceBichos.verBicho(varanda_id);
    let obj_render =  {
        varanda: varanda,
		pagina: {
            pagina_id: pagina_id,
            titulo: pagina ? pagina.titulo : null,
            publica: pagina ? pagina.publica : null,
		},
        usuarie: {
			logade: req.isAuthenticated(),
            bicho_id: usuarie_id
        },
        flash: {
            aviso: res.locals.flash_message,
            erro: res.locals.flash_error
        },
        bloco: {},
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
                    let bicho = {};
                    const comunidade = await serviceComunidades.verComunidade(obj_render.query.bicho);
                    if (comunidade) {
                        bicho = comunidade;
                        bicho.comunitario = true;
                    } else {
                        bicho = await serviceBichos.verBicho(obj_render.query.bicho);
                    }
                    dados.bicho = bicho;
                }
                break;
            case 'paginas':
                if (obj_render.varanda.bicho_id) {
                    const paginas = await servicePaginas.verPaginas(obj_render.varanda.bicho_id);
                    console.log(paginas);
                    dados.paginas = paginas;
                }
                break;
            case 'relacao':
                if (obj_render.query.bicho) {
                    let relacao = await serviceRelacoes.verRelacao(obj_render.usuarie.bicho_id, obj_render.query.bicho);
                    if (relacao !== undefined) {
                        dados.relacao = relacao;
                    }
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

exports.palavrasReservadas = () => {
    return ['editar', 'clonar', 'futricar', 'avatar', 'fundo', 'criar-comunidade', 'nova_pagina', 'nova_comunidade'];
};