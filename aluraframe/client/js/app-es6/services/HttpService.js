export class HttpService {

    _handleErrors(resposta) {
        if (!resposta.ok) throw new Error(resposta.statusText);
            return resposta;
    }

    get(url) {
        return fetch(url)
            .then(resposta => this._handleErrors(resposta))
            .then(reposta => reposta.json())
    }

    post(url, dado) {
        return fetch(url, {
            headers: {'Content-type' : 'application/json'},
            method: 'post',
            body: JSON.stringify(dado)
        })
            .then(resposta => this._handleErrors(resposta));
    }

}