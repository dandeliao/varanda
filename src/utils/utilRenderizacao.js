const serviceRelacoes       = require('../services/bichos/serviceRelacoes');
const serviceBichos         = require('../services/bichos/serviceBichos');
const serviceComunidades    = require('../services/bichos/serviceComunidades');
const servicePreferencias   = require('../services/bichos/servicePreferencias');
const servicePaginas        = require('../services/varandas/servicePaginas');
const serviceArtefatos      = require('../services/artefatos/serviceArtefatos');
const { dataHumana }        = require('../utils/utilMiscellaneous');
const { vidParaId }         = require('./utilParsers');
require('dotenv').config();

exports.objetoRenderizavel = async (req, res, bicho_id, pagina_id, artefato_id, usuarie_id, layout) => {
    
    let bicho        = null;
    let pagina       = null;
    let artefato     = null;
    if (bicho_id)    { bicho        = await serviceBichos.verBicho(bicho_id)                }
    if (pagina_id)   { pagina       = await servicePaginas.verPaginas(bicho_id, pagina_id)  }
    if (artefato_id) { artefato     = await serviceArtefatos.verArtefato(artefato_id)       }
    if (!bicho)      { bicho        = await serviceBichos.verBicho(process.env.INSTANCIA_ID)}
    if (!pagina)     { pagina = {pagina_id: pagina_id}  }
                else { pagina.pagina_id = pagina_id     }

    let obj_render =  {
        varanda: bicho,
		pagina: pagina,
        artefato: artefato,
        usuarie: {
			logade: req.isAuthenticated(),
            bicho_id: usuarie_id
        },
        flash: {
            aviso: res.locals.flash_aviso,
            erro: res.locals.flash_erro
        },
        bloco: {},
		query: req.query ? req.query : null,
    }
    if (layout !== undefined) obj_render.layout = layout;

    return obj_render;
};

exports.objetoRenderizavelBloco = async (obj_render, variaveis) => {
    let dados = {};
    for(let variavel of variaveis) {
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
            case 'artefato':
                let artefato = obj_render.artefato;
                if (artefato) {
                    let pagina = await servicePaginas.verPaginas(artefato.varanda_id, vidParaId(artefato.pagina_vid));
                    if (!pagina.publica) {
                        if (obj_render.usuarie.bicho_id !== obj_render.varanda.bicho_id) {
                            let relacao = await serviceRelacoes.verRelacao(obj.render.usuarie.bicho_id, obj.render.varanda.bicho_id);
                            if (!relacao.participar && !relacao.moderar) {
                                if (artefato.bicho_criador_id !== obj_render.usuarie.bicho_id) {
                                    artefato = null;
                                }
                            }
                        }
                    }
                    artefato.criacao = dataHumana(artefato.criacao);
                }
                dados.artefato = artefato;
                break;
            case 'relacao':
                if (obj_render.query.bicho) {
                    let relacao = await serviceRelacoes.verRelacao(obj_render.usuarie.bicho_id, obj_render.query.bicho);
                    if (relacao !== undefined) {
                        dados.relacao = relacao;
                    }
                }
                break;
            case 'preferencias':
                let preferencias = null;
                if (obj_render.usuarie.logade) { preferencias = await servicePreferencias.verPreferencias(obj_render.usuarie.bicho_id) }
                dados.preferencias = {
                    tema: {
                        zero: preferencias ? (preferencias.tema === 0 ? true : false) : false,
                        um: preferencias ? (preferencias.tema === 1 ? true : false) : false
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