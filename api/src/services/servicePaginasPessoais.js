const dataPaginasPessoais = require('../data/dataPaginasPessoais');
const dataBlocosPaginasPessoais = require('../data/dataBlocosPaginasPessoais');
const path = require('path');
const fs = require('fs');
const staticPath = '../../static'

exports.getPaginasPessoais = async function (pessoaId) {
	let objetoPaginas = await dataPaginasPessoais.getPaginasPessoais(pessoaId);
	for (let i = 0; i < objetoPaginas.rows.length; i++) {
		let objetoBlocosPagina = await dataBlocosPaginasPessoais.getBlocosPaginaPessoal(objetoPaginas.rows[i].pagina_pessoal_id);
		objetoPaginas.rows[i].blocos = objetoBlocosPagina.rows;
	}
	const sortedPaginas = objetoPaginas.rows.sort((a, b) => {
		return a.ordem - b.ordem;
	});
	return sortedPaginas;
};

exports.getPaginaPessoal = async function (pessoaId, paginaId) {
	const caminho = path.join(path.resolve(__dirname, staticPath), 'pessoas', `${pessoaId}`, 'paginas', `${paginaId}.html`);
	return caminho;
};

exports.getBlocosPaginaPessoal = async function (paginaId) {
	let objetoBlocosPagina = await dataBlocosPaginasPessoais.getBlocosPaginaPessoal(paginaId);
	return objetoBlocosPagina;
};

exports.createPaginaPessoal = async function (dados) {
	const dataResponse = await dataPaginasPessoais.createPaginaPessoal(dados);
	const paginaId = dataResponse.rows[0].pagina_pessoal_id;

	let blocos = await updateBlocosPaginaPessoal(dados.html, paginaId);
	let html = await updateHtmlBlocos(dados.html, blocos);

	const caminho = path.join(path.resolve(__dirname, staticPath), 'pessoas', `${dados.pessoa_id}`, 'paginas', `${paginaId}.html`);
	fs.writeFile(caminho, html, erro => {
		if (erro) {
			throw erro;
		}
	});
	return dataResponse.rows[0];
};

exports.editPaginaPessoal = async function (dados) {
	const dataResponse = await dataPaginasPessoais.editPaginaPessoal(dados);
	const paginaId = dataResponse.rows[0].pagina_pessoal_id;

	let blocos = await updateBlocosPaginaPessoal(dados.html, paginaId);
	let html = await updateHtmlBlocos(dados.html, blocos);

	const caminho = path.join(path.resolve(__dirname, staticPath), 'pessoas', `${dados.pessoa_id}`, 'paginas', `${paginaId}.html`);
	fs.writeFile(caminho, await html, erro => {
		if (erro) {
			throw erro;
		}
	});
	return dataResponse.rows[0];
};

exports.deletePaginaPessoal = async function (dados) {
	const dataResponse = await dataPaginasPessoais.deletePaginaPessoal(dados);
	const paginaId = dataResponse.rows[0].pagina_pessoal_id;
	const caminho = path.join(path.resolve(__dirname, staticPath), 'pessoas', `${dados.pessoa_id}`, 'paginas', `${paginaId}.html`);
	fs.unlink(caminho, (err) => {
		if (err) {
			if (err.code !== 'ENOENT') { // se o erro for arquivo não encontrado, não faz nada
				throw err;
			}
		}
	});
};

// ---
// Funções auxiliares

async function updateBlocosPaginaPessoal (html, pagina_pessoal_id) {

	// html já deve chegar validado e sem comentários

	// lê html e captura lista de blocos com seus bloco_id (do nome da tag) e bloco_pagina_pessoal_id (do atributo "m_id")
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
			b.bloco_pagina_pessoal_id = idMatch[1] ? parseInt(idMatch[1]) : null;
		} else {
			b.bloco_pagina_pessoal_id = null;
		}
	});
			
	// verifica se o bloco tem correspondente na tabela blocos_paginas_pessoais e cria registro se não houver
	let dataBlocos = (await dataBlocosPaginasPessoais.getBlocosPaginaPessoal(pagina_pessoal_id)).rows;
	if (arrayBlocos.length > 0) {
		for (let i = 0; i < arrayBlocos.length; i++) {
			let b = arrayBlocos[i];
			if (dataBlocos.length > 0) {
				for (let j = 0; j < dataBlocos.length; j++) {
					let d = dataBlocos[j];
					if (b.bloco_pagina_pessoal_id === d.bloco_pagina_pessoal_id) {
						b.jaTem = true;
					}
				}
			}
			if (b.jaTem !== true) {
				b.jaTem = false;
				b.pagina_pessoal_id = pagina_pessoal_id;
				let response = await dataBlocosPaginasPessoais.createBlocoPaginaPessoal(b);
				b.bloco_pagina_pessoal_id = await response.rows[0].bloco_pagina_pessoal_id;
			}
		}
	}

	// verifica os blocos que tem registro na tabela blocos_paginas_pessoais mas não estão mais no html e apaga esses registros
	if (dataBlocos.length > 0) {
		for (let i = 0; i < dataBlocos.length; i++) {
			let d = dataBlocos[i];
			if (arrayBlocos.length > 0) {
				arrayBlocos.forEach(b => {
					if (b.bloco_pagina_pessoal_id === d.bloco_pagina_pessoal_id) {
						d.jaTem = true;
					}
				});
			}
			if (!d.jaTem) {
				let response = await dataBlocosPaginasPessoais.deleteBlocoPaginaPessoal(d);
			}
		}
	}

		
	return arrayBlocos;
}

// edita html e adiciona propriedade m_id="${bloco_pagina_pessoal_id}" para cada bloco que não a tem
async function updateHtmlBlocos(html, blocos) {
	let aumentoDaString = 0;
	let novoHtml = html;
	for (let i = 0; i < blocos.length; i++) {
		let b = blocos[i];
		let primeiraParte = novoHtml.slice(0, b.index + aumentoDaString);
		let ultimaParte = novoHtml.slice(b.index + b.tag.length + aumentoDaString);
		let oldBTagLength = b.tag.length;
		if (b.jaTem === false || null || undefined) {
			b.tag = b.tag.replace(`${b.bloco_id}`,`${b.bloco_id} m_id="${b.bloco_pagina_pessoal_id}"`);
		}
		novoHtml = `${primeiraParte}${b.tag}${ultimaParte}`;
		aumentoDaString += b.tag.length - oldBTagLength;
	}

	return novoHtml;
}