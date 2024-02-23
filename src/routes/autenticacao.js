const servicePessoas 		= require('../services/bichos/servicePessoas');
const serviceBichos 		= require('../services/bichos/serviceBichos');
const serviceBichosPadrao 	= require('../services/bichos/serviceBichosPadrao');
const serviceConvites 		= require('../services/bichos/serviceConvites');
const serviceComunidades 	= require('../services/bichos/serviceComunidades');
const serviceRelacoes 		= require('../services/bichos/serviceRelacoes');
const servicePaginasPadrao 	= require('../services/varandas/servicePaginasPadrao');
const servicePaginas		= require('../services/varandas/servicePaginas');
const serviceEdicoes		= require('../services/varandas/serviceEdicoes');
const { validarPostPessoa }	= require('../validations/validateBichos');
const asyncHandler 			= require('express-async-handler');
const express 				= require('express');
const router 				= express.Router();
const passport 				= require('passport');
require('dotenv').config();

router.get('/login', (req, res) => {

	res.render('autenticacao/login', {
		flash: {
            aviso: res.locals.flash_message,
            erro: res.locals.flash_error
        },
		query: req.query ? req.query : null
	});

});

router.post('/login', passport.authenticate('local', {
	failureRedirect: '/autenticacao/login',
	failureFlash: true, // testar flash message, ver localização pt-br
	successRedirect: '/'
}));

router.get('/logout', (req, res) => {
	req.logout(err => {
		if (err) {
			req.flash('erro', 'Erro ao sair da varanda. Por favor, tente novamente.');
			res.redirect('/');
		} else {
			req.flash('aviso', 'Logout feito com sucesso.');
			res.redirect('/');
		}
	});
});

router.get('/cadastro', (req, res) => {

	res.render('autenticacao/cadastro', {
		flash: {
            aviso: res.locals.flash_message,
            erro: res.locals.flash_error
        },
		query: req.query ? req.query : null
	});

});

router.post('/cadastro', asyncHandler( async (req, res) => {

    const { value, error } = validarPostPessoa(req.body);
    
	if (error) {
	    req.flash('error', error.message);
        return res.redirect('/autenticacao/cadastro');
	}

	const pessoa = {
		bicho_id: req.body.bicho_id,
		nome: req.body.nome,
		email: req.body.email,
		senha: req.body.senha
	};

	// se não é a primeira pessoa a se cadastrar, verifica o convite
	const bichos_anteriores = await serviceBichos.verBichos();
	if (bichos_anteriores.length > 0) {
		if (req.body.convite_id) {
			const convite = await serviceConvites.verConvite(req.body.convite_id);
			if (!convite || convite.comunidade_id !== process.env.INSTANCIA_ID) {
				req.flash ('erro', `O cadastro falhou. O seu convite para ${process.env.INSTANCIA_ID} não é válido ou já foi usado.`);
				return res.redirect('/');
			}
			await serviceConvites.deletarConvite(req.body.convite_id);
		} else {
			req.flash('erro', 'O cadastro falhou. Você precisa de um convite para se cadastrar.');
			return res.redirect('/');
		}
	}
	
	const bichoExiste = await serviceBichos.verBicho(pessoa.bicho_id);
	if (bichoExiste) {
		req.flash('erro', `O apelido @${pessoa.bicho_id} já existe. Por favor, escolha outro apelido.`)
		return res.redirect(`/autenticacao/cadastro?convite=${req.body.convite_id}`);
	}
	
	await servicePessoas.registrarPessoa(pessoa);
	
	// adiciona avatar e fundo padrão
	const bichoPadrao = await serviceBichosPadrao.sortearBichoPadrao();
	const novaPessoa = await serviceBichos.editarBicho(pessoa.bicho_id, {
		descricao: bichoPadrao.descricao,
		avatar: 'avatar.jpg',
		descricao_avatar: bichoPadrao.descricao_avatar,
		fundo: 'fundo.jpg',
		descricao_fundo: bichoPadrao.descricao_fundo
	});
	await serviceBichos.copiarAvatar(novaPessoa.bicho_id, `${serviceBichosPadrao.caminhoAvatarPadrao}/${bichoPadrao.avatar}`, novaPessoa.avatar);
	await serviceBichos.copiarFundo(novaPessoa.bicho_id, `${serviceBichosPadrao.caminhoFundoPadrao}/${bichoPadrao.fundo}`, novaPessoa.fundo);

	// se for o primeiro bicho da instância, cria também a comunidade principal da instância
	if (bichos_anteriores.length === 0) {
		const instancia = {
			bicho_id: process.env.INSTANCIA_ID,
			nome: process.env.INSTANCIA_ID,
			descricao: `Bem-vinde à ${process.env.INSTANCIA_ID}!`
		};
		await serviceComunidades.criarComunidade(instancia, pessoa.bicho_id);
		// adiciona avatar e fundo padrão
		const instanciaPadrao = await serviceBichosPadrao.sortearBichoPadrao();
		const instanciaEditada = await serviceBichos.editarBicho(instancia.bicho_id, {
			descricao: bichoPadrao.descricao,
			avatar: 'avatar.jpg',
			descricao_avatar: instanciaPadrao.descricao_avatar,
			fundo: 'fundo.jpg',
			descricao_fundo: instanciaPadrao.descricao_fundo
		});
		await serviceBichos.copiarAvatar(instanciaEditada.bicho_id, `${serviceBichosPadrao.caminhoAvatarPadrao}/${instanciaPadrao.avatar}`, instanciaEditada.avatar);
		await serviceBichos.copiarFundo(instanciaEditada.bicho_id, `${serviceBichosPadrao.caminhoFundoPadrao}/${instanciaPadrao.fundo}`, instanciaEditada.fundo);
		// cria relação entre a primeira pessoa e a comunidade da instância, com todas as habilidades (participar, editar, moderar e representar)
		await serviceRelacoes.criarRelacao(pessoa.bicho_id, instancia.bicho_id, {participar: true, editar: true, moderar: true, representar: true});
	// nos outros casos, cria relação apenas de participação
	} else {
		await serviceRelacoes.criarRelacao(pessoa.bicho_id, process.env.INSTANCIA_ID, {participar: true, editar: false, moderar: false, representar: false});
	}

	// cria varanda da pessoa, com página padrão
	const comunitaria = false;
	//const varanda = await serviceVarandas.criarVaranda(pessoa.bicho_id, comunitaria);
	let paginaPadrao = {};
	paginaPadrao = await servicePaginasPadrao.gerarPaginaPadrao(comunitaria);
	console.log('paginaPadrao:', paginaPadrao);
	const novaPagina = await servicePaginas.criarPagina(pessoa.bicho_id, paginaPadrao);
	await serviceEdicoes.criarEdicao(pessoa.bicho_id, novaPagina, paginaPadrao.html);

	req.flash('aviso', 'Cadastro realizado com sucesso! Agora é só entrar!');
	return res.redirect('/autenticacao/login');

}));


module.exports = router;