const serviceBichos = require('../../services/bichos/serviceBichos');
const asyncHandler = require('express-async-handler');
const customError = require('http-errors');
const path = require('path');

exports.getBichos = asyncHandler(async (req, res, next) => {
	const bichos = await serviceBichos.verBichos();
	res.status(200).json(bichos);
});

exports.getBicho = asyncHandler(async (req, res, next) => {
	const bicho = await serviceBichos.verBicho(req.body.bicho_id);
	if (!bicho) throw customError(404, `Bicho @${req.body.bicho_id} não encontrado.`);
	res.status(200).json(bicho);
});

exports.getAvatar = asyncHandler(async (req, res, next) => {
	const bicho = await serviceBichos.verBicho(req.params.bicho_id);
	if (!bicho) throw customError(404, `Bicho @${req.body.bicho_id} não encontrado.`);
	const avatar = path.join(path.resolve(__dirname, '../../../static'), 'bichos', 'em_uso', req.params.bicho_id, bicho.avatar);
	res.sendFile(avatar);
});

exports.getFundo = asyncHandler(async (req, res, next) => {
	const bicho = await serviceBichos.verBicho(req.params.bicho_id);
	if (!bicho) throw customError(404, `Bicho @${req.body.bicho_id} não encontrado.`);
	const fundo = path.join(path.resolve(__dirname, '../../../static'), 'bichos', 'em_uso', req.params.bicho_id, bicho.fundo);
	res.sendFile(fundo);
});