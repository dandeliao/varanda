const dataBlocos = require('../../data/varandas/dataBlocos');
const path = require('path');
const fs = require('fs');

exports.verBlocos = async function (comunitario) {
	const blocos = await dataBlocos.getBlocos(comunitario);
	return blocos.rows;
};

exports.verBloco = async function (bloco_id) {
	const bloco = await dataBlocos.getBloco(bloco_id);
	return bloco.rows[0];
};

exports.criarBlocos = async function () {
	const caminho = path.join(path.resolve(__dirname, '../..'), 'config', `blocos.ini`);
	fs.readFile(caminho, 'utf8', async (err, data) => {
		if (err) throw err;
		let grupos = data.toString().split('\n\n');
		let bloco = {};
		let linhas = [];
		for (let i = 0; i < grupos.length; i++) {
			linhas = grupos[i].toString().split('\n');
			let variaveis = '{}';
			if (linhas[3]) { // variáveis do bloco
				variaveis = `{${linhas[3].toString()}}`;
			}
			bloco = {
				bloco_id: 	 linhas[0],
				descricao: 	 linhas[1],
				comunitario: linhas[2] === 'true' ? true : false,
				variaveis:	 variaveis 
			};
			await dataBlocos.postBloco(bloco.bloco_id, bloco.descricao, bloco.comunitario, bloco.variaveis);
		}
		return;
	});
}