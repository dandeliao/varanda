const express 	= require('express');
const router 	= express.Router();
require('dotenv').config();

const { getVaranda, postVaranda,    putVaranda, deleteVaranda   } = require('../controllers/controllerVarandas');
const { getPagina,  postPagina,     putPagina,  deletePagina    } = require('../controllers/controllerPaginas');
const {             postParticipar                              } = require('../controllers/controllerRelacoes');
const { getFutricarVaranda, getCriarComunidade, getAvatar, getFundo, getEditarBicho, getEditarPagina } = require('../controllers/controllerReservadas');

router.get   ('/',                      getVaranda);
router.get   ('/criar-comunidade',      getCriarComunidade);
router.get   ('/:bicho_id',             getVaranda);
router.get   ('/:bicho_id/futricar',    getFutricarVaranda);
router.get   ('/:bicho_id/editar-bicho',getEditarBicho);
router.get   ('/:bicho_id/avatar',      getAvatar);
router.get   ('/:bicho_id/fundo',       getFundo);
router.post  ('/',                      postVaranda);
router.post  ('/:bicho_id/participar',  postParticipar);
router.put   ('/:bicho_id',             putVaranda);
router.delete('/:bicho_id',             deleteVaranda);

router.get   ('/:bicho_id/:pagina_id',          getPagina);
router.get   ('/:bicho_id/:pagina_id/editar',   getEditarPagina)
router.post  ('/:bicho_id',                     postPagina);
router.put   ('/:bicho_id/:pagina_id',          putPagina);
router.delete('/:bicho_id/:pagina_id',          deletePagina);


/*
// ---
// Blocos em geral

router.get('/blocos', getBlocos); // ?comunitario=boolean (opcional)

router.get('/bloco', getBloco); // ?bloco_id=IdDoBloco

// ---
// Varandas

router.get('/', getVarandas); // ?bicho_id=idDoBicho&comunitaria=boolean&aberta=boolean (filtros opcionais)

router.get('/:varanda_id', getVaranda);

router.put('/:varanda_id', putVaranda); // req.body = {aberta, bicho_id} (bicho_id é opcional. Por padrão usa req.user.bicho_id)

// ---
// Páginas

router.get('/:varanda_id/paginas', getPaginas); // ?pagina_id=idDaPagina&publica=boolean (filtros opcionais)

router.get('/:varanda_id/pagina', getPagina); // ?pagina_id=idDaPagina [retorna .html]

router.post('/:varanda_id/paginas', postPagina); // req.body = {titulo, publica, html, bicho_id} (bicho_id é opcional. Por padrão, bicho_id = req.user.bicho_id) [adiciona versão inicial como 1a edição]

router.put('/:varanda_id/paginas', putPagina); // req.body = {pagina_id, titulo, publica, ordem, html, bicho_id} (bicho_id é opcional. Por padrão, bicho_id = req.user.bicho_id) [adiciona edição ao banco de dados]

router.delete('/:varanda_id/paginas', deletePagina); // ?pagina_id=idDaPagina&bicho_id=idDoBicho (bicho_id é opcional. Por padrão, bicho_id = req.user.bicho_id)

// ---
// Edições

router.get('/:varanda_id/edicoes', getEdicoes); // ?pagina_id=idDaPagina&edicao_id=idDaEdicao (edicao_id opcional)

router.delete('/:varanda_id/edicoes', deleteEdicoes); // ?pagina_id=idDaPagina&edicao_id=idDaEdicao (edicao_id opcional) [reverte página para edição mais recente não deletada]

// ---
// Blocos nas páginas/varandas

router.get('/:varanda_id/blocos', getBlocosEmUso); // ?pagina_id=idDaPagina */


module.exports = router;