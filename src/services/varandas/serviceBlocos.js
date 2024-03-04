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