const asyncHandler 				                = require('express-async-handler');
const customError	 			                = require('http-errors');
const servicePessoas 							= require('../../services/bichos/servicePessoas');
const serviceBichos 							= require('../../services/bichos/serviceBichos');
const serviceBichosPadrao 						= require('../../services/bichos/serviceBichosPadrao');
const serviceConvites 							= require('../../services/bichos/serviceConvites');
const serviceComunidades 						= require('../../services/bichos/serviceComunidades');
const serviceRelacoes 							= require('../../services/bichos/serviceRelacoes');
const serviceVarandas 							= require('../../services/varandas/serviceVarandas');
const servicePaginasPadrao 						= require('../../services/varandas/servicePaginasPadrao');
const servicePaginas							= require('../../services/varandas/servicePaginas');
const serviceEdicoes							= require('../../services/varandas/serviceEdicoes');
const { validarPostPessoa, validarPutPessoa } 	= require('../../validations/validateBichos');
const { params, objetoRenderizavel }			= require('../../utils/utilControllers');
require('dotenv').config();

exports.getVaranda = asyncHandler(async (req, res, next) => { // params.bicho_id == varanda_id; query.bicho_id == usuarie_id

	const { varanda_id } = params(req);

	const view = `varandas/${varanda_id}/inicio`

	let usuarie_id;
	if (req.isAuthenticated()) {
		usuarie_id = req.user.bicho_id;
		if(req.query.bicho_id) {
			const permissoesBicho = await serviceRelacoes.verRelacao(usuarie_id, req.query.bicho_id);
			if (permissoesBicho.representar) usuarie_id = req.query.bicho_id;
		}
	}

	const obj_render = objetoRenderizavel(req, res, varanda_id, 'inicio', usuarie_id);
	res.render(view, obj_render);
	
});

exports.postCadastro = asyncHandler(async (req, res, next) => {

    const { value, error } = validarPostPessoa(req.body);
    console.log([value, error.message]);
	if (error) {
	    req.flash('error', error.message);
        return res.redirect('/varanda/cadastrar');
	} else {
        req.flash('message', 'Cadastro realizado com sucesso! Agora é só entrar.')
        return res.redirect('/varanda/entrar');
    }

	/* const pessoa = {
		bicho_id: req.body.bicho_id,
		nome: req.body.nome,
		email: req.body.email,
		senha: req.body.senha
	};
	
	// se a instância já tem uma comunidade principal, verifica se precisa de convite e usa o convite se for o caso
	const comunidadeDaInstancia = await serviceComunidades.verComunidade(process.env.INSTANCIA_ID);
	if (comunidadeDaInstancia) {
		if (!comunidadeDaInstancia.participacao_livre) {
			if (comunidadeDaInstancia.participacao_com_convite) {
				if (req.body.convite_id) {
					const convite = await serviceConvites.verConvite(req.body.convite_id);
					if (!convite || convite.comunidade_id !== process.env.INSTANCIA_ID) throw customError(404, `Não foi possível encontrar esse convite para ${process.env.INSTANCIA_ID}`);
					await serviceConvites.deletarConvite(req.body.convite_id);
				} else {
					throw customError(403, `Não é possível registrar pessoa sem um convite para ${process.env.INSTANCIA_ID}`);
				}
			}
		}
	}
	
	const bichoExiste = await serviceBichos.verBicho(pessoa.bicho_id);
	if (bichoExiste) throw customError(409, `O apelido @${pessoa.bicho_id} já existe. Por favor, escolha outro apelido.`);
	
	await servicePessoas.registrarPessoa(pessoa);
	
	// adiciona avatar e fundo padrão
	const bichoPadrao = await serviceBichosPadrao.sortearBichoPadrao();
	const novaPessoa = await serviceBichos.editarBicho(pessoa.bicho_id, {
		//descricao: bichoPadrao.descricao,
		avatar: 'avatar.jpg',
		descricao_avatar: bichoPadrao.descricao_avatar,
		fundo: 'fundo.jpg',
		descricao_fundo: bichoPadrao.descricao_fundo
	});
	await serviceBichos.copiarAvatar(novaPessoa.bicho_id, `${serviceBichosPadrao.caminhoAvatarPadrao}/${bichoPadrao.avatar}`, novaPessoa.avatar);
	await serviceBichos.copiarFundo(novaPessoa.bicho_id, `${serviceBichosPadrao.caminhoFundoPadrao}/${bichoPadrao.fundo}`, novaPessoa.fundo);

	// se for o primeiro bicho da instância, cria também a comunidade principal da instância
	const bichos = await serviceBichos.verBichos();
	if (bichos.length === 1) {
		const instancia = {
			bicho_id: process.env.INSTANCIA_ID,
			nome: process.env.INSTANCIA_ID,
			descricao: `Bem-vinde à ${process.env.INSTANCIA_ID}!`
		};
		await serviceComunidades.criarComunidade(instancia, pessoa.bicho_id);
		// adiciona avatar e fundo padrão
		const instanciaPadrao = await serviceBichosPadrao.sortearBichoPadrao();
		const instanciaEditada = await serviceBichos.editarBicho(instancia.bicho_id, {
			//descricao: bichoPadrao.descricao,
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
	const varanda = await serviceVarandas.criarVaranda(pessoa.bicho_id, comunitaria);
	const paginaPadrao = await servicePaginasPadrao.gerarPaginaPadrao(comunitaria);
	const novaPagina = await servicePaginas.criarPagina(varanda.varanda_id, paginaPadrao);
	await serviceEdicoes.criarEdicao(pessoa.bicho_id, novaPagina, paginaPadrao.html);

	res.status(201).json(novaPessoa); */

});

exports.postVaranda = asyncHandler(async (req, res, next) => {

});

exports.putVaranda = asyncHandler(async (req, res, next) => { // :bicho_id

    
});

exports.deleteVaranda = asyncHandler(async (req, res, next) => { // :bicho_id

});