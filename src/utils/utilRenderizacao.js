const serviceRelacoes       = require('../services/bichos/serviceRelacoes');
const serviceBichos         = require('../services/bichos/serviceBichos');
const serviceComunidades    = require('../services/bichos/serviceComunidades');
const servicePreferencias   = require('../services/bichos/servicePreferencias');
const servicePaginas        = require('../services/varandas/servicePaginas');
const serviceArtefatos      = require('../services/artefatos/serviceArtefatos');
const { dataHumana,
        bichoSurpresa }     = require('./utilMiscellaneous');
const { vidParaId, escaparHTML }         = require('./utilParsers');
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
        let comunidade = await serviceComunidades.verComunidade(bicho_id);
        bicho.comunitaria = comunidade ? true : false;
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
                artefato.texto = await escaparHTML(artefato.texto);
                artefato.criacao = dataHumana(artefato.criacao);
                artefato.comentarios = await serviceArtefatos.verComentarios(artefato_id);
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
            erro:  res.locals.flash_erro,
            aviso_decod: decodeURIComponent(res.locals.flash_aviso),
            erro_decod: decodeURIComponent(res.locals.flash_erro)
        },
        bloco: {},
		query: req.query ? req.query : null,
    }
    if (layout !== undefined) obj_render.layout = layout;

    if (usuarie_id) {
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
            contexto.um = {
                url:        `/${obj_render.artefato.pagina_vid}/novo_artefato/editar?em_resposta_a=${obj_render.artefato.artefato_id}`,
                metodo:     'get',
                nome:       'comentar',
                descricao:  'Postar um comentário.'
            }
            contexto.dois = {
                funcao:     true,
                nome:       'enviar',
                descricao:  'Compartilha a postagem.'
            }
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
            if (obj_render.query.em_resposta_a) {
                url_cancelar = `/${obj_render.pagina.pagina_vid}/${obj_render.query.em_resposta_a}`;
            } else if (obj_render.novo_artefato) {
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
                if (!obj_render.pagina.postavel) {
                if (obj_render.varanda.bicho_id === process.env.INSTANCIA_ID) {
                        contexto.um = criarComunidade;    
                    } else {
                        contexto.um = surpresa;
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
                    let bicho_id = obj_render.query.bicho ? obj_render.query.bicho : (obj_render.varanda ? obj_render.varanda.bicho_id : null);
                    if (bicho_id !== null) {
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
                    }
                    break;
                case 'equipe':
                    let comunidade_id = obj_render.query.bicho ? obj_render.query.bicho : (obj_render.varanda ? obj_render.varanda.bicho_id : null);
                    let equipe = await serviceRelacoes.verEquipe(comunidade_id);
                    dados.equipe = equipe;
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
                        /* if (!pagina.publica) {
                            if (obj_render.usuarie.bicho_id !== obj_render.varanda.bicho_id) {
                                let relacao = await serviceRelacoes.verRelacao(obj_render.usuarie.bicho_id, obj_render.varanda.bicho_id);
                                if (!relacao.participar && !relacao.moderar) {
                                    if (artefato.bicho_criador_id !== obj_render.usuarie.bicho_id) {
                                        artefato = null;
                                    }
                                }
                            }
                        } */
                        artefato.tipo = {};
                        artefato.tipo[tipoDeArquivo(artefato.extensao)] = true;
                        artefato.texto = await escaparHTML(artefato.texto);
                        artefato.criacao = dataHumana(artefato.criacao);
                        if (obj_render.query.estilo === 'comentario') {
                            artefato.comentario = true;
                        }
                    }
                    dados.artefato = artefato;
                    break;
                case 'comunidades':
                    let comunidades;
                    console.log('!!!!! bicho:', obj_render.query.bicho);
                    if (obj_render.query.bicho == process.env.INSTANCIA_ID) {
                        comunidades = await serviceComunidades.verComunidades();
                    } else {
                        comunidades = await serviceRelacoes.verComunidadesDoBicho(obj_render.query.bicho);
                    }
                    dados.comunidades = comunidades;
                    break;
                case 'lote':
                    let lista = await serviceArtefatos.verArtefatosNaPagina(obj_render.query.bicho, obj_render.pagina.pagina_id, obj_render.query.lote);
                    for (let i = 0; i < lista.length; i++) {
                        if (i > 0) {
                            if ((i % 2 == 0) && (lista[i-1].colorir)) {
                                lista[i].colorir = true;
                            } else if ((i % 2 != 0) && (!lista[i-1].colorir)) {
                                lista[i].colorir = true;
                            }   
                        }
                    }
                    let quantidade = lista.length;
                    let lote = parseInt(obj_render.query.lote ? obj_render.query.lote : 1);
                    let proximo_lote = lote + 1;
                    dados.artefatos = {
                        lista: lista,
                        quantidade: quantidade,
                        proximo_lote: proximo_lote,
                        comecou: lote === 1 ? true : false,
                        acabou: quantidade === 0 ? true : false
                    };
                    break;
                case 'relacao':
                    let animal = obj_render.query.bicho ? obj_render.query.bicho : obj_render.varanda.bicho_id;
                    let relacao = await serviceRelacoes.verRelacao(obj_render.usuarie.bicho_id, animal);
                    if (relacao !== undefined) {
                        dados.relacao = relacao;
                    }
                    break;
                case 'pagina':
                    let pagina = await servicePaginas.verPaginas(obj_render.varanda.bicho_id, obj_render.pagina.pagina_id);
                    dados.pagina = pagina;
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