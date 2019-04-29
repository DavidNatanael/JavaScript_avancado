var formatadorDeMoedas = (function() {

    let simboloMoeda = 'R$ ';
    let modulo = {};

    modulo.numeroParaReal = numero => {

        return simboloMoeda + numero.toFixed(2).replace('.', ',');
    }

    modulo.realParaNumero = texto => {

        return texto.replace(simboloMoeda, '').replace(',', '.');
    }

    return modulo;
})();

// exemplo de uso

let real = 'R$ 100,20';
let realConvertidoEmNumero =
    formatadorDeMoedas.realParaNumero(real);

alert(realConvertidoEmNumero);

let numero = 200.15;
let numeroConvertidoEmReal =
    formatadorDeMoedas.numeroParaReal(numero);

alert(numeroConvertidoEmReal);