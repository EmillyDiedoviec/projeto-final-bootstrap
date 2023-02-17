const usuarioLogado = buscarDadosDoLocalStorage('usuarioLogado')

document.addEventListener('DOMContentLoaded', () => {
    if (!usuarioLogado.email) {
        window.location.href = './login.html'
        return
    } else {
        mostrarRegistroHTML()
    }
})

const modalCriar = new bootstrap.Modal('#modalCriar')
const modalExcluir = new bootstrap.Modal('#modalExcluir')
const modalEditar = new bootstrap.Modal('#modalAtualizar')

const listaRecados = usuarioLogado.recados
const formularioHTML = document.getElementById('formModal')
const formAtualizar = document.getElementById('formAtualizar')

const toastRecados = document.getElementById("toastRecados");
const toastBS = new bootstrap.Toast(toastRecados);



formularioHTML.addEventListener('submit', (evento => {
    evento.preventDefault();

    if (!formularioHTML.checkValidity()) {
        formularioHTML.classList.add('was-validated')
        return
    }

    const recado = document.getElementById('recado').value
    const detalhamento = document.getElementById('detalhamento').value

    const novoRecado = {
        id: gerarId(),
        recado: recado,
        detalhamento: detalhamento
    }

    listaRecados.push(novoRecado)
    guardarNoLocalStorage('usuarioLogado', usuarioLogado)

    modalCriar.hide()

    salvarRecados()
    formularioHTML.classList.remove('was-validated')
    formularioHTML.reset()
    mostrarRegistroHTML()
}))

formAtualizar.addEventListener('submit', (evento) => {
    evento.preventDefault()

    if (!formAtualizar.checkValidity()) {
        formAtualizar.classList.add('was-validated')
        return
    }

    const recadoAtz = document.getElementById('recadoAtualizar').value
    const detalhamentoAtz = document.getElementById('detalhamentoAtualizar').value

    usuarioLogado.recados[indiceAtualizacao].recado = recadoAtz
    usuarioLogado.recados[indiceAtualizacao].detalhamento = detalhamentoAtz

    guardarNoLocalStorage('usuarioLogado', usuarioLogado)
    mostrarRegistroHTML()

    modalEditar.hide()
    formAtualizar.classList.remove('was-validated')
    formAtualizar.reset()
    feedback('success', 'Contato atualizado com sucesso!')
})


const tbody = document.getElementById('recados')
function mostrarRegistroHTML() {

    tbody.innerHTML = ''

    listaRecados.forEach((valor, indice) => {
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
    listaRecados.splice(indiceRecado, 1)

    guardarNoLocalStorage('usuarioLogado', usuarioLogado)

    const trExcluir = document.getElementById(idRecado)
    trExcluir.remove()

    modalExcluir.hide()
    feedback('success', 'Recado excluido com sucesso!')

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


function feedback(tipo, msg) {
    toastRecados.classList.add(`text-bg-${tipo}`);
    const espacoMensagem = document.getElementById("alerta-cadastro");
    espacoMensagem.innerHTML = msg;

    toastBS.show();

    setTimeout(() => {
        toastBS.hide();

        toastRecados.classList.remove(`text-bg-${tipo}`);
    }, 5000);
}


function sair() {
    salvarRecados()
    localStorage.removeItem('usuarioLogado')
    window.location.href = './login.html'
}

function salvarRecados() {
    const listaUsuarios = buscarDadosDoLocalStorage('usuarios')
    const acharUsuario = listaUsuarios.findIndex((valor) => valor.email === usuarioLogado.email)

    listaUsuarios[acharUsuario].notas = listaRecados

    guardarNoLocalStorage('usuarios', listaUsuarios)
}


function guardarNoLocalStorage(chave, valor) {
    const valorJSON = JSON.stringify(valor)

    localStorage.setItem(chave, valorJSON)
}

function buscarDadosDoLocalStorage(chave) {
    const dadoJSON = localStorage.getItem(chave)

    if (dadoJSON) {
        const listaDados = JSON.parse(dadoJSON)
        return listaDados
    } else {
        return []
    }
}
