const serviceRelacoes   = require('../services/bichos/serviceRelacoes');
const serviceBichos     = require('../services/bichos/serviceBichos');
const serviceComunidades = require('../services/bichos/serviceComunidades');
const serviceBlocos     = require('../services/varandas/serviceBlocos');
const servicePaginas    = require('../services/varandas/servicePaginas');
const servicePreferencias = require('../services/bichos/servicePreferencias');

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
    const preferencias = await servicePreferencias.verPreferencias(usuarie_id);
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
            aviso: res.locals.flash_aviso,
            erro: res.locals.flash_erro
        },
        preferencias: {
            tema: {
                zero: preferencias ? (preferencias.tema === 0 ? true : false) : false,
                um: preferencias ? (preferencias.tema === 1 ? true : false) : false
            }
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
                let bicho_id = obj_render.query.bicho ? obj_render.query.bicho : obj_render.varanda.bicho_id;
                
                let bicho = {};
                const comunidade = await serviceComunidades.verComunidade(bicho_id);
                if (comunidade) {
                    bicho = comunidade;
                    bicho.comunitario = true;
                    if (comunidade.bicho_id === process.env.INSTANCIA_ID) {
                        bicho.instancia = true;
                    }
                } else {
                    bicho = await serviceBichos.verBicho(bicho_id);
                }
                dados.bicho = bicho;
                break;
            case 'paginas':
                if (obj_render.varanda.bicho_id) {
                    const paginas = await servicePaginas.verPaginas(obj_render.varanda.bicho_id);
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
    return ['editar', 'clonar', 'futricar', 'avatar', 'fundo', 'preferencias', 'editar-preferencias', 'criar-comunidade', 'nova_pagina', 'nova_comunidade'];
};