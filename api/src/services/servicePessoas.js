const dataPessoas = require('../data/dataPessoas');
const dataAutenticacao = require('../data/dataAutenticacao');

exports.getPessoas = async function () {
	const objetoPessoas = await dataPessoas.getPessoas();
	return objetoPessoas.rows;
};

exports.getPessoa = async function (pessoaId) {
	const objetoPessoa = await dataPessoas.getPessoa(pessoaId);
	if (objetoPessoa.rowCount === 0) throw new Error ('pessoa não encontrada');
	return objetoPessoa.rows[0];
};

exports.putPessoa = async function (pessoaId, pessoa) {
	const objetoPessoa = await dataPessoas.putPessoa(pessoaId, pessoa);
	if (objetoPessoa.rowCount === 0) throw new Error('pessoa não encontrada');
	return objetoPessoa.rows[0];
};

exports.deletePessoa = async function (pessoaId) {
	const vereditoSegredos = await dataAutenticacao.deleteSegredos(pessoaId);
	const vereditoPessoas = await dataPessoas.deletePessoa(pessoaId);
	if (vereditoPessoas.rowCount === 0) throw new Error('pessoa não encontrada');
	if (vereditoSegredos.rowCount === 0) throw new Error('dados de email e senha não encontrados');
	return vereditoPessoas.rowCount;
};