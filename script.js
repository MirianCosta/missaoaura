let user_info;
let data_info;

const perfis = [
    {
        id: 1,
        nome: "Bruxa(o)",
        categoria: "Guardiã da sabedoria.",
        descricao: "Guarda os conhecimentos do passado e resolve os problemas do futuro.",
        recomendacao: "Tenha paciência com seus companheiros, vocês são a chave para o sucesso da missão.",
        imagem: "perfil-1.jpg"
    },
    {
        id: 2,
        nome: "Soldado",
        categoria: "Garantir a segurança dos viajantes.",
        descricao: "Possui coragem para lidar com qualquer perigo, protege seus companheiros mesmo com medo.",
        recomendacao:"Suas habilidades são importantes para a missão, deverá proteger seus companheiros.",
        imagem: "perfil-2.jpg"
    },
    {
        id: 3,
        nome: "Rainha feérica",
        categoria: "Liderança",
        descricao: "Lidera a missão e usa a diplomacia para entrar em contato com possíveis seres que residem no local.",
        recomendacao: "Procure não ser impulsiva(o), escute seus companheiros e lidere uma missão segura.",
        imagem: "perfil-3.jpg"
    },
    {
        id: 4,
        nome: "Guerreiro feérico",
        categoria: "Racionalidade do grupo",
        descricao: "Auxilia a rainha a tomar a decisão mais segura, é uma das principais forças em combate e avalia a situação.",
        recomendacao: "Avalie a situação de todos os ângulos possíveis, é importante evitar confrontos.",
        imagem: "perfil-4.jpg"
    }
];
function calcularIdade(dataNascimento) {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento + "T00:00:00");

    let idade = hoje.getFullYear() - nascimento.getFullYear();

    if (
        hoje.getMonth() < nascimento.getMonth() ||
        (
            hoje.getMonth() === nascimento.getMonth() &&
            hoje.getDate() < nascimento.getDate()
        )
    ) {
        idade--;
    }

    return idade;
}

const formulario = document.getElementById("cadastro");
const telaResultado = document.getElementById("resultado");
const areaPerfil = document.getElementById("perfil");
const botaoRefazer = document.getElementById("refazerteste");

const idsPerfis = {
    bruxa: 1,
    soldado: 2,
    rainha: 3,
    guerreiro: 4
};

formulario.addEventListener("submit", function(event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const dataNascimento = document.getElementById("data").value;

    if (!nome || !dataNascimento) {
        alert("Preencha seu nome e sua data de nascimento.");
        return;
    }

    const nascimento = new Date(dataNascimento + "T00:00:00");

    if (
        Number.isNaN(nascimento.getTime()) ||
        nascimento > new Date()
    ) {
        alert("Informe uma data de nascimento válida.");
        return;
    }

    const grupos = [
        "qualidade",
        "serMagico",
        "defeito",
        "guerra"
    ];

    const pontos = {
        bruxa: 0,
        soldado: 0,
        rainha: 0,
        guerreiro: 0
    };

    // Lê as respostas e soma os pontos
    for (const grupo of grupos) {
        const resposta = formulario.querySelector(
            `input[name="${grupo}"]:checked`
        );

        if (!resposta) {
            alert("Responda a todas as perguntas.");
            return;
        }

        if (!(resposta.value in pontos)) {
            alert("Uma das respostas está configurada incorretamente.");
            return;
        }

        pontos[resposta.value]++;
    }

    // Descobre a maior pontuação
    const maiorPontuacao = Math.max(...Object.values(pontos));

    // Obtém todos os perfis que atingiram essa pontuação
    const vencedores = Object.keys(pontos)
        .filter(chave => pontos[chave] === maiorPontuacao)
        .map(chave => {
            return perfis.find(
                perfil => perfil.id === idsPerfis[chave]
            );
        });

    const idade = calcularIdade(dataNascimento);

    // Monta o resultado de cada vencedor
    const resultadosHTML = vencedores.map(perfil => `
        <article class="personagem">
            <img
                src="img/${perfil.imagem}"
                alt="${perfil.nome}"
                class="imagem-perfil"
            >

            <h2>${escaparHTML(perfil.nome)}</h2>

            <p><strong>${escaparHTML(perfil.categoria)}</strong></p>

            <p>${escaparHTML(perfil.descricao)}</p>

            <p>
                <strong>Recomendação:</strong>
                ${escaparHTML(perfil.recomendacao)}
            </p>

            <p><strong>Pontuação:</strong> ${maiorPontuacao}</p>
        </article>
    `).join("");

    // Mostra os dados da pessoa e os vencedores
    areaPerfil.innerHTML = `
        <header class="dados-pessoa">
            <h1>Resultado da sua missão</h1>
            <p><strong>Nome:</strong> ${escaparHTML(nome)}</p>
            <p><strong>Idade:</strong> ${idade} anos</p>
        </header>

        <h2 class="titulo-perfil">
            ${vencedores.length > 1
                ? "Empate! Seus perfis são:"
                : "Seu personagem é:"}
        </h2>

        <div class="lista-perfis">
            ${resultadosHTML}
        </div>
    `;

    telaResultado.style.display = "flex";
    telaResultado.scrollTop = 0;
    document.body.classList.add("mostrando-resultado");
});

// Protege os textos inseridos no HTML
function escaparHTML(texto) {
    return String(texto).replace(/[&<>"']/g, caractere => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[caractere]);
}

// Refaz o teste sem apagar o próprio botão
botaoRefazer.addEventListener("click", function() {
    formulario.reset();

    areaPerfil.innerHTML = "";
    telaResultado.style.display = "none";
    document.body.classList.remove("mostrando-resultado");

    formulario.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});