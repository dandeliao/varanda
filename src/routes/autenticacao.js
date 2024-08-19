const servicePessoas 		= require('../services/bichos/servicePessoas');
const serviceBichos 		= require('../services/bichos/serviceBichos');
const serviceBichosPadrao 	= require('../services/bichos/serviceBichosPadrao');
const serviceConvites 		= require('../services/bichos/serviceConvites');
const serviceComunidades 	= require('../services/bichos/serviceComunidades');
const servicePreferencias  	= require('../services/bichos/servicePreferencias');
const serviceRecuperacoes	= require('../services/bichos/serviceRecuperacoes');
const serviceRelacoes 		= require('../services/bichos/serviceRelacoes');
const servicePaginasPadrao 	= require('../services/varandas/servicePaginasPadrao');
const servicePaginas		= require('../services/varandas/servicePaginas');
const serviceEdicoes		= require('../services/varandas/serviceEdicoes');
const serviceBlocos			= require('../services/varandas/serviceBlocos');
const { schemaPostPessoa, schemaPutRecuperar }	= require('../validations/validateBichos');
const asyncHandler 			= require('express-async-handler');
const express 				= require('express');
const router 				= express.Router();
const passport 				= require('passport');
const { messages } 			= require('joi-translation-pt-br');
require('dotenv').config();

router.get('/login', (req, res) => {

	res.render('autenticacao/login', {
		flash: {
            aviso: res.locals.flash_aviso,
            erro: res.locals.flash_erro,
			aviso_decod: decodeURIComponent(res.locals.flash_aviso),
			erro_decod: decodeURIComponent(res.locals.flash_erro)
        },
		query: req.query ? req.query : null
	});

});

router.get('/logout', (req, res) => {
	req.logout(err => {
		if (err) {
			req.flash('erro', 'Erro ao sair da varanda. Por favor, tente novamente.');
			return res.redirect('/');
		} else {
			req.flash('aviso', 'Logout feito com sucesso.');
			return res.redirect('/');
		}
	});
});

router.get('/cadastro', (req, res) => {
	res.render('autenticacao/cadastro', {
		flash: {
            aviso: res.locals.flash_aviso,
            erro: res.locals.flash_erro,
			aviso_decod: decodeURIComponent(res.locals.flash_aviso),
			erro_decod: decodeURIComponent(res.locals.flash_erro)
        },
		query: req.query ? req.query : null
	});
});

router.get('/recuperacao', async (req, res) => {
	const { bicho_id, recuperacao_id } = req.query;
	const recuperacao = await serviceRecuperacoes.verRecuperacao(bicho_id);
	let view, obj_render;
	if (recuperacao && (recuperacao.recuperacao_id === recuperacao_id)) {
		view = 'autenticacao/recuperacao',
		obj_render = {
			flash: {
				aviso: res.locals.flash_aviso,
				erro: res.locals.flash_erro,
				aviso_decod: decodeURIComponent(res.locals.flash_aviso),
				erro_decod: decodeURIComponent(res.locals.flash_erro)
			},
			recuperacao_id: recuperacao_id,
			bicho_id: bicho_id
		}
	} else {
		req.flash('erro', 'O código de recuperação da conta não foi encontrado.');
		return res.redirect('/');
	}
	return res.render(view, obj_render);
});

router.put('/recuperacao', (req, res) => {
	const { value, error } = schemaPutRecuperar.validate(req.body, { messages });
	if (error) {
	    req.flash('erro', error.details[0].message);
        return res.redirect(303, '/autenticacao/recuperacao');
	}
	const { bicho_id, recuperacao_id, senha } = req.body;
	const pessoa = servicePessoas.editarSegredos(bicho_id, { recuperacao_id: recuperacao_id, senha: senha});
	if (!pessoa) {
		req.flash('erro', 'Erro no servidor ao tentar alterar a senha.');
		return res.redirect(303, '/autenticacao/recuperacao');
	}
	serviceRecuperacoes.deletarRecuperacao(recuperacao_id);
	req.flash('aviso', 'Senha alterada com sucesso! Agora é só fazer o login com a senha nova.');
	return res.redirect(303, '/autenticacao/login');
});

router.post('/login', passport.authenticate('local', {
	failureRedirect: '/autenticacao/login',
	failureFlash: true, // testar flash message, ver localização pt-br
	successRedirect: '/'
}));

router.post('/cadastro', asyncHandler( async (req, res) => {

    const { value, error } = schemaPostPessoa.validate(req.body, { messages });
	if (error) {
	    req.flash('erro', error.details[0].message);
        return res.redirect(303, '/autenticacao/cadastro');
	}

	const { bicho_id, nome, email, senha } = req.body;
	const pessoa = {
		bicho_id: bicho_id,
		nome: nome,
		email: email.toLowerCase(),
		senha: senha
	};

	// verifica se é a primeira pessoa a se cadastrar
	const bichos_anteriores = await serviceBichos.verBichos();
	if (bichos_anteriores.length > 0) {
		// se não é a primeira pessoa, verifica se o cadastro está aberto e se precisa de convite.
			// participacao_livre 								<-- pode entrar sem convite
			// !participacao_livre && participacao_com_convite 	<-- pode entrar com convite válido
			// !participacao_livre && !participacao_com_convite <-- não pode entrar
		const instancia = await serviceComunidades.verComunidade(process.env.INSTANCIA_ID);
		if (!instancia.participacao_livre) {
			if (instancia.participacao_com_convite) {
				if (req.body.convite_id) {
					const convite = await serviceConvites.verConvite(req.body.convite_id);
					if (!convite || convite.comunidade_id !== process.env.INSTANCIA_ID) {
						req.flash ('erro', `O cadastro falhou. O seu convite para ${process.env.INSTANCIA_ID} não é válido ou já foi usado.`);
						return res.redirect(303, '/');
					}
					await serviceConvites.deletarConvite(req.body.convite_id);
				} else {
					req.flash('erro', 'O cadastro falhou. Você precisa de um convite para se cadastrar.');
					return res.redirect(303, '/');
				}
			} else {
				req.flash('erro', 'A instância está fechada para cadastros neste momento.');
				return res.redirect(303, '/');
			}
		}
	} else {
		// se é a primeira pessoa, carrega blocos e bichos padrão no banco de dados
		await serviceBlocos.criarBlocos();
		await serviceBichosPadrao.criarBichosPadrao();
	}
	
	const bichoExiste = await serviceBichos.verBicho(pessoa.bicho_id.toLowerCase());
	if (bichoExiste) {
		req.flash('erro', `O apelido @${pessoa.bicho_id.toLowerCase()} já existe. Por favor, escolha outro apelido.`)
		return res.redirect(303, `/autenticacao/cadastro?convite=${req.body.convite_id}`);
	}
	
	let pessoaCriada = await servicePessoas.registrarPessoa(pessoa);
	await servicePreferencias.criarPreferencias(pessoaCriada.bicho_id);
	
	// adiciona avatar e fundo padrão
	const bichoPadrao = await serviceBichosPadrao.sortearBichoPadrao();
	const novaPessoa = await serviceBichos.editarBicho(pessoaCriada.bicho_id, {
		descricao: bichoPadrao.descricao,
		avatar: 'avatar.jpg',
		descricao_avatar: bichoPadrao.descricao_avatar,
		fundo: 'fundo.jpg',
		descricao_fundo: bichoPadrao.descricao_fundo
	});
	await serviceBichos.copiarAvatar(novaPessoa.bicho_id, `${serviceBichosPadrao.caminhoAvatarPadrao}/${bichoPadrao.avatar}`, novaPessoa.avatar);
	await serviceBichos.copiarFundo(novaPessoa.bicho_id, `${serviceBichosPadrao.caminhoFundoPadrao}/${bichoPadrao.fundo}`, novaPessoa.fundo);

	// se for o primeiro bicho da instância, cria a comunidade principal da instância
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
		await serviceRelacoes.criarRelacao(pessoaCriada.bicho_id, instancia.bicho_id, {participar: true, editar: true, moderar: true, representar: true});
		// cria página inicial da instância
		const comunitaria = true;
		let paginaPadrao = {};
		paginaPadrao = await servicePaginasPadrao.gerarPaginaPadrao(comunitaria);
		paginaPadrao.pagina_vid = `${instanciaEditada.bicho_id}/inicio`;
		const novaPagina = await servicePaginas.criarPagina(instanciaEditada.bicho_id, paginaPadrao);
		await serviceEdicoes.criarEdicao(instanciaEditada.bicho_id, novaPagina, paginaPadrao.html);

	// nos outros casos, cria relação apenas de participação
	} else {
		await serviceRelacoes.criarRelacao(pessoaCriada.bicho_id, process.env.INSTANCIA_ID, {participar: true, editar: false, moderar: false, representar: false});
	}

	// cria página inicial da pessoa
	const comunitaria = false;
	let paginaPadrao = {};
	paginaPadrao = await servicePaginasPadrao.gerarPaginaPadrao(comunitaria);
	paginaPadrao.pagina_vid = `${pessoaCriada.bicho_id}/inicio`;
	const novaPagina = await servicePaginas.criarPagina(pessoaCriada.bicho_id, paginaPadrao);
	await serviceEdicoes.criarEdicao(pessoaCriada.bicho_id, novaPagina, paginaPadrao.html);

	req.flash('aviso', 'Cadastro realizado com sucesso! Agora é só entrar!');
	return res.redirect(303, '/autenticacao/login');

}));


module.exports = router;