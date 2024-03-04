const serviceBlocos = require('../services/varandas/serviceBlocos');
const { replaceAsync } = require('./utilMiscellaneous');
const sanitize = require('sanitize-html');

exports.sanitizarHtml = async (html, comunitaria) => {

    let allowedTags = [
        "address", "article", "aside", "footer", "header", "h1", "h2", "h3", "h4",
        "h5", "h6", "hgroup", "main", "nav", "section", "blockquote", "dd", "div",
        "dl", "dt", "figcaption", "figure", "hr", "li", "main", "ol", "p", "pre",
        "ul", "a", "abbr", "b", "bdi", "bdo", "br", "cite", "code", "data", "dfn",
        "em", "i", "kbd", "mark", "q", "rb", "rp", "rt", "rtc", "ruby", "s", "samp",
        "small", "span", "strong", "sub", "sup", "time", "u", "var", "wbr", "caption",
        "col", "colgroup", "table", "tbody", "td", "tfoot", "th", "thead", "tr",

    ];

    let selfClosing = [ 'img', 'br', 'hr', 'area', 'base', 'basefont', 'input', 'link', 'meta' ];

    // adiciona tags no formato v-nome-do-bloco às tags permitidas e às self-closing tags
    let comunitario = comunitaria ? null : false;
    const blocos = await serviceBlocos.verBlocos(comunitario);
    for (let bloco of blocos) {
        allowedTags.push(`v-${bloco.bloco_id}`);
        selfClosing.push(`v-${bloco.bloco_id}`);
    }

    // cria objeto com atributos permitidos para cada tag
    const allowedAttributes = {
        a: [ 'href', 'name', 'target' ],
        // We don't currently allow img itself by default, but
        // these attributes would make sense if we did.
        img: [ 'src', 'srcset', 'alt', 'title', 'width', 'height', 'loading' ],
        '*': ['class', 'dado-*']
    };
    
    return sanitize(html, {
        allowedTags: allowedTags,
        selfClosing: selfClosing,
        allowedAttributes: allowedAttributes
    });
};

exports.htmlParaHtmx = async (html, varanda_id) => {
    
    const blocoRegex = /<v-((?:\w+-*)+)(?:\s+dado-((?:\w+-*)+)\s*(?:="([^"]*)")?)?(?:\s+dado-((?:\w+-*)+)\s*(?:="([^"]*)")?)?(?:\s+dado-((?:\w+-*)+)\s*(?:="([^"]*)")?)?(?:\s+dado-((?:\w+-*)+)\s*(?:="([^"]*)")?)?\s*\/>/g;
        // regex captura formatos <v-nome-do-bloco /> e <v-nome-do-bloco dado-prop1="valor" dado-prop2="quem@ta.com  _onde@tu.net" dado-prop3 />

    // substitui tags customizadas <v-bloco /> por divs htmx
    
    return await replaceAsync(html, blocoRegex, async (match, p1, p2, p3, p4, p5, p6, p7, p8, p9, offset, string) => {       
        // abre div htmx
        let divHtmx = `<div hx-get="/blocos/${p1}`;
        // se existem atributos, os inclui na div htmx
        const captured = [p1, [p2, p3], [p4, p5], [p6, p7], [p8, p9]];

        let temBicho = false;
        if (p2 || p4 || p6 || p8 ) {
            divHtmx = divHtmx + '?';
            for (let i = 1; i < captured.length; i++) {
                if (captured[i][0]) {
                    if (captured[i][0] === 'bicho') temBicho = true;
                    divHtmx = divHtmx + `${captured[i][0]}`;
                    if (captured[i][1]) {
                        divHtmx = divHtmx + `=${captured[i][1]}`;
                    }
                    if (captured[i+1][0]) {
                        divHtmx = divHtmx + '&';
                    }
                }
            };
        }
        // Se não foi encontrado atributo 'bicho', verifica se o bloco precisa do atributo. Se sim, insere a varanda atual como bicho
        if (!temBicho) {
            const bloco = await serviceBlocos.verBloco(p1);
            if (bloco) {
                if (bloco.variaveis.includes('bicho')) {
                    if (p2 || p4 || p6 || p8 ) {
                        divHtmx = divHtmx + '&';
                    } else {
                        divHtmx = divHtmx + '?';
                    }
                    divHtmx = divHtmx + `bicho=${varanda_id}`;
                }
            }
        }
        // fecha div htmx
        divHtmx = divHtmx + `" hx-trigger="load"></div>`;
        return divHtmx;
    });
};

exports.vidParaId = (vid) => {
    return vid.match(/[^\/]*$/g)[0];
};