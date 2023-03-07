const dataPaginasComunitarias = require('../data/dataPaginasComunitarias');
const dataPessoasComunidades = require('../data/dataPessoasComunidades');
const dataBlocosPaginasComunitarias = require('../data/dataBlocosPaginasComunitarias');
const path = require('path');
const fs = require('fs');
const staticPath = '../../static';

exports.getPaginasComunitarias = async function (comunidadeId) {
	let objetoPaginas = await dataPaginasComunitarias.getPaginasComunitarias(comunidadeId);
	/* objetoPaginas.rows.forEach(async row => {
		let objetoBlocosPagina = await dataBlocosPaginasComunitarias.getBlocosPaginaComunitaria(row.pagina_comunitaria_id);
		row.blocos = objetoBlocosPagina.rows;
	}); */
	const sortedPaginas = objetoPaginas.rows.sort((a, b) => {
		return a.pagina_comunitaria_id - b.pagina_comunitaria_id;
	});
	return sortedPaginas;
};

exports.getPaginaComunitaria = async function (comunidadeId, paginaId) {
	const caminho = path.join(path.resolve(__dirname, staticPath), 'comunidades', `${comunidadeId}`, 'paginas', `${paginaId}.html`);
	return caminho;

};

exports.getBlocosPaginaComunitaria = async function (paginaId) {
	let objetoBlocosPagina = await dataBlocosPaginasComunitarias.getBlocosPaginaComunitaria(paginaId);
	return objetoBlocosPagina;
};

exports.createPaginaComunitaria = async function (dados, pessoaId) {
	const dadosPessoaComunidade = await dataPessoasComunidades.getPessoaComunidade(pessoaId, dados.comunidade_id);
	if (dadosPessoaComunidade.rows[0].editar) {
		const dataResponse = await dataPaginasComunitarias.createPaginaComunitaria(dados);
		const paginaId = dataResponse.rows[0].pagina_comunitaria_id;

		let blocos = await updateBlocosPaginaComunitaria(dados.html, paginaId);
		let html = await updateHtmlBlocos(dados.html, blocos);	

		const caminho = path.join(path.resolve(__dirname, staticPath), 'comunidades', `${dados.comunidade_id}`, 'paginas', `${paginaId}.html`);
		fs.writeFile(caminho, html, erro => {
			if (erro) {
				throw erro;
			}
		});
		return dataResponse.rows[0];
	} else {
		throw new Error ('pessoa não tem habilidade para acessar este recurso');
	}
};

exports.editPaginaComunitaria = async function (dados, pessoaId) {
	const dadosPessoaComunidade = await dataPessoasComunidades.getPessoaComunidade(pessoaId, dados.comunidade_id);
	if (dadosPessoaComunidade.rows[0].editar) {
		const dataResponse = await dataPaginasComunitarias.editPaginaComunitaria(dados);
		const paginaId = dataResponse.rows[0].pagina_comunitaria_id;

		let blocos = await updateBlocosPaginaComunitaria(dados.html, paginaId);
		let html = await updateHtmlBlocos(dados.html, blocos);	

		const caminho = path.join(path.resolve(__dirname, staticPath), 'comunidades', `${dados.comunidade_id}`, 'paginas', `${paginaId}.html`);
		fs.writeFile(caminho, html, erro => {
			if (erro) {
				throw erro;
			}
		});
		return dataResponse.rows[0];
	} else {
		throw new Error ('pessoa não tem habilidade para acessar este recurso');
	}
};

exports.deletePaginaComunitaria = async function (dados, pessoaId) {
	const dadosPessoaComunidade = await dataPessoasComunidades.getPessoaComunidade(pessoaId, dados.comunidade_id);
	if (dadosPessoaComunidade.rows[0].editar) {
		const dataResponse = await dataPaginasComunitarias.deletePaginaComunitaria(dados);
		const paginaId = dataResponse.rows[0].pagina_comunitaria_id;
		const caminho = path.join(path.resolve(__dirname, staticPath), 'comunidades', `${dados.comunidade_id}`, 'paginas', `${paginaId}.html`);
		fs.unlink(caminho, (err) => {
			if (err) {
				if (err.code !== 'ENOENT') { // se o erro for arquivo não encontrado, não faz nada
					throw err;
				}
			}
		});
	} else {
		throw new Error ('pessoa não tem habilidade para acessar este recurso');
	}
};

// ---
// Funções auxiliares

async function updateBlocosPaginaComunitaria (html, pagina_comunitaria_id) {

	// html já deve chegar validado e sem comentários

	// lê html e captura lista de blocos com seus bloco_id (do nome da tag) e bloco_pagina_comunitaria_id (do atributo "m_id")
	const blocoRegex = /<(v-(?:\w+-*)+)(?:\s+(?:\w+="(?:\s*[A-Za-zÀ-ü0-9]*(?:-[A-Za-zÀ-ü0-9]*)*\s*(?::*(?:\s*\w+)+;)?)*")*)*>/g; // regex captura formatos <v-nome-do-bloco> e <v-nome-do-bloco prop1="valor" style="margin: 0 auto; font-family: monospace">
	let blocos = html.matchAll(blocoRegex);
	let arrayBlocos = [];
	for (const bloco of blocos) {
		arrayBlocos.push({tag: bloco[0], bloco_id: bloco[1], index: bloco['index']});
	}
	console.log('arrayBlocos:', arrayBlocos);
	const idRegex = /m_id="(\d*)"/g; // regex captura atributo m_id
	arrayBlocos.forEach(b => {
		//let idMatch = idRegex.exec(b.tag);
		let idMatchAll = b.tag.matchAll(idRegex);
		let idMatch;
		for (const bzim of idMatchAll) {
			idMatch = bzim;
		}

		if (idMatch) {
			b.bloco_pagina_comunitaria_id = idMatch[1] ? parseInt(idMatch[1]) : null;
		} else {
			b.bloco_pagina_comunitaria_id = null;
		}
	});
			
	// verifica se o bloco tem correspondente na tabela blocos_paginas_comunitarias e cria registro se não houver
	let dataBlocos = (await dataBlocosPaginasComunitarias.getBlocosPaginaComunitaria(pagina_comunitaria_id)).rows;
	if (arrayBlocos.length > 0) {
		for (let i = 0; i < arrayBlocos.length; i++) {
			let b = arrayBlocos[i];
			if (dataBlocos.length > 0) {
				for (let j = 0; j < dataBlocos.length; j++) {
					let d = dataBlocos[j];
					if (b.bloco_pagina_comunitaria_id === d.bloco_pagina_comunitaria_id) {
						b.jaTem = true;
					}
				}
			}
			if (b.jaTem !== true) {
				b.jaTem = false;
				b.pagina_comunitaria_id = pagina_comunitaria_id;
				let response = await dataBlocosPaginasComunitarias.createBlocoPaginaComunitaria(b);
				b.bloco_pagina_comunitaria_id = await response.rows[0].bloco_pagina_comunitaria_id;
			}
		}
	}

	// verifica os blocos que tem registro na tabela blocos_paginas_comunitarias mas não estão mais no html e apaga esses registros
	if (dataBlocos.length > 0) {
		for (let i = 0; i < dataBlocos.length; i++) {
			let d = dataBlocos[i];
			if (arrayBlocos.length > 0) {
				arrayBlocos.forEach(b => {
					if (b.bloco_pagina_comunitaria_id === d.bloco_pagina_comunitaria_id) {
						d.jaTem = true;
					}
				});
			}
			if (!d.jaTem) {
				let response = await dataBlocosPaginasComunitarias.deleteBlocoPaginaComunitaria(d);
			}
		}
	}

		
	return arrayBlocos;
}

// edita html e adiciona propriedade m_id="${bloco_pagina_comunitaria_id}" para cada bloco que não a tem
async function updateHtmlBlocos(html, blocos) {
	let aumentoDaString = 0;
	let novoHtml = html;
	for (let i = 0; i < blocos.length; i++) {
		let b = blocos[i];
		let primeiraParte = novoHtml.slice(0, b.index + aumentoDaString);
		let ultimaParte = novoHtml.slice(b.index + b.tag.length + aumentoDaString);
		let oldBTagLength = b.tag.length;
		if (b.jaTem === false || null || undefined) {
			b.tag = b.tag.replace(`${b.bloco_id}`,`${b.bloco_id} m_id="${b.bloco_pagina_comunitaria_id}"`);
		}
		novoHtml = `${primeiraParte}${b.tag}${ultimaParte}`;
		aumentoDaString += b.tag.length - oldBTagLength;
	}

	return novoHtml;
}