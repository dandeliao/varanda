const dataPertencimentos = require('../../data/bichos/dataPertencimentos');

exports.criarPertencimento = async function (bichoId, comunidadeId, habilidades) {

	const dataPertencimento = await dataPertencimentos.postPertencimento(bichoId, comunidadeId, habilidades);
	if (dataPertencimento.rowCount === 0) throw new Error ('Bicho não pôde ser cadastrado na comunidade.');

	return dataPertencimento.rows[0];

};