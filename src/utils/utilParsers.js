const serviceBlocos = require('../services/varandas/serviceBlocos');
const { replaceAsync } = require('./utilMiscellaneous');
const sanitize = require('sanitize-html');
require('dotenv').config();

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

        '*': ['class', 'style', 'dado-*']
    };

    // cria objeto com estilos CSS permitidos para cada tag
    const allowedStyles = {
        '*': {
            // Cor e decoração
            'color': [/^#(0x)?[0-9a-f]+$/i, /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/],
            'background-color': [/^#(0x)?[0-9a-f]+$/i, /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/],
            'box-shadow': [/^(?:(?:#(0x)?[0-9a-f]+\s*)+|(?:rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)\s*)+|(?:(?:-*\d+.*(?:px|rem|em|%)*)\s*)+|(?:inset)?\s*)+$/],

            // Fonte e texto
            'font-size': [/^\d+.*\d*(?:px|rem|em|%)$/],
            'font-family': [/^serif$/, /^sans-serif$/, /^monospace$/, /^cursive$/, /^fantasy$/, /^system-ui$/, /^emoji$/, /^math$/, /^fangsong$/],
            'font-style': [/^normal$/, /^italic$/, /^oblique$/],
            'font-weight': [/^normal$/, /^bold$/, /^bolder$/, /^lighter$/],
            'text-align': [/^left$/, /^right$/, /^center$/, /^start$/, /^end$/, /^justify$/, /^justify-all$/],
            'line-height': [/^\d+(?:px|rem|em|%)$/],
            
            // Margem, padding e borda
            'margin': [/^(?:(?:(?:\d+(?:px|rem|em|%)*)|auto)\s*)+$/],
            'margin-top': [/^(?:(?:(?:\d+(?:px|rem|em|%)*)|auto)\s*)+$/],
            'margin-left': [/^(?:(?:(?:\d+(?:px|rem|em|%)*)|auto)\s*)+$/],
            'margin-bottom': [/^(?:(?:(?:\d+(?:px|rem|em|%)*)|auto)\s*)+$/],
            'margin-right': [/^(?:(?:(?:\d+(?:px|rem|em|%)*)|auto)\s*)+$/],
            'padding': [/^(?:(?:(?:\d+(?:px|rem|em|%)*))\s*)+$/],
            'padding-top': [/^(?:(?:(?:\d+(?:px|rem|em|%)*))\s*)+$/],
            'padding-left': [/^(?:(?:(?:\d+(?:px|rem|em|%)*))\s*)+$/],
            'padding-bottom': [/^(?:(?:(?:\d+(?:px|rem|em|%)*))\s*)+$/],
            'padding-right': [/^(?:(?:(?:\d+(?:px|rem|em|%)*))\s*)+$/],
            'border': [/^(?:(?:#(0x)?[0-9a-f]+\s*)+|(?:rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)\s*)+|(?:(?:(?:\d+(?:px|rem|em|%)*)|thin|thick|medium)\s*)+|(?:none)*\s*(?:hidden)*\s*(?:dotted)*\s*(?:dashed)*\s*(?:solid)*\s*(?:double)*\s*(?:groove)*\s*(?:ridge)*\s*(?:inset)*\s*(?:outset)*\s*)+$/],
            'border-top': [/^(?:(?:#(0x)?[0-9a-f]+\s*)+|(?:rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)\s*)+|(?:(?:(?:\d+(?:px|rem|em|%)*)|thin|thick|medium)\s*)+|(?:none)*\s*(?:hidden)*\s*(?:dotted)*\s*(?:dashed)*\s*(?:solid)*\s*(?:double)*\s*(?:groove)*\s*(?:ridge)*\s*(?:inset)*\s*(?:outset)*\s*)+$/],
            'border-left': [/^(?:(?:#(0x)?[0-9a-f]+\s*)+|(?:rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)\s*)+|(?:(?:(?:\d+(?:px|rem|em|%)*)|thin|thick|medium)\s*)+|(?:none)*\s*(?:hidden)*\s*(?:dotted)*\s*(?:dashed)*\s*(?:solid)*\s*(?:double)*\s*(?:groove)*\s*(?:ridge)*\s*(?:inset)*\s*(?:outset)*\s*)+$/],
            'border-bottom': [/^(?:(?:#(0x)?[0-9a-f]+\s*)+|(?:rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)\s*)+|(?:(?:(?:\d+(?:px|rem|em|%)*)|thin|thick|medium)\s*)+|(?:none)*\s*(?:hidden)*\s*(?:dotted)*\s*(?:dashed)*\s*(?:solid)*\s*(?:double)*\s*(?:groove)*\s*(?:ridge)*\s*(?:inset)*\s*(?:outset)*\s*)+$/],
            'border-right': [/^(?:(?:#(0x)?[0-9a-f]+\s*)+|(?:rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)\s*)+|(?:(?:(?:\d+(?:px|rem|em|%)*)|thin|thick|medium)\s*)+|(?:none)*\s*(?:hidden)*\s*(?:dotted)*\s*(?:dashed)*\s*(?:solid)*\s*(?:double)*\s*(?:groove)*\s*(?:ridge)*\s*(?:inset)*\s*(?:outset)*\s*)+$/],
            'border-color': [/^#(0x)?[0-9a-f]+$/i, /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/],
            'border-style': [/^none$/, /^hidden$/, /^dotted$/, /^dashed$/, /^solid$/, /^double$/, /^groove$/, /^ridge$/, /^inset$/, /^outset$/],
            'border-width': [/^(?:(?:(?:\d+(?:px|rem|em|%)*)|thin|thick|medium)\s*)+$/],
            'border-radius': [/^(?:(?:(?:\d+(?:px|rem|em|%)*))\s*)+$/],

            // Tamanho
            'max-width': [/^\d+(?:px|rem|em|%)$/],
            'max-height': [/^\d+(?:px|rem|em|%)$/],

            // Flex-box
            'flex-direction': [/^row$/, /^row-reverse$/, /^column$/, /^column-reverse$/],
            'flex-wrap': [/^nowrap$/, /^wrap$/, /^wrap-reverse$/],
            'justify-content': [/^flex-start$/, /^flex-end$/, /^center$/, /^space-between$/, /^space-around$/, /^space-evenly$/, /^start$/, /^end$/, /^left$/],
            'align-items': [/^stretch$/, /^flex-start$/, /^flex-end$/, /^center$/, /^baseline$/, /^first\sbaseline$/, /^last\sbaseline$/, /^start$/, /^end$/, /^self-start$/, /^self-end$/],
            'align-content': [/^flex-start$/, /^flex-end4/, /^center$/, /^space-between$/, /^space-around$/, /^space-evenly$/, /^stretch$/, /^start$/, /^end$/, /^baseline$/, /^first\sbaseline$/, /^last\sbaseline$/],
            'gap': [/^\d+(?:px|em|%)$/],
            'row-gap': [/^\d+(?:px|rem|em|%)$/],
            'column-gap': [/^\d+(?:px|rem|em|%)$/],
            'order': [/^d+$/],
            'flex-grow': [/^d+$/],
            'flex-shrink': [/^d+$/],
            'align-self': [/^auto$/, /^flex-start$/, /^flex-end$/, /^center$/, /^baseline$/, /^stretch$/],

            // Outras
            'display': [/^înline$/, /^inline-block$/, /^block$/, /^flex$/],
            'overflow': [/^visible$/, /^hidden$/, /^clip$/, /^scroll$/, /^auto$/],
        }
    };
    
    return sanitize(html, {
        allowedTags: allowedTags,
        selfClosing: selfClosing,
        allowedAttributes: allowedAttributes,
        allowedStyles: allowedStyles,
    });
};

exports.escaparHTML = async(texto) => {
    return sanitize(texto, {
        allowedTags: [],
        allowedAttributes: {},
        disallowedTagsMode: 'escape'
    });
};

exports.sanitizarNomeDeArquivo = (texto) => {
    return texto.replace(/\/|\\|\?|%|\*|:|\||"|'|<|>|\.|\s/g, '_');
};

exports.htmlParaHtmx = async (html, varanda_id, pagina_id) => {
    
    const blocoRegex = /<v-((?:\w+-*)+)(?:\s+dado-((?:\w+-*)+)\s*(?:="([^"]*)")?)?(?:\s+dado-((?:\w+-*)+)\s*(?:="([^"]*)")?)?(?:\s+dado-((?:\w+-*)+)\s*(?:="([^"]*)")?)?(?:\s+dado-((?:\w+-*)+)\s*(?:="([^"]*)")?)?\s*\/>/g;
        // regex captura formatos <v-nome-do-bloco /> e <v-nome-do-bloco dado-prop1="valor" dado-prop2="quem@ta.com  _onde@tu.net" dado-prop3 />

    // substitui tags customizadas <v-bloco /> por divs htmx
    
    return await replaceAsync(html, blocoRegex, async (match, p1, p2, p3, p4, p5, p6, p7, p8, p9, offset, string) => {       
        // abre div htmx
        let divHtmx = `<div hx-get="/blocos/${p1}`;
        // se existem atributos, os inclui na div htmx
        const captured = [p1, [p2, p3], [p4, p5], [p6, p7], [p8, p9]];
        let temBicho = false;
        let temPagina = false;
        if (p2 || p4 || p6 || p8 ) {
            divHtmx = divHtmx + '?';
            for (let i = 1; i < captured.length; i++) {
                if (captured[i][0]) {
                    if (captured[i][0] === 'bicho') temBicho = true;
                    if (captured[i][0] === 'pagina') temPagina = true;
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

        let bloco = await serviceBlocos.verBloco(p1);
        // Se não foi encontrado atributo 'bicho', verifica se o bloco precisa do atributo. Se sim, insere a varanda atual como bicho
        let bicho_inserido = false;
        if (!temBicho) {
            if (bloco) {
                if (bloco.variaveis.includes('bicho')) {
                    if (p2 || p4 || p6 || p8 ) {
                        divHtmx = divHtmx + '&';
                    } else {
                        divHtmx = divHtmx + '?';
                    }
                    divHtmx = divHtmx + `bicho=${varanda_id}`;
                    bicho_inserido = true;
                }
            }
        }
        // Se não foi encontrado atributo 'pagina', verifica se o bloco precisa do atributo. Se sim, insere o id da página atual
        if (!temPagina) {
            console.log('não tem página (parser)');
            if (bloco) {
                if (bloco.variaveis.includes('pagina')) {
                    if (p2 || p4 || p6 || p8 || bicho_inserido) {
                        divHtmx = divHtmx + '&';
                    } else {
                        divHtmx = divHtmx + '?';
                    }
                    divHtmx = divHtmx + `pagina=${encodeURIComponent(pagina_id)}`
                }
            }
            console.log(divHtmx);
        }
        // fecha div htmx
        divHtmx = divHtmx + `" hx-trigger="load" hx-swap="outerHTML"></div>`;
        return divHtmx;
    });
};

exports.textoParaHtml = async (texto) => {
    // captura links http(s)://endereco.com, categorias #artes, arrobas @varanda, páginas @varanda/blog-novo e artefatos @varanda/blog-novo/42
    // /<[^>]*>|\[[^][]*]\([^()]*\)|(https?:\/\/[^\s"'<>]*)|#(\w+(?:\S)*)|@(\w+(?:^(?!\/).*$)*)(?:\/(\w+(?:\S)*))*/g
    const linkifyRegex = /((?:https?:\/\/)?(?:www\.)?[-a-zA-Z0-9@%_\+~#=]{2,256}\.[a-z]{2,6}\b(?:\.[-a-zA-Z0-9@:%_\+~#?&\/\/=]*)*)|#(\w+(?:\S)*)|@(([A-Za-z0-9_-]+)(?:\/([A-Za-z0-9_-]+))?(?:\/([A-Za-z0-9_-]+))?)/g;
    const html = await replaceAsync(texto, linkifyRegex, (match, p1, p2, p3, p4, p5, p6, offset, string) => {
        // p1 = url, p2 = hashtag, p3 = arroba/pagina/artefato, p4 = arroba, p5 = página, p6 = artefato
        if (p1) { // url
            return `<a href="${p1}">${p1}</a>`;
        }
        if (p2) { // categoria (hashtag)
            return `#${p2}`; // falta fazer rota para exibir categorias, algo como varanda.org/categorias/:categoria
        }
        if (p3) { // arroba/pagina/artefato
            return `<a href="/${p3}">@${p3}</a>`;
        }
    });
    return html;
};

exports.vidParaId = (vid) => {
    return vid.match(/[^\/]*$/g)[0];
};