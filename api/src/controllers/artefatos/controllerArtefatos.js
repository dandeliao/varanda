const asyncHandler 				                = require('express-async-handler');
const customError	 			                = require('http-errors');
const path 						                = require('path');
require('dotenv').config();

exports.getArtefatos = asyncHandler(async (req, res, next) => { // ?varanda_contexto_id=comunidade&em_resposta_a_id=IdDoArtefato&tags=tag1+tag2&arquivo=boolean&bicho_id=IdDoBicho (filtros opcionais) (bicho_id é opcional. Por padrão usa req.user.bicho_id)
    // não retorna denúncias
    // só retorna não-indexáveis se req.user.contexto === varanda_contexto_id
	let varanda_contexto_id = req.query.varanda_contexto_id     ? req.query.varanda_contexto_id : null; // varanda_id
	let em_resposta_a_id    = req.query.em_resposta_a_id        ? req.query.em_resposta_a_id    : null; // artefato_id
    let tags                = req.query.tags                    ? req.query.tags                : null; // array
    let arquivo             = req.query.arquivo                 ? req.query.arquivo             : null; // boolean
    let bicho_criador_id    = req.query.bicho_criador_id        ? req.query.bicho_criador_id    : null;
    let bicho_id            = req.query.bicho_id                ? req.query.bicho_id            : req.user.bicho_id;

	const varanda = await serviceVarandas.verVaranda(req.params.varanda_id);
	if (!varanda) throw customError(404, 'Varanda não encontrada.');

	const paginas = await servicePaginas.verPaginas(req.params.varanda_id, pagina_id, publica);
	if (!paginas) throw customError(404, 'Não foi possível encontrar páginas correspondentes à busca.');

	res.status(200).json(paginas);
});