// Cria um banco de dados local chamado 'carbon_footprint' usando PouchDB
const db = new PouchDB('carbon_footprint');

// Função que salva os dados do formulário no banco
function saveData(formData) {
    return db.put({// Cria um novo documento no banco de dados
        _id: new Date().toISOString(), // Usa a data e hora atual como ID único do registro
        formData: formData             // Salva os dados do formulário como um objeto
    });
}

// Função que busca e exibe todos os dados salvos em forma de tabela
function displaySavedData() {
    db.allDocs({ include_docs: true, descending: true }) // Busca todos os documentos, incluindo o conteúdo, em ordem decrescente
        .then(function (result) {
            // Seleciona a div onde os dados serão exibidos
            const savedDataDiv = document.getElementById('savedData');

            // Define o título da seção de dados salvos
            savedDataDiv.innerHTML = '<h2 class="text-xl font-semibold text-gray-800">Dados Salvos</h2>';

            // Cria a tabela para exibir os dados
            const table = document.createElement('table');
            table.classList.add('mt-4', 'w-full', 'border', 'border-gray-200', 'divide-y', 'divide-gray-200');// Adiciona classes para estilo

            // Cria o cabeçalho da tabela
            const tableHeader = document.createElement('thead');
            const headerRow = document.createElement('tr');// Cria uma linha para o cabeçalho

            const header1 = document.createElement('th');
            header1.textContent = 'Data'; // Cabeçalho para a data de salvamento

            const header2 = document.createElement('th');
            header2.textContent = 'Combustível (litros)'; // Quantidade de combustível

            const header3 = document.createElement('th');
            header3.textContent = 'Tipo de Combustível'; // Tipo (ex: gasolina, etanol)

            const header4 = document.createElement('th');
            header4.textContent = 'Distância Percorrida (km)'; // Distância percorrida

            // Adiciona os cabeçalhos à linha do cabeçalho
            headerRow.appendChild(header1);// Adiciona a célula de data
            headerRow.appendChild(header2);
            headerRow.appendChild(header3);// Adiciona a célula de tipo de combustível
            headerRow.appendChild(header4);
            tableHeader.appendChild(headerRow); // Adiciona a linha ao thead
            table.appendChild(tableHeader);     // Adiciona o thead à tabela

            // Cria o corpo da tabela
            const tableBody = document.createElement('tbody');// Cria o tbody para os dados

            // Para cada documento salvo, cria uma linha na tabela
            result.rows.forEach(function (row) {
                const doc = row.doc;// Obtém o documento atual
                // Cria uma nova linha para os dados
                const dataRow = document.createElement('tr');

                const dateCell = document.createElement('td');// Cria a célula para a data
                // Converte o _id (que é a data em formato ISO) para um formato legível
                dateCell.textContent = new Date(doc._id).toLocaleString(); // Formata a data para exibição
                // Cria células para os dados do formulário
                const formData = doc.formData;

                const fuelCell = document.createElement('td');
                fuelCell.textContent = formData.fuel; // Quantidade de combustível

                const fuelTypeCell = document.createElement('td');
                fuelTypeCell.textContent = formData.fuelType; // Tipo de combustível

                const distanceCell = document.createElement('td');
                distanceCell.textContent = formData.distance; // Distância percorrida

                // Adiciona as células à linha
                dataRow.appendChild(dateCell);// Adiciona a célula de data
                dataRow.appendChild(fuelCell);// Adiciona a célula de combustível
                dataRow.appendChild(fuelTypeCell);// Adiciona a célula de tipo de combustível
                dataRow.appendChild(distanceCell);// Adiciona a célula de distância

                // Adiciona a linha ao corpo da tabela
                tableBody.appendChild(dataRow);
            });

            // Adiciona o corpo à tabela e insere a tabela na div
            table.appendChild(tableBody);// Adiciona o tbody à tabela
            savedDataDiv.innerHTML = ''; // Limpa o conteúdo anterior da div
            savedDataDiv.appendChild(table);// Adiciona a tabela à div
        }).catch(function (err) {
            console.log(err); // Exibe erros no console, se houver
        });
}

// Evento que intercepta o envio do formulário e salva os dados
document.getElementById('carbonForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Impede o recarregamento da página

    // Coleta os valores do formulário e converte para os tipos apropriados
    const formData = {
        fuel: parseFloat(document.getElementById('fuel').value),        // Litros de combustível (número)
        fuelType: document.getElementById('fuelType').value,            // Tipo de combustível (string)
        distance: parseFloat(document.getElementById('distance').value) // Distância percorrida (número)
    };

    // Salva os dados e atualiza a tabela
    saveData(formData).then(function () {
        displaySavedData(); // Atualiza os dados exibidos
    }).catch(function (err) {
        console.log(err); // Exibe erros no console
    });
});

// Evento que salva os dados ao clicar no botão "Salvar Dados", se não houver erros.
document.getElementById('saveDataBtn').addEventListener('click', function () {
    // Pega os dados do formulário
    const formData = {
        fuel: parseFloat(document.getElementById('fuel').value),
        fuelType: document.getElementById('fuelType').value,
        distance: parseFloat(document.getElementById('distance').value)
    };

    // Salva os dados e exibe alerta de sucesso, se não houver erros.
    saveData(formData).then(function () {
        alert('Dados salvos com sucesso!');
    }).catch(function (err) {
        console.log(err);
    });
});

// Evento que carrega e exibe os dados salvos ao clicar no botão "Carregar Tabela", se houver dados salvos.
document.getElementById('loadTableBtn').addEventListener('click', function () {
    displaySavedData(); // Exibe os dados salvos no banco de dadosPouchDB
});
// Carrega os dados salvos ao abrir a página