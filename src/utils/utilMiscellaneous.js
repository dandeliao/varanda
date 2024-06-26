const { verComunidades } = require('../services/bichos/serviceComunidades');

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
    let humana;
    const data = new Date(timestamp);
    if (!isNaN(data)) {
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
        humana = data.toLocaleDateString('pt-BR', options);
        let diaDaSemana = humana.split(',')[0];
        diaDaSemana = this.astroDaSemana(diaDaSemana);
        humana = diaDaSemana + ',' + humana.split(',')[1];
    } else {
        humana = timestamp;
    }

    return humana;
};

exports.bichoSurpresa = async () => {
    const varandas = await verComunidades();
    let surpresa = varandas[Math.floor(Math.random()*varandas.length)];
    if (varandas.length > 1) {
        while (surpresa.bicho_id === process.env.INSTANCIA_ID) {
            surpresa = varandas[Math.floor(Math.random()*varandas.length)];
        }
    }
    return surpresa;
};