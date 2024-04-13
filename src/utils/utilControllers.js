const serviceRelacoes       = require('../services/bichos/serviceRelacoes');

exports.params = (req) => {
    const varanda_id    = req.params.bicho_id ? req.params.bicho_id : process.env.INSTANCIA_ID;
	const pagina_id     = req.params.pagina_id ? encodeURIComponent(req.params.pagina_id) : 'inicio';
    const artefato_id   = req.params.artefato_id ? req.params.artefato_id : undefined; 
    return {
        varanda_id: varanda_id,
        pagina_id: pagina_id,
        artefato_id: artefato_id
    };
};

exports.quemEstaAgindo = async (req) => {
    let usuarie_id;
	if (req.isAuthenticated()) {
		usuarie_id = req.user.bicho_id; // usuárie logade (req.user)
		if(req.query.bicho_id) {        // bicho declarado na query (req.query)
			const permissoesBicho = await serviceRelacoes.verRelacao(req.user.bicho_id, req.query.bicho_id);
			if (permissoesBicho.representar) usuarie_id = req.query.bicho_id;
		}
	}
    return usuarie_id;
};

exports.palavrasReservadas = () => {
    return ['editar', 'clonar', 'futricar', 'relacao', 'avatar', 'fundo', 'preferencias', 'editar-preferencias', 'criar-comunidade', 'nova_pagina', 'nova_comunidade'];
};

exports.enderecoArtefato = (artefato) => {
    return `/${artefato.pagina_vid}/${artefato.artefato_id}`;
};