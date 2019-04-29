import {HttpService} from "./HttpService";
import {ConnectionFactory} from "./ConnectionFactory";
import {NegociacaoDao} from "../dao/NegociacaoDao";
import {Negociacao} from "../models/Negociacao";

export class NegociacaoService {

    constructor() {
        this._httpService = new HttpService();
    }

    obterNegociacoes() {
        return Promise.all([
            this.obterNegociacoesSemana(),
            this.obterNegociacoesSemanaAnterior(),
            this.obterNegociacoesSemanaRetrasada()
        ])
            .then(periodos => {
                let negociacoes = periodos
                    .reduce((dados, periodo) => dados.concat(periodo), []);
                return negociacoes;
            })
            .catch(erro => {
                throw new Error(erro);
            })
    }

    obterNegociacoesSemana() {
        return this._httpService
            .get('negociacoes/semana')
            .then(negociacoes => {
                return negociacoes.map(object => new Negociacao(new Date(object.data), object.quantidade, object.valor));
            })
            .catch(erro => {
                console.log(erro);
                throw new Error('Não foi possível obter as negociações da semana');
            })
    }

    obterNegociacoesSemanaAnterior() {
        return this._httpService
            .get('negociacoes/anterior')
            .then(negociacoes => {
                return negociacoes.map(object => new Negociacao(new Date(object.data), object.quantidade, object.valor));
            })
            .catch(erro => {
                console.log(erro);
                throw new Error('Não foi possível obter as negociações da semana anterior');
            })
    }

    obterNegociacoesSemanaRetrasada() {
        return this._httpService
            .get('negociacoes/retrasada')
            .then(negociacoes => {
                return negociacoes.map(object => new Negociacao(new Date(object.data), object.quantidade, object.valor));
            })
            .catch(erro => {
                console.log(erro);
                throw new Error('Não foi possível obter as negociações da semana retrasada');
            })
    }

    cadastra(negociacao) {
        return ConnectionFactory
            .getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.adiciona(negociacao))
            .then(() => 'Negociação adicionada com sucesso')
            .catch(erro => {
                console.log(erro);
                throw new Error('Não foi possível adicionar a negociação');
            })
    }

    lista() {
        return ConnectionFactory
            .getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.listaTodos())
            .catch(erro => {
                console.log(erro);
                throw new Error('Não foi possível obter as negociações')
            });
    }

    apaga() {
        return ConnectionFactory
            .getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.apagaTodos())
            .then(() => 'Negociações apagaddas com sucesso')
            .catch(erro => {
                console.log(erro);
                throw new Error('Não foi possível excluir as negociações');
            })
    }

    importa(listaAtual) {
        return this.obterNegociacoes()
            .then(negociacoes =>
                negociacoes.filter(negociacao =>
                    !listaAtual.some(negociacaoExistente =>
                        negociacao.isEquals(negociacaoExistente)))
            )
            .catch(erro => {
                console.log(erro);
                throw new Error('Não foi possível importar as negociações');
            })
    }

}