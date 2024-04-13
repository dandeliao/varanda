const serviceComunidades = require('../services/bichos/serviceComunidades');

exports.replaceAsync = async (string, regexp, replacerFunction) => {
    const replacements = await Promise.all(
        Array.from(string.matchAll(regexp),
            match => replacerFunction(...match)));
    let i = 0;
    return string.replace(regexp, () => replacements[i++]);
}

exports.astroDaSemana = (dia) => {
    let astro = '';
    switch(dia){
        case 'domingo':
            astro = 'sol';
            break;
        case 'segunda-feira':
            astro = 'lua';
            break;
        case 'terça-feira':
            astro = 'marte';
            break;
        case 'quarta-feira':
            astro = 'mercúrio';
            break;
        case 'quinta-feira':
            astro = 'júpiter';
            break;
        case 'sexta-feira':
            astro = 'vênus';
            break;
        case 'sábado':
            astro = 'saturno';
            break;
    }
    return astro;
};

exports.dataHumana = (timestamp) => {
    const data = new Date(timestamp);
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };
    let humana = data.toLocaleDateString('pt-BR', options);
    let diaDaSemana = humana.split(',')[0];
    diaDaSemana = this.astroDaSemana(diaDaSemana);
    humana = diaDaSemana + ',' + humana.split(',')[1];

    return humana;
};

exports.bichoSurpresa = async () => {
    const varandas = await serviceComunidades.verComunidades();
    let surpresa = varandas[Math.floor(Math.random()*varandas.length)];
    while (surpresa.bicho_id === process.env.INSTANCIA_ID) {
        surpresa = varandas[Math.floor(Math.random()*varandas.length)];
    }
    return surpresa;
};