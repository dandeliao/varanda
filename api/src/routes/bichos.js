const express 	= require('express');
const router 	= express.Router();
const path = require('path');
const multer = require('multer');
const update = multer({ dest: path.join(path.resolve(__dirname, '../../static/bichos/temp' )) });
const taAutenticade = require('../middlewares/authentication');
const { getBichos, getBicho, putBicho, getAvatar, getFundo, putAvatar, putFundo, deleteBicho }	= require('../controllers/bichos/controllerBichos');
const { getComunidades,	getComunidade, 	postComunidade, putComunidade, 	deleteComunidade }	= require('../controllers/bichos/controllerComunidades');
const { getPessoas, 	getPessoa, 		postPessoa, 	putPessoa, 		deletePessoa } 		= require('../controllers/bichos/controllerPessoas');
const { getRecuperar,                   postRecuperar,  putRecuperar }                      = require('../controllers/bichos/controllerRecuperar');
const { getRelacoes,	        		postRelacao,	putRelacao,		deleteRelacao }		= require('../controllers/bichos/controllerRelacoes');
const { getConvites,                    postConvite,                    deleteConvite}      = require('../controllers/bichos/controllerConvites');

router.use(taAutenticade);

// ---
// Comunidades

router.get('/comunidades', getComunidades);

router.get('/comunidades/:arroba', getComunidade);

router.post('/comunidades', postComunidade); // req.body = {bicho_id, nome, descricao, bicho_criador_id}

router.put('/comunidades/:arroba', putComunidade); // req.body = {participacao_livre, participacao_com_convite, periodo_geracao_convite}

router.delete('/comunidades/:arroba', deleteComunidade);

// ---
// Pessoas

router.get('/pessoas', getPessoas);

router.get('/pessoas/:arroba', getPessoa);

router.post('/pessoas', postPessoa); // req.body = {bicho_id, nome, email, senha, convite_id}

router.put('/pessoas/:arroba', putPessoa); // req.body = {nome, descricao, descricao_avatar, descricao_fundo, email, senha}

router.delete('/pessoas/:arroba', deletePessoa);

// ---
// Recuperação de senha

router.get('/pessoas/:arroba/recuperar', getRecuperar);

router.post('/pessoas/:arroba/recuperar', postRecuperar);

router.put('/pessoas/:arroba/recuperar', putRecuperar);

// ---
// Convites

router.get('/convites', getConvites); // convites?comunidade_id=arroba | convites?bicho_criador_id=arroba | nada -> utiliza req.user.bicho_id

router.post('/convites', postConvite); // req.body = {comunidade_id, bicho_criador_id} | nada -> utiliza req.user.bicho_id

router.delete('/convites', deleteConvite); // req.body = {convite_id}

// ---
// Relações entre bichos

router.get('/:arroba/relacoes',	getRelacoes); // relacoes?comunidade_id=arrobaDaComunidade (opcional. Se fornecido, mostra relação com essa comunidade apenas)

router.post('/:arroba/relacoes', postRelacao); // req.body = {comunidade_id, convite_id}

router.put('/:arroba/relacoes', putRelacao); // req.body = {comunidade_id, participar, editar, moderar, representar}

router.delete('/:arroba/relacoes', deleteRelacao); // req.body = {comunidade_id}

// ---
// Bichos em geral

router.get('/', getBichos);

router.get('/:arroba', getBicho);

router.get('/:arroba/avatar', getAvatar);

router.get('/:arroba/fundo', getFundo);

router.put('/:arroba', putBicho); // req.body = {nome, descricao, descricao_avatar, descricao_fundo}

router.put('/:arroba/avatar', update.single('arquivo'), putAvatar); // req.body = {descricao_avatar}

router.put('/:arroba/fundo', update.single('arquivo'), putFundo); // req.body = {descricao_fundo}

router.delete('/:arroba', deleteBicho);


module.exports = router;