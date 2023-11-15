const dataPaginas = require('../../data/varandas/dataPaginas');
const fs = require('fs');
const path = require('path');
const staticPath = '../../../static';

exports.verPaginas = async function (varanda_id, pagina_id, publica) {
	let resposta;
	if (pagina_id !== null) {
		const pagina = await dataPaginas.getPagina(pagina_id);
		resposta = pagina.rows[0];
	} else {
		const paginas = await dataPaginas.getPaginas(varanda_id, publica);
		resposta = paginas.rows;
	}
	
	return resposta;
};

exports.criarPagina = async function (varanda_id, dados) {

	let novaPagina = (await dataPaginas.createPagina(varanda_id, {titulo: dados.titulo, publica: dados.publica})).rows[0];

	// cria arquivo html da página
	const caminho = path.join(path.resolve(__dirname, staticPath), 'varandas', 'em_uso', `${varanda_id}`, `${novaPagina.pagina_id}.html`);
	fs.writeFile(caminho, dados.html, erro => {
		if (erro) {
			throw erro;
		}
	});

	return novaPagina;
};

exports.editarPagina = async function (pagina_id, dados) {
	const paginaEditada = await dataPaginas.editPagina(pagina_id, {titulo: dados.titulo, publica: dados.publica});
	
	// edita arquivo html da página
	const caminho = path.join(path.resolve(__dirname, staticPath), 'varandas', 'em_uso', `${paginaEditada.varanda_id}`, `${pagina_id}.html`);
	fs.writeFile(caminho, dados.html, erro => {
		if (erro) {
			throw erro;
		}
	});

	return paginaEditada.rows[0];
};

exports.deletarPagina = async function (pagina_id) {
	const paginaDeletada = (await dataPaginas.deletarPagina(pagina_id)).rows[0];

	// deleta o arquivo html da página
	const caminhoPagina = path.join(path.resolve(__dirname, staticPath), 'varandas', 'em_uso', `${paginaDeletada.varanda_id}` `${pagina_id}.html`);
	fs.unlink(caminhoPagina, (err) => {
		if (err) {
			if (err.code !== 'ENOENT') { // se o erro for arquivo não encontrado, não faz nada
				throw err;
			}
		}
	});

	return paginaDeletada;
};