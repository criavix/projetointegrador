let itensCadastrados = JSON.parse(localStorage.getItem('itensCadastrados')) || []
let clientesCadastrados = JSON.parse(localStorage.getItem('clientesCadastrados')) || []
let itemEdicaoIndex = null
let clienteEdicaoIndex = null

document.addEventListener('DOMContentLoaded', () => {
    let itemForm = document.getElementById('itemForm')
    let clienteForm = document.getElementById('clienteForm')
    let listaItens = document.getElementById('listaItens')
    let listaClientes = document.getElementById('listaClientes')
    let itemSelecionado = document.getElementById('itemSelecionado')
    let clienteSelecionado = document.getElementById('clienteSelecionado')
    let pedidoForm = document.getElementById('pedidoForm')
    let relatorioPedidos = document.getElementById('relatorioPedidos')

    function carregarDados() {
        itensCadastrados = JSON.parse(localStorage.getItem('itensCadastrados')) || []
        clientesCadastrados = JSON.parse(localStorage.getItem('clientesCadastrados')) || []
    }

    function atualizarListaItens() {
        if (!listaItens) return 
        listaItens.innerHTML = ''
        itensCadastrados.forEach((item, index) => {
            let novoItem = document.createElement('li')
            novoItem.textContent = item

            let btnEditar = document.createElement('button')
            btnEditar.textContent = 'Editar'
            btnEditar.onclick = () => editarItem(index)
            novoItem.appendChild(btnEditar)

            let btnRemover = document.createElement('button')
            btnRemover.textContent = 'Remover'
            btnRemover.onclick = () => removerItem(index)
            novoItem.appendChild(btnRemover)

            listaItens.appendChild(novoItem)
        })
        atualizarSelectItens()
    }

    function atualizarListaClientes() {
        if (!listaClientes) return 
        listaClientes.innerHTML = ''
        clientesCadastrados.forEach((cliente, index) => {
            let novoCliente = document.createElement('li')
            novoCliente.textContent = cliente

            let btnEditar = document.createElement('button')
            btnEditar.textContent = 'Editar'
            btnEditar.onclick = () => editarCliente(index)
            novoCliente.appendChild(btnEditar)

            let btnRemover = document.createElement('button')
            btnRemover.textContent = 'Remover'
            btnRemover.onclick = () => removerCliente(index)
            novoCliente.appendChild(btnRemover)

            listaClientes.appendChild(novoCliente)
        })
        atualizarSelectClientes()
    }

    function atualizarSelectItens() {
        if (!itemSelecionado) return 
        itemSelecionado.innerHTML = ''
        itensCadastrados.forEach(item => {
            let option = document.createElement('option')
            option.value = item
            option.textContent = item
            itemSelecionado.appendChild(option)
        })
    }

    function atualizarSelectClientes() {
        if (!clienteSelecionado) return 
        clienteSelecionado.innerHTML = ''
        clientesCadastrados.forEach(cliente => {
            let option = document.createElement('option')
            option.value = cliente
            option.textContent = cliente
            clienteSelecionado.appendChild(option)
        })
    }

    carregarDados()

    // Atualizar listas apenas se a página de configurações estiver sendo carregada
    if (itemForm) {
        atualizarListaItens()
    }

    if (clienteForm) {
        atualizarListaClientes()
    }

    if (pedidoForm) {
        atualizarSelectItens()  // Carregar itens na tela de pedidos
        atualizarSelectClientes() // Carregar clientes na tela de pedidos
    }

    if (itemForm) {
        itemForm.addEventListener('submit', (e) => {
            e.preventDefault()
            let itemNome = document.getElementById('itemNome').value

            if (itemEdicaoIndex !== null) {
                itensCadastrados[itemEdicaoIndex] = itemNome
                itemEdicaoIndex = null
            } else {
                itensCadastrados.push(itemNome)
            }

            localStorage.setItem('itensCadastrados', JSON.stringify(itensCadastrados))
            atualizarListaItens()
            itemForm.reset()
        })
    }

    if (clienteForm) {
        clienteForm.addEventListener('submit', (e) => {
            e.preventDefault()
            let clienteNome = document.getElementById('clienteNome').value

            if (clienteEdicaoIndex !== null) {
                clientesCadastrados[clienteEdicaoIndex] = clienteNome
                clienteEdicaoIndex = null
            } else {
                clientesCadastrados.push(clienteNome)
            }

            localStorage.setItem('clientesCadastrados', JSON.stringify(clientesCadastrados))
            atualizarListaClientes()
            clienteForm.reset()
        })
    }

    if (pedidoForm) {
        pedidoForm.addEventListener('submit', (e) => {
            e.preventDefault()
            let clienteSelecionadoValor = clienteSelecionado.value
            let itemSelecionadoValor = itemSelecionado.value
            let quantidade = parseInt(document.getElementById('quantidade').value, 10)

            if (!clienteSelecionadoValor || !itemSelecionadoValor) {
                alert('Por favor, selecione um cliente e um item.')
                return
            }

            if (quantidade > 0) {
                let relatorioItem = document.createElement('li')
                relatorioItem.textContent = `${quantidade}x ${itemSelecionadoValor} para ${clienteSelecionadoValor}`
                relatorioPedidos.appendChild(relatorioItem)
            } else {
                alert('A quantidade deve ser maior que zero.')
            }

            pedidoForm.reset()
        })
    }

    function editarItem(index) {
        itemEdicaoIndex = index
        document.getElementById('itemNome').value = itensCadastrados[index]
    }

    function removerItem(index) {
        itensCadastrados.splice(index, 1)
        localStorage.setItem('itensCadastrados', JSON.stringify(itensCadastrados))
        atualizarListaItens()
    }

    function editarCliente(index) {
        clienteEdicaoIndex = index
        document.getElementById('clienteNome').value = clientesCadastrados[index]
    }

    function removerCliente(index) {
        clientesCadastrados.splice(index, 1)
        localStorage.setItem('clientesCadastrados', JSON.stringify(clientesCadastrados))
        atualizarListaClientes()
    }
})

// Função para buscar a data e a hora atuais
function buscarDataHora() {
    fetch('http://worldtimeapi.org/api/timezone/America/Sao_Paulo')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar dados da hora')
            }
            return response.json()
        })
        .then(data => {
            let dataHoraDiv = document.getElementById('dataHora')
            let dataHora = new Date(data.datetime) // Converte a string da data em um objeto Date
            dataHoraDiv.textContent = `Data e Hora: ${dataHora.toLocaleString('pt-BR')}` // Formata a data e a hora
            
            // Atualiza a hora a cada segundo
            setInterval(() => {
                dataHora.setSeconds(dataHora.getSeconds() + 1) // Incrementa os segundos
                dataHoraDiv.textContent = `Data e Hora: ${dataHora.toLocaleString('pt-BR')}`
            }, 1000)
        })
        .catch(error => {
            console.error('Erro:', error)
            let dataHoraDiv = document.getElementById('dataHora')
            dataHoraDiv.textContent = 'Erro ao carregar a data e hora.'
        })
}

// Chama a função uma vez para obter a data e hora
buscarDataHora()
