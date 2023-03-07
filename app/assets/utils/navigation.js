// converte caminho em expressão regex
export function pathToRegex(path) {
    return new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");
}

// retorna parâmetros do caminho (ex: nome para rota /pessoa/:nome) em formato { key1: value, key2: value, ...}
export function getParams(match) {
    const values = match.resultado.slice(1); // retorna array com o valor dos parâmetros (ex: ['dani'])
    const keys = Array.from(match.rota.caminho.matchAll(/:(\w+)/g)).map(result => result[1]); // retorna array com as chaves, como definidas na especificação das rotas (ex: ['nome'])

    return Object.fromEntries(keys.map((key, i) => {
        return [key, values[i]];
    }));
}

// retorna caminho com base nos parâmetros obtidos
export function getHref(data) {
    let href = '/';
    if (data.tipo === 'pessoa') {
        href = '/pessoa/' + data.params.nome;
    } else if (data.tipo === 'comunidade') {
        href = data.params.nome ? '/' + data.params.nome : '/';
    } else {
        href = '/' + data.tipo;
    }
    return href;
}