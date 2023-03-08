const express = require('express');
const router = express.Router();
const taAutenticade = require('../middlewares/authentication');
const path = require('path');
const multer = require('multer');
const update = multer({ dest: path.join(path.resolve(__dirname, '../../static/temp')) });
const servicePessoas = require('../services/servicePessoas');
const servicePaginasPessoais = require('../services/servicePaginasPessoais');
const serviceObjetosPessoais = require('../services/serviceObjetosPessoais');
const serviceImagensPessoais = require('../services/serviceImagensPessoais');
const serviceTextosPessoais = require('../services/serviceTextosPessoais');

router.use(taAutenticade);

// ---
// dados gerais das pessoas

router.get('/', async (req, res, next) => {
	try {
		const pessoas = await servicePessoas.getPessoas();
		res.json(pessoas);
	} catch (erro) {
		next(erro);
	}
	
});

router.get('/:arroba', async (req, res, next) => {
	try {
		const pessoa = await servicePessoas.getPessoa(req.params.arroba);
		res.json(pessoa);
	} catch (erro) {
		next(erro);
	}
	
});

router.put('/:arroba', async (req, res, next) => {
	try {
		const pessoa = req.body;
		await servicePessoas.putPessoa(req.params.arroba, pessoa);
		res.status(204).end();
	} catch (erro) {
		next(erro);
	}
	
});

router.delete('/:arroba', async (req, res, next) => {
	try {
		const pessoaId = req.params.arroba;
		await servicePessoas.deletePessoa(pessoaId);
		res.status(204).end();
	} catch (erro) {
		next(erro);
	}
	
});

// ---
// páginas pessoais

router.get('/:arroba/paginas', async (req, res, next) => {
	try {
		const paginas = await servicePaginasPessoais.getPaginasPessoais(req.params.arroba);
		res.json(paginas);
	} catch (erro) {
		next(erro);
	}
	
});

router.get('/:arroba/:pagina', async (req, res, next) => {
	try {
		// falta middleware (ou usar o service) para verificar autorização (páginas públicas podem ser vistas por todes, páginas privadas só por quem criou)
		const caminhoDoArquivo = await servicePaginasPessoais.getPaginaPessoal(req.params.arroba, req.params.pagina);
		res.sendFile(caminhoDoArquivo);
	} catch (erro) {
		next(erro);
	}
});

router.get('/:arroba/:pagina/blocos', async (req, res, next) => {
	try {
		const blocos = await servicePaginasPessoais.getBlocosPaginaPessoal(req.params.pagina);
		res.json(blocos);
	} catch (erro) {
		next(erro);
	}
});


router.post('/:arroba/paginas', async (req, res, next) => {
	try {
		const dados = {
			pessoa_id: req.params.arroba,
			titulo: req.body.titulo,
			publica: req.body.publica,
			html: req.body.html
		};

		// falta verificar autorização (com base na pessoa autenticada), validar dados e sanitizar o html

		const dadosCriados = await servicePaginasPessoais.createPaginaPessoal(dados);
		res.status(201).json(dadosCriados);

	} catch (erro) {
		next (erro);
	}
});

router.put('/:arroba/:pagina', async (req, res, next) => {
	try {
		const dados = {
			pessoa_id: req.params.arroba,
			pagina_pessoal_id: req.params.pagina,
			titulo: req.body.titulo,
			publica: req.body.publica,
			html: req.body.html
		};

		// falta verificar autorização (com base na pessoa autenticada), validar dados e sanitizar o html

		const dadosModificados = await servicePaginasPessoais.editPaginaPessoal(dados);
		res.status(200).json(dadosModificados);

	} catch (erro) {
		next (erro);
	}
});

router.delete('/:arroba/:pagina', async (req, res, next) => {
	try {
		const dados = {
			pessoa_id: req.params.arroba,
			pagina_pessoal_id: req.params.pagina
		};

		// falta verificar autorização (com base na pessoa autenticada) e validar dados

		await servicePaginasPessoais.deletePaginaPessoal(dados);
		res.status(204).end();

	} catch (erro) {
		next(erro);
	}
});

// ---
// objetos pessoais

router.get('/:arroba/objetos/avatar', async (req, res, next) => {
	try {
		const dadosDaPessoa = await servicePessoas.getPessoa(req.params.arroba);
		const nomeDoArquivo = dadosDaPessoa.avatar;
		const caminhoDoArquivo = path.join(path.resolve(__dirname, '../../static'), 'pessoas', req.params.arroba, 'imagens', nomeDoArquivo);
		res.sendFile(caminhoDoArquivo);
	} catch (erro) {
		next(erro);
	}
});

router.get('/:arroba/objetos/fundo', async (req, res, next) => {
	try {
		const dadosDaPessoa = await servicePessoas.getPessoa(req.params.arroba);
		const nomeDoArquivo = dadosDaPessoa.fundo;
		const caminhoDoArquivo = path.join(path.resolve(__dirname, '../../static'), 'pessoas', req.params.arroba, 'imagens', nomeDoArquivo);
		res.sendFile(caminhoDoArquivo);
	} catch (erro) {
		next(erro);
	}
});

router.get('/:arroba/objetos/comunidades', async (req, res, next) => {
	try {
		const comunidades = await serviceObjetosPessoais.getComunidadesPessoais(req.params.arroba);
		res.json(comunidades); 
	} catch (erro) {
		next(erro);
	}
});

router.get('/:arroba/objetos/comunidade', async (req, res, next) => { // comunidade?id=valor
	try {
		const pessoaComunidade = await serviceObjetosPessoais.getComunidadePessoal(req.params.arroba, req.query.id);
		res.json(pessoaComunidade);
	} catch (erro) {
		next(erro);
	}
});

router.post('/:arroba/objetos/comunidade', async (req, res, next) => { // comunidade?id=valor
	try {
		const pessoaComunidade = await serviceObjetosPessoais.enterComunidade(req.params.arroba, req.query.id);
		res.json(pessoaComunidade);
	} catch (erro) {
		next(erro);
	}
});

router.delete('/:arroba/objetos/comunidade', async (req, res, next) => { // comunidade?id=valor
	try {
		const pessoaComunidade = await serviceObjetosPessoais.leaveComunidade(req.params.arroba, req.query.id);
		res.json(pessoaComunidade);
	} catch (erro) {
		next (erro);
	}
});

router.put('/:arroba/objetos/comunidades/:comunidadeId'), async (req, res, next) => {
	try {
		const habilidades = req.body;
		const serviceResult = await serviceObjetosPessoais.editComunidadePessoal(req.params.arroba, req.params.comunidadeId, habilidades);
		res.json(serviceResult);
	} catch (erro) {
		next(erro);
	}
};

// imagens/álbuns pessoais

router.get('/:arroba/objetos/albuns', async (req, res, next) => {
	try {
		let albuns = await serviceImagensPessoais.getAlbunsPessoais(req.params.arroba);
		res.json(albuns);
	} catch (erro) {
		next(erro);
	}
});

router.get('/:arroba/objetos/album', async (req, res, next) => { //album?id=valor&capa=true
	try {
		if (req.query.capa) {
			let caminho = await serviceImagensPessoais.getCapaAlbumPessoal(req.params.arroba, req.query.id);
			res.sendFile(caminho);
		} else {
			res.send('serviço não implementado');
		}
	} catch (erro) {
		next(erro);
	}
});


router.post('/:arroba/objetos/album', async (req, res, next) => {
	try {
		const dados = {
			pessoa_id: 			req.params.arroba,
			album_pessoal_id: 	req.body.album_pessoal_id
		};
		const dadosCriados = await serviceImagensPessoais.postAlbumPessoal(dados);
		res.status(201).json(dadosCriados);
	} catch (erro) {
		next(erro);
	}
});

router.get('/:arroba/objetos/imagens', async (req, res, next) => { // opcional: imagens?id=album
	try {
		let imagens;
		if (req.query.album) {
			imagens = await serviceImagensPessoais.getImagensAlbumPessoal(req.params.arroba, req.query.album);
		} else {
			imagens = await serviceImagensPessoais.getImagensPessoais(req.params.arroba);
		}
		res.json(imagens);
	} catch (erro) {
		next(erro);
	}
	
});

router.get('/:arroba/objetos/imagem', async (req, res, next) => { // imagem?id=valor&info=true (info é opcional)
	try {

		// se a query inclui "info", envia apenas as informações sobre a imagem
		if (req.query.info) {
			const info = await serviceImagensPessoais.getInfoImagemPessoal(req.params.arroba, req.query.id);
			res.json(info);

		// caso contrário, envia o arquivo
		} else {
			const caminhoDoArquivo = await serviceImagensPessoais.getImagemPessoal(req.params.arroba, req.query.id);
			res.sendFile(caminhoDoArquivo);
		}

	} catch (erro) {
		next(erro);
	}
});

router.post('/:arroba/objetos/imagens', update.single('arquivo'), async (req, res, next) => {
	try {

		const dados = {
			pessoa_id: 			req.params.arroba,
			descricao: 			req.body.descricao,
			titulo: 			req.body.titulo,
			album_pessoal_id: 	req.body.album_pessoal_id
		};

		const dadosCriados = await serviceImagensPessoais.postImagemPessoal(dados, req.file);
		res.status(201).json(dadosCriados);

	} catch (erro) {
		next (erro);
	}
});

router.put('/:arroba/objetos/imagem', async (req, res, next) => { // imagem?id=valor
	try {
		const dados = {
			pessoa_id: req.params.arroba,
			imagem_pessoal_id: req.query.id,
			descricao: req.body.descricao,
			album: req.body.album
		};

		const dadosModificados = await serviceImagensPessoais.editImagemPessoal(dados);
		res.status(200).json(dadosModificados);

	} catch (erro) {
		next (erro);
	}
});

router.delete('/:arroba/objetos/imagem', async (req, res, next) => { // imagem?id=valor
	try {
		const dados = {
			pessoa_id: req.params.arroba,
			imagem_pessoal_id: req.query.id
		};

		await serviceImagensPessoais.deleteImagemPessoal(dados);
		res.status(204).end();

	} catch (erro) {
		next(erro);
	}
});

// textos/blogs pessoais

router.get('/:arroba/objetos/blogs', async (req, res, next) => {
	try {
		let blogs;
		blogs = await serviceTextosPessoais.getBlogsPessoais(req.params.arroba);
		res.json(blogs);
	} catch (erro) {
		next(erro);
	}
});

router.post('/:arroba/objetos/blog', async (req, res, next) => {
	try {
		const dados = {
			pessoa_id: 			req.params.arroba,
			blog_pessoal_id: 	req.body.blog_pessoal_id
		};
		const dadosCriados = await serviceTextosPessoais.postBlogPessoal(dados);
		res.status(201).json(dadosCriados);
	} catch (erro) {
		next(erro);
	}
});

router.get('/:arroba/objetos/textos', async (req, res, next) => { // opcional: textos?blog=nome-do-blog
	try {
		let textos;
		if (req.query.blog) {
			textos = await serviceTextosPessoais.getTextosBlogPessoal(req.params.arroba, req.query.blog);
		} else {
			textos = await serviceTextosPessoais.getTextosPessoais(req.params.arroba);
		}
		
		res.json(textos);
	} catch (erro) {
		next(erro);
	}
});

router.get('/:arroba/objetos/texto', async (req, res, next) => { // texto?id=valor&info=true
	try {

		// se a query inclui "info", envia apenas as informações sobre o texto
		if (req.query.info) {
			const info = await serviceTextosPessoais.getInfoTextoPessoal(req.params.arroba, req.query.id);
			res.json(info);

		// caso contrário, envia o arquivo
		} else {
			const caminhoDoArquivo = await serviceTextosPessoais.getTextoPessoal(req.params.arroba, req.query.id);
			res.sendFile(caminhoDoArquivo);
		}

	} catch (erro) {
		next(erro);
	}
});

router.post('/:arroba/objetos/textos', async (req, res, next) => {
	try {

		const dados = {
			pessoa_id: 				req.params.arroba,
			titulo: 				req.body.titulo,
			blog: 					req.body.blog,
			texto_pessoal_id: 		req.body.texto_pessoal_id
		};

		const dadosCriados = await serviceTextosPessoais.postTextoPessoal(dados);
		res.status(201).json(dadosCriados);

	} catch (erro) {
		next (erro);
	}
});

router.put('/:arroba/objetos/texto', async (req, res, next) => { // texto?id=valor
	try {
		const dados = {
			pessoa_id: 			req.params.arroba,
			texto_pessoal_id: 	req.query.id,
			titulo: 			req.body.titulo,
			blog: 				req.body.blog,
			texto:				req.body.texto
		};

		const dadosModificados = await serviceTextosPessoais.editTextoPessoal(dados);
		res.status(200).json(dadosModificados);

	} catch (erro) {
		next (erro);
	}
});

router.delete('/:arroba/objetos/texto', async (req, res, next) => { // texto?id=valor
	try {
		const dados = {
			pessoa_id: req.params.arroba,
			texto_pessoal_id: req.query.id
		};

		await serviceTextosPessoais.deleteTextoPessoal(dados);
		res.status(204).end();

	} catch (erro) {
		next(erro);
	}
});

module.exports = router;