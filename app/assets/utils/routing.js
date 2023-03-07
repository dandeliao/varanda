import { pathToRegex, getParams, getHref } from "./navigation.js";

// array de rotas, com os respectivos tipos de suas views
export const rotas = [ // obs: a ordem faz diferença para fazer o match depois
	{ caminho: '/boas-vindas',  tipo: 'boasVindas'},
	{ caminho: '/colecoes',      tipo: 'colecoes'},
	{ caminho: '/configuracao', tipo: 'configuracao'},
    { caminho: '/404',          tipo: 'erro'},
    { caminho: '/logout',       tipo: 'logout'},
    { caminho: '/pessoa/:nome', tipo: 'pessoa'},
    { caminho: '/',             tipo: 'comunidade'},
    { caminho: '/:nome',        tipo: 'comunidade'}
];

// analisa endereco e retorna objeto com os dados da view correta
export async function router(endereco) {

    // Testa se as rotas existentes correspondem ao caminho atual da barra de endereços
    const potentialMatches = rotas.map(rota => {
        return {
            rota: rota,
            resultado: endereco.match(pathToRegex(rota.caminho)) // retorna array de trechos capturados via regex. Será utilizado por 'getParams'
        };
    });

    // se a análise por regex encontrar matches, seleciona o primeiro
    let match = potentialMatches.find(potMatch => potMatch.resultado !== null);

    // se a análise por regex não encontrar matches, seleciona o erro 404
    if (!match) {
        match = {
            rota: { caminho: "/404", tipo: 'erro'},
            resultado: [endereco]
        };
    }

    // dados para retornar (úteis para atualizar o estado e fazer a renderização da view)
    let dadosDoRouter = {
        tipo:   match.rota.tipo,
        params: getParams(match) // objeto contendo os parâmetros passados no caminho (ex: nome da pessoa ou nome da comunidade)
    }
    // caso seja '/', retorna o nome da comunidade maloca
    if ((dadosDoRouter.tipo === 'comunidade') && (!dadosDoRouter.params.nome)) {
        dadosDoRouter.params.nome = 'maloca';
    }
    dadosDoRouter.href = getHref(dadosDoRouter); // adiciona href aos dados

    return dadosDoRouter;
}