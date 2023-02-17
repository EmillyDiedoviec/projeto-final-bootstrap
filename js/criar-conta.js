const listaUsuarios = buscarDadosDoLocalStorage('usuario')
const formHTML = document.getElementById('formCadastro')

const toastCadastro = document.getElementById("toastCadastro");
const toastBS = new bootstrap.Toast(toastCadastro);

formHTML.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const emailInp = document.getElementById('email').value
    const senhaInp = document.getElementById('senha').value
    const repitaSenhaInp = document.getElementById('repitaSenha').value

    if (!emailInp ||
        !senhaInp ||
        !repitaSenhaInp ||
        !emailInp.includes('@')) {
        formHTML.classList.add('was-validated')
        return
    }

    if (senhaInp !== repitaSenhaInp) {
        feedback("danger", "⚠️¡Erro! - As senhas devem ser iguais!⚠️");
        return
    }

    const novoUsuario = {
        email: emailInp,
        senha: senhaInp,
        recados: []
    }

    const existe = listaUsuarios.some((valor) => valor.email === emailInp)

    if (existe) {
        feedback("danger", "⚠️¡Erro! - E-mail já cadastrado!")
        formHTML.reset()
        return
    }

    listaUsuarios.push(novoUsuario)
    guardarNoLocalStorage('usuarios', listaUsuarios)
    formHTML.reset()

    if (novoUsuario) {
        feedback("success", "🥳 Conta criada com sucesso!")
    }
})

function feedback(tipo, msg) {
    toastCadastro.classList.add(`text-bg-${tipo}`);
    const espacoMensagem = document.getElementById("alerta-cadastro");
    espacoMensagem.innerHTML = msg;

    toastBS.show();

    setTimeout(() => {
        toastBS.hide();

        toastCadastro.classList.remove(`text-bg-${tipo}`);
    }, 5000);
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