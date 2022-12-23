const fs = require('fs')

const arquivo = fs.createReadStream('./CE_F_144004.TXT', { encoding: 'latin1' })
const saida = fs.createWriteStream('./db.csv')

arquivo.on('open', function () {
    console.log('open')
});

let temp = ''

let db = []

let iteracao = 0

arquivo.on('data', function (chunk) {
    iteracao = iteracao + 1

    let pedacoTemp = temp + chunk.toString()
    temp = ''
    let lista = pedacoTemp.split('\r\n')

    let incompleto = lista.find(item => !(item.length === 186 || item.length === 182))
    temp = incompleto

    lista = lista.filter(item => (item.length === 186 || item.length === 182))

    lista = lista.map(item => {
        return {
            sigla_uf: item.substring(0, 2).trim(),
            sigla_cnl: item.substring(2, 6).trim(),
            codigo_cnl: item.substring(6, 11).trim(),
            nome_localidade: item.substring(11, 61).trim(),
            nome_municipio: item.substring(61, 111).trim(),
            codigo_area_tarifacao: item.substring(111, 116).trim(),
            prefixo: item.substring(116, 123).trim(),
            prestadora: item.substring(123, 153).trim(),
            numero_faixa_inicial: item.substring(153, 157).trim(),
            numero_faixa_final: item.substring(157, 161).trim(),
            latitude: item.substring(161, 169).trim(),
            hemisferio: item.substring(169, 174).trim(),
            longitude: item.substring(174, 182).trim(),
            sigla_cnl_area_local: item.substring(182, 186).trim(),
        }
    })

    db = [...db, ...lista]
});

arquivo.on('end', function () {
    console.log(db.length)
    console.log('end')

    saida.write('sigla_uf;sigla_cnl;codigo_cnl;nome_localidade;nome_municipio;codigo_area_tarifacao;prefixo;prestadora;numero_faixa_inicial;numero_faixa_final;latitude;hemisferio;longitude;sigla_cnl_area_local\r\n')

    db.map(item => {
        saida.write(`${item.sigla_uf};${item.sigla_cnl};${item.codigo_cnl};${item.nome_localidade};${item.nome_municipio};${item.codigo_area_tarifacao};${item.prefixo};${item.prestadora};${item.numero_faixa_inicial};${item.numero_faixa_final};${item.latitude};${item.hemisferio};${item.longitude};${item.sigla_cnl_area_local};\r\n`)
    })

    saida.close()
});

arquivo.on('error', function (err) {
    console.error(err)
});