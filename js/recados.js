let indiceAtualizacao = -1

const usuarioLogado = buscarDadosDoLocalStorage('usuarioLogado')

const modalCadastro = new bootstrap.Modal('#modal-criar')
const modalExcluir = new bootstrap.Modal('#modal-excluir')
const modalEditar = new bootstrap.Modal('#modal-atualizar')


const formCadastro = document.getElementById('form-cadastro')
const formAtualizar = document.getElementById('form-atualizar')


document.addEventListener('DOMContentLoaded', () => {
    if (!usuarioLogado.email) {
        window.location.href = './login.html'
    } else {
        mostrarRegistroHTML()
    }
})

formCadastro.addEventListener('submit', (ev => {
    ev.preventDefault();

    if (!formCadastro.checkValidity()) {
        formCadastro.classList.add('was-validated')
        return
    }

    const recado = document.getElementById('recado').value
    const detalhamento = document.getElementById('detalhamento').value

    const novoRecado = {
        id: gerarId(),
        recado,
        detalhamento
    }

    usuarioLogado.recados.push(novoRecado)

    guardarNoLocalStorage('usuarioLogado', usuarioLogado)

    modalCadastro.hide()

    formCadastro.classList.remove('was-validated')
    formCadastro.reset()
    mostrarRecadosNoHTML()
}))

formAtualizar.addEventListener('submit', (ev) => {
    ev.preventDefault()

    if (!formAtualizar.checkValidity()) {
        formAtualizar.classList.add('was-validated')
        return
    }

    const recadoAtualizado = document.getElementById('recado-atualizar').value
    const detalhamentoAtualizado = document.getElementById('detalhamento-atualizar').value

    usuarioLogado.recados[indiceAtualizacao].recado = recadoAtualizado
    usuarioLogado.recados[indiceAtualizacao].detalhamento = detalhamentoAtualizado

    guardarNoLocalStorage('usuarioLogado', usuarioLogado)
    mostrarRecadosNoHTML()

    modalEditar.hide()
    formAtualizar.classList.remove('was-validated')
    formAtualizar.reset()
    mostrarAlerta('success', 'Contato atualizado com sucesso!')
    indiceAtualizacao = -1

})


function gerarId() {
    return new Date().getTime()
}

function mostrarModalExcluir(indiceRecado, idRecado) {
    console.log(idRecado)
    modalExcluir.show()
    const botaoExcluir = document.getElementById('btn-delete')

    botaoExcluir.setAttribute('onclick', `apagarRecado(${indiceRecado}, ${idRecado})`)

}

function apagarRecado(indiceRecado, idRecado) {
    usuarioLogado.recados.splice(indiceRecado, 1)

    guardarNoLocalStorage('usuarioLogado', usuarioLogado)

    const trExcluir = document.getElementById(idRecado)
    trExcluir.remove()

    modalExcluir.hide()
    mostrarAlerta('success', 'Recado excluido com sucesso!')

}

function mostrarModalAtualizar(indiceRecado) {
    console.log(indiceRecado)
    const usuarioAtualizar = usuarioLogado.recados[indiceRecado]

    modalEditar.show()
    const recadoAtualizar = document.getElementById('recado-atualizar')
    const detalhamentoAtualizar = document.getElementById('detalhamento-atualizar')

    recadoAtualizar.value = usuarioAtualizar.recado
    detalhamentoAtualizar.value = usuarioAtualizar.detalhamento

    indiceAtualizacao = indiceRecado
}

function mostrarRecadosNoHTML() {
    const tbody = document.getElementById('lista-recados')

    tbody.innerHTML = ''

    usuarioLogado.recados.forEach((valor, indice) => {
        tbody.innerHTML += `
            <tr id="${valor.id}">
                <td>${indice + 1}</td>
                <td>${valor.recado}</td>
                <td>${valor.detalhamento}</td>
                <td>
                    <button class="btn btn-success m-1" aria-label="Editar" onclick="mostrarModalAtualizar(${indice})">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                    <button class="btn btn-danger m-1" aria-label="Apagar" onclick="mostrarModalExcluir(${indice}, ${valor.id})">
                        <i class="bi bi-trash3"></i>
                    </button>
                </td>
            </tr>
        `
    })
}



function sair() {
    salvarRecados()
    localStorage.removeItem('usuarioLogado')
    window.location.href = './login.html'
}

function salvarRecados() {
    const listaUsuario = buscarDadosDoLocalStorage('Lista-Usuarios')


    const acharUsuario = listaUsuario.findIndex((valor) => valor.email === usuarioLogado.email)

    listaUsuario[acharUsuario].recados = usuarioLogado.recados

    guardarNoLocalStorage('Lista-Usuarios', listaUsuario)
}


function guardarNoLocalStorage(chave, valor) {
    localStorage.setItem(chave, JSON.stringify(valor));

}

function buscarDadosDoLocalStorage(chave) {

    const resultado = localStorage.getItem(chave)

    return JSON.parse(resultado) ?? []
}