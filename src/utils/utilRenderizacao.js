const serviceRelacoes       = require('../services/bichos/serviceRelacoes');
const serviceBichos         = require('../services/bichos/serviceBichos');
const serviceComunidades    = require('../services/bichos/serviceComunidades');
const servicePreferencias   = require('../services/bichos/servicePreferencias');
const servicePaginas        = require('../services/varandas/servicePaginas');
const serviceArtefatos      = require('../services/artefatos/serviceArtefatos');
const { dataHumana,
        bichoSurpresa }     = require('./utilMiscellaneous');
const { vidParaId }         = require('./utilParsers');
const { tipoDeArquivo }     = require('./utilArquivos');
require('dotenv').config();

exports.objetoRenderizavel = async (req, res, bicho_id, pagina_id, artefato_id, usuarie_id, layout) => {
    
    /* busca dados de bicho, página e artefato */
    let bicho       = null;
    let pagina      = null;
    let artefato    = null;
    if (bicho_id) {
        bicho = await serviceBichos.verBicho(bicho_id);
        if (!bicho) {
            bicho = await serviceBichos.verBicho(process.env.INSTANCIA_ID);
        }
    }
    if (pagina_id) {
        pagina = await servicePaginas.verPaginas(bicho_id, pagina_id);
        if (!pagina) {
            pagina = {
                pagina_id: pagina_id
            };
        } else {
            pagina.pagina_id = pagina_id;
        }
    }
    if (artefato_id) {
        artefato = await serviceArtefatos.verArtefato(artefato_id);
        if (artefato) {
            if (artefato.pagina_vid === `${bicho_id}/${pagina_id}`) {
                artefato.tipo = {};
                artefato.tipo[tipoDeArquivo(artefato.extensao)] = true;
                artefato.criacao = dataHumana(artefato.criacao);
            } else {
                artefato = null;
            }
        }
    }
    
    /* preenche objeto renderizável */
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
            erro:  res.locals.flash_erro
        },
        bloco: {},
		query: req.query ? req.query : null,
    }
    if (layout !== undefined) obj_render.layout = layout;

    /* botões de contexto padrão */
    const preferencias = {
        url:        `/${usuarie_id}/editar-preferencias`,
        metodo:     'get',
        nome:       'preferências',
        descricao:  'Editar suas preferências'
    };
    const surpresa = {
        url:        `/${(await bichoSurpresa()).bicho_id}`,
        metodo:     'get',
        nome:       'surpresa',
        descricao:  'Abrir uma comunidade aleatória'
    };
    
    obj_render.contexto = {
        um:   surpresa,
        dois: preferencias
    }

    return obj_render;
};

exports.objetoRenderizavelContexto = async (obj_render, tipo) => {

    /* botoes de contexto */
    const preferencias  = {
        url:        `/${obj_render.usuarie.bicho_id}/editar-preferencias`,
        metodo:     'get',
        nome:       'preferências',
        descricao:  'Editar suas preferências'
    };
    const sobre         = {
        url:        `/${obj_render.varanda.bicho_id}/futricar`,
        metodo:     'get',
        nome:       'sobre',
        descricao:  'Ver informações deste bicho'
    };
    const surpresa      = {
        url:        `/${(await bichoSurpresa()).bicho_id}`,
        metodo:     'get',
        nome:       'surpresa',
        descricao:  'Abrir uma comunidade aleatória'
    };
    const participar    = {
        url:        `/${obj_render.varanda.bicho_id}/participar`,
        metodo:     'post',
        nome:       'participar',
        descricao:  `Participar da comunidade @${obj_render.varanda.nome}`
    };
    const clonar        = {
        url:        `/${obj_render.varanda.bicho_id}/clonar`,
        metodo:     'get',
        nome:       'clonar',
        descricao:  `Clonar comunidade @${obj_render.varanda.bicho_id}`
    };
    const criarComunidade = {
        url:        `/criar-comunidade`,
        metodo:     'get',
        nome:       'criar comunidade',
        descricao:  'Abre página de criação de comunidade'
    }

    /* contexto padrão */
    let contexto = {
        um:     surpresa,
        dois:   preferencias,
    };

    /* contextos específicos */
    switch(tipo) {
        case 'artefato':
            break;
        case 'bicho':
            let comunidade = await serviceComunidades.verComunidade(obj_render.varanda.bicho_id);
            if (comunidade) {
                let relacao = await serviceRelacoes.verRelacao(obj_render.usuarie.bicho_id, comunidade.bicho_id);
                if ((!relacao || !relacao.participar) && comunidade.participacao_livre) {
                    contexto.um = participar;
                } else if (obj_render.varanda.bicho_id === process.env.INSTANCIA_ID) {
                    contexto.um = criarComunidade;
                }
                contexto.dois = clonar;
            }
            break;
        case 'clonar':
            contexto.um = {
                submit:     true,
                nome:       'confirmar',
                descricao:  'Confirma clonagem do bicho'
            };
            contexto.dois = {
                url:        `/${obj_render.varanda.bicho_id}/futricar`,
                metodo:     'get',
                nome:       'cancelar',
                descricao:  'Cancela clonagem'
            }
            break;
        case 'editar-artefato':
            let url_cancelar = '';
            if (obj_render.novo_artefato) {
                url_cancelar = `/${obj_render.pagina.pagina_vid}`;
            } else {
                url_cancelar = `/${obj_render.pagina.pagina_vid}/${obj_render.artefato.artefato_id}`;
            }
            contexto.um = {
                submit:     true,
                nome:       'confirmar',
                descricao:  'Confirma edição do artefato'
            };
            contexto.dois = {
                url:        url_cancelar,
                metodo:     'get',
                nome:       'cancelar',
                descricao:  'Cancela edição'
            }
            break;
        case 'editar-bicho':
            contexto.um = {
                submit:     true,
                nome:       'confirmar',
                descricao:  'Confirma edição do bicho'
            };
            contexto.dois = {
                url:        `/${obj_render.varanda.bicho_id}/futricar`,
                metodo:     'get',
                nome:       'cancelar',
                descricao:  'Cancela edição'
            }
            break;
        case 'editar-pagina':
            contexto.um = {
                submit:     true,
                nome:       'confirmar',
                descricao:  'Confirma e finaliza a edição da página'
            };
            contexto.dois = {
                url:        `/${obj_render.varanda.bicho_id}/futricar`,
                metodo:     'get',
                nome:       'cancelar',
                descricao:  'Cancela edição da página'
            }
            break;
        case 'editar-preferencias':
            contexto.um = {
                submit:     true,
                nome:       'confirmar',
                descricao:  'Confirma e finaliza a edição da página'
            };
            contexto.dois = {
                url:        `/${obj_render.varanda.bicho_id}/futricar`,
                metodo:     'get',
                nome:       'cancelar',
                descricao:  'Cancela edição de preferências'
            }
            break;
        case 'pagina':
            let relacao = await serviceRelacoes.verRelacao(obj_render.usuarie.bicho_id, obj_render.varanda.bicho_id);
            if (!relacao || !relacao.participar) {
                let comunidade = await serviceComunidades.verComunidade(obj_render.varanda.bicho_id);
                if (comunidade && comunidade.participacao_livre) {
                    contexto.um = participar;    
                } else {
                    contexto.um = surpresa;
                }
            } else {
                if (obj_render.varanda.bicho_id === process.env.INSTANCIA_ID) {
                    if (obj_render.pagina.pagina_id === 'inicio') {
                        contexto.um = criarComunidade;    
                    }
                } else {
                    contexto.um = {
                        url:        `/${obj_render.pagina.pagina_vid}/novo_artefato/editar`,
                        metodo:     'get',
                        nome:       'postar',
                        descricao:  'Abre página de postagem'
                    };
                }   
            }
            contexto.dois = sobre;
            break;
    }

    obj_render.contexto = contexto;
    return obj_render;
};

exports.objetoRenderizavelBloco = async (obj_render, variaveis) => {
    let dados = {};
    if (variaveis) {
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
                        if (bicho.bicho_id === obj_render.usuarie.bicho_id) {
                            bicho.meuPerfil = true;
                        }
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
                        artefato.tipo = {};
                        artefato.tipo[tipoDeArquivo(artefato.extensao)] = true;
                        artefato.criacao = dataHumana(artefato.criacao);
                    }
                    console.log('artefato:', artefato);
                    dados.artefato = artefato;
                    break;
                case 'relacao':
                    let animal = obj_render.query.bicho ? obj_render.query.bicho : obj_render.varanda.bicho_id;
                    let relacao = await serviceRelacoes.verRelacao(obj_render.usuarie.bicho_id, animal);
                    if (relacao !== undefined) {
                        dados.relacao = relacao;
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
    }

    obj_render.bloco = dados;
    return obj_render;
}