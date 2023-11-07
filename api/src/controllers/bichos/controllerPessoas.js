const servicePessoas 							= require('../../services/bichos/servicePessoas');
const serviceBichos 							= require('../../services/bichos/serviceBichos');
const serviceBichosPadrao 						= require('../../services/bichos/serviceBichosPadrao');
const serviceConvites 							= require('../../services/bichos/serviceConvites');
const serviceComunidades 						= require('../../services/bichos/serviceComunidades');
const serviceRelacoes 							= require('../../services/bichos/serviceRelacoes');
const serviceVarandas 							= require('../../services/varandas/serviceVarandas');
const servicePaginasPadrao 						= require('../../services/varandas/servicePaginasPadrao');
const servicePaginas							= require('../../services/varandas/servicePaginas');
const { validarPostPessoa, validarPutPessoa } 	= require('../../validations/validateBichos');
const asyncHandler 								= require('express-async-handler');
const customError 								= require('http-errors');
require('dotenv').config();

exports.getPessoas = asyncHandler(async (req, res, next) => {
	const pessoas = await servicePessoas.verPessoas();
	res.status(200).json(pessoas);
});

exports.getPessoa = asyncHandler(async (req, res, next) => {
	const pessoa = await servicePessoas.verPessoa(req.params.arroba);
	if (!pessoa) throw customError(404, `Pessoa @${req.params.arroba} não encontrada.`);
	res.status(200).json(pessoa);
});

exports.postPessoa = asyncHandler(async (req, res, next) => {

	const { erro, resultado } = validarPostPessoa(req.body);
	if (erro) {
		console.log(erro);
		return res.status(400).json(erro.details);
	}

	const pessoa = {
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

	// cria varanda da pessoa, com página padrão
	const comunitaria = false;
	const varanda = (await serviceVarandas.criarVaranda(pessoa.bicho_id, comunitaria)).rows[0];
	const paginaPadrao = (await servicePaginasPadrao.sortearPaginaPadrao(comunitaria)).rows[0];
	await servicePaginas.criarPagina(varanda.varanda_id, paginaPadrao);

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

	res.status(201).json(novaPessoa);
});

exports.putPessoa = asyncHandler(async (req, res, next) => {

	const { erro, resultado } = validarPutPessoa(req.body);
	if (erro) {
		console.log(erro);
		return res.status(400).json(erro.details);
	}

	if (req.user.bicho_id !== req.params.arroba) throw customError(404, `O bicho @${req.user.bicho_id} não pode editar os dados de @${req.params.arroba}.`);
	const pessoaAntes = await servicePessoas.verPessoa(req.params.arroba);
	if (!pessoaAntes) throw customError(404, `Pessoa @${req.params.arroba} não encontrada.`);
	const pessoaDepois = await servicePessoas.editarSegredos(req.params.arroba, req.body);
	res.status(200).json(pessoaDepois);
});

exports.deletePessoa = asyncHandler(async (req, res, next) => {
	if (req.user.bicho_id !== req.params.arroba) {
		const permissoesGlobais = await serviceRelacoes.verRelacao(req.user.bicho_id, process.env.INSTANCIA_ID);
		if (!permissoesGlobais.moderar) {
			throw customError(403, `O bicho @${req.user.bicho_id} não pode remover a pessoa ${req.params.arroba}. Procure a equipe de moderação da instância.`);
		}
	}

	await servicePessoas.deletarPessoa(req.params.arroba);
	
	// apaga a varanda da pessoa
	const varanda = await serviceVarandas.verVarandas(req.params.arroba);
	await serviceVarandas.deletarVaranda(varanda.varanda_id);

	res.status(204).end();
});