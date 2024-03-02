const serviceBlocos = require('../services/varandas/serviceBlocos');
const sanitize = require('sanitize-html');

exports.sanitizarHtml = async (html, comunitaria) => {

    allowedTags = [
        "address", "article", "aside", "footer", "header", "h1", "h2", "h3", "h4",
        "h5", "h6", "hgroup", "main", "nav", "section", "blockquote", "dd", "div",
        "dl", "dt", "figcaption", "figure", "hr", "li", "main", "ol", "p", "pre",
        "ul", "a", "abbr", "b", "bdi", "bdo", "br", "cite", "code", "data", "dfn",
        "em", "i", "kbd", "mark", "q", "rb", "rp", "rt", "rtc", "ruby", "s", "samp",
        "small", "span", "strong", "sub", "sup", "time", "u", "var", "wbr", "caption",
        "col", "colgroup", "table", "tbody", "td", "tfoot", "th", "thead", "tr",

    ];
    // adiciona tags no formato v-nome-do-bloco às tags permitidas
    let comunitario = comunitaria ? null : false;
    const blocos = await serviceBlocos.verBlocos(comunitario);
    for (let bloco of blocos) {
        allowedTags.push(`v-${bloco.bloco_id}`);
    }

    // cria objeto com atributos permitidos para cada tag
    const allowedAttributes = {
        a: [ 'href', 'name', 'target' ],
        // We don't currently allow img itself by default, but
        // these attributes would make sense if we did.
        img: [ 'src', 'srcset', 'alt', 'title', 'width', 'height', 'loading' ],
        '*': ['dado-*']
    };
    
    return sanitize(html, {
        allowedTags: allowedTags,
        allowedAttributes: allowedAttributes
    });
};

exports.htmlParaHtmx = (html) => {
    const blocoRegex = /<v-(\w+-*)+(?:\s+dado-(\w+-*)+\s*(?:="([^"]*)")?)?(?:\s+dado-(\w+-*)+\s*(?:="([^"]*)")?)?(?:\s+dado-(\w+-*)+\s*(?:="([^"]*)")?)?(?:\s+dado-(\w+-*)+\s*(?:="([^"]*)")?)?>[^<]*<\/v-(\w+-*)+>/g;
        // regex captura formatos <v-nome-do-bloco> e <v-nome-do-bloco dado-prop1="valor" dado-prop2="quem@ta.com  _onde@tu.net">

    let htmx = html.replace(blocoRegex, `<div hx-get="/blocos/$1?$2=$3&$4=$5&$6=$7&$8=$9" hx-trigger="load"></div>`);
    htmx = htmx.replace(/(?:&=)*/g, '');
    htmx = htmx.replace(/=&/g, '&');
    htmx = htmx.replace(/=</g, '<');
    htmx = htmx.replace(/\?</g, '<');
    console.log(htmx);

    return htmx;
};

exports.vidParaId = (vid) => {
    return vid.match(/[^\/]*$/g)[0];
};