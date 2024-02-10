const dataBlocos = require('../../data/varandas/dataBlocos');
const dataBlocosPagina = require('../../data/varandas/dataBlocosPagina');
const fs = require('fs');

exports.verBlocos = async function (comunitario) {
	const blocos = await dataBlocos.getBlocos(comunitario);
	return blocos.rows;
};

exports.verBloco = async function (bloco_id) {
	const bloco = await dataBlocos.getBloco(bloco_id);
	return bloco.rows[0];
};

exports.verBlocosEmUso = async function (pagina_id) {
	const blocos_pagina = await dataBlocosPagina.getBlocosPagina(pagina_id);
	return blocos_pagina.rows;
};

exports.atualizarBlocosEmUso = async function (html, pagina_id) {
// html já deve chegar validado e sem comentários

	// lê html e captura lista de blocos com seus bloco_id (do nome da tag) e bloco_pagina_id (do atributo "v_id")
	const blocoRegex = /<(v-(?:\w+-*)+)(?:\s+(?:\w+="(?:\s*[A-Za-zÀ-ü0-9]*(?:-[A-Za-zÀ-ü0-9]*)*\s*(?::*(?:\s*\w+)+;)?)*")*)*>/g; // regex captura formatos <v-nome-do-bloco> e <v-nome-do-bloco prop1="valor" style="margin: 0 auto; font-family: monospace">
	let blocos = html.matchAll(blocoRegex);
	let arrayBlocos = [];
	for (const bloco of blocos) {
		arrayBlocos.push({tag: bloco[0], bloco_id: bloco[1], index: bloco['index']});
	}
	console.log('arrayBlocos:', arrayBlocos);
	const idRegex = /v_id="(\d*)"/g; // regex captura atributo v_id
	arrayBlocos.forEach(b => {
		//let idMatch = idRegex.exec(b.tag);
		let idMatchAll = b.tag.matchAll(idRegex);
		let idMatch;
		for (const bzim of idMatchAll) {
			idMatch = bzim;
		}

		if (idMatch) {
			b.bloco_pagina_id = idMatch[1] ? parseInt(idMatch[1]) : null;
		} else {
			b.bloco_pagina_id = null;
		}
	});
			
	// verifica se o bloco tem correspondente na tabela blocos_paginas e cria registro se não houver
	let dataBlocos = (await dataBlocosPagina.getBlocosPagina(pagina_id)).rows;
	if (arrayBlocos.length > 0) {
		for (let i = 0; i < arrayBlocos.length; i++) {
			let b = arrayBlocos[i];
			if (dataBlocos.length > 0) {
				for (let j = 0; j < dataBlocos.length; j++) {
					let d = dataBlocos[j];
					if (b.bloco_pagina_id === d.bloco_pagina_id) {
						b.jaTem = true;
					}
				}
			}
			if (b.jaTem !== true) {
				b.jaTem = false;
				b.pagina_id = pagina_id;
				let response = await dataBlocosPagina.createBlocoPagina(b.pagina_id, b.bloco_id);
				b.bloco_pagina_id = response.rows[0].bloco_pagina_id;
			}
		}
	}

	// verifica os blocos que tem registro na tabela blocos_paginas mas não estão mais no html e apaga esses registros
	if (dataBlocos.length > 0) {
		for (let i = 0; i < dataBlocos.length; i++) {
			let d = dataBlocos[i];
			if (arrayBlocos.length > 0) {
				arrayBlocos.forEach(b => {
					if (b.bloco_pagina_id === d.bloco_pagina_id) {
						d.jaTem = true;
					}
				});
			}
			if (!d.jaTem) {
				await dataBlocosPagina.deleteBlocoPagina(d.bloco_pagina_id);
			}
		}
	}

		
	return arrayBlocos;
};

exports.atualizarHtml = async function (html, blocos) {
// edita html e adiciona propriedade v_id="${bloco_pagina_comunitaria_id}" para cada bloco que não a tem
	let aumentoDaString = 0;
	let novoHtml = html;
	for (let i = 0; i < blocos.length; i++) {
		let b = blocos[i];
		let primeiraParte = novoHtml.slice(0, b.index + aumentoDaString);
		let ultimaParte = novoHtml.slice(b.index + b.tag.length + aumentoDaString);
		let oldBTagLength = b.tag.length;
		if (b.jaTem === false || null || undefined) {
			b.tag = b.tag.replace(`${b.bloco_id}`,`${b.bloco_id} v_id="${b.bloco_pagina_id}"`);
		}
		novoHtml = `${primeiraParte}${b.tag}${ultimaParte}`;
		aumentoDaString += b.tag.length - oldBTagLength;
	}

	return novoHtml;
};