const listaUsuarios = buscarDadosDoLocalStorage("usuarios")
const formHTML = document.getElementById("formLogin")

const toastLogin = document.getElementById("toastLogin")
const toastBS = new bootstrap.Toast(toastLogin)

formHTML.addEventListener('submit', (evento) => {
    evento.preventDefault()

    const emailInp = document.getElementById('email').value
    const senhaInp = document.getElementById('senha').value

    if (!emailInp || !senhaInp || !emailInp.includes("@")) {
        formHTML.classList.add('was-validated')
        return;
    }

    const usuarioEncontrado = listaUsuarios.find(
        (valor) => valor.email === emailInp && valor.senha === senhaInp
    );

    if (!usuarioEncontrado) {
        feedback("danger", "😵‍💫 Verique se o E-mail ou a senha estão corretos!")
        formHTML.reset()
    } else {
        guardarNoLocalStorage('usuarioLogado', usuarioEncontrado)
        window.location.href = './recados.html'
    }
});

function feedback(tipo, mensagem) {
    toastLogin.classList.add(`text-bg-${tipo}`);
    const espacoMensagem = document.getElementById("alerta-login");
    espacoMensagem.innerHTML = mensagem;

    toastBS.show();

    setTimeout(() => {
        toastBS.hide();

        toastLogin.classList.remove(`text-bg-${tipo}`);
    }, 5000);
}



function guardarNoLocalStorage(chave, valor) {
    const valorJSON = JSON.stringify(valor)

    localStorage.setItem(chave, valorJSON)
}

function buscarDadosDoLocalStorage(chave) {
    const dadoJSON = localStorage.getItem(chave);

    if (dadoJSON) {
        const listaDados = JSON.parse(dadoJSON);
        return listaDados;
    } else {
        return [];
    }
}
