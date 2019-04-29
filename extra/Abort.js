ConnectionFactory
    .getConnection()
    .then(connection => {

        let transaction = connection.transaction(['negociacoes'], 'readwrite');

        let store = transaction.objectStore('negociacoes');

        let negociacao = new Negociacao(new Date(), 1, 200);

        let request = store.add(negociacao);

        // #### VAI CANCELAR A TRANSAÇÃO. O evento onerror será chamado.

        transaction.abort();
        transaction.onabort = e => {
            console.log(e);
            console.log('Transação abortada');
        };

        request.onsuccess = e => {

            console.log('Negociação incluida com sucesso');
        };

        request.onerror = e => {

            console.log('Não foi possível incluir a negociação');
        };


    })