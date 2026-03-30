
// I : Declaração de variáveis

const imagem = document.querySelector(".imagemdocao");
const nome = document.querySelector(".resposta1");
const temperamento = document.querySelector(".resposta2");
const vida = document.querySelector(".resposta3");
const origem = document.querySelector(".resposta4");
const botao = document.getElementById("buscarbtn");


// Variável global (armazena todas as raças vindas da API)
let racas = [];


// II : FUNÇÕES - Carregar (1 vez)

async function carregarRacas() {
    try {
        const resposta = await fetch("https://api.thedogapi.com/v1/breeds", {
            headers: {
                "x-api-key": "live_MG3o4p9IwIagnDT4F12LYFmepTr8c5y43WQxlUAIdGP1a8WjO3xLnU46vuA8ccrY" //chave de acesso
            }
        });
        
        if (!resposta.ok) { // verifica se a requisição deu certo, se não, lança um erro
            throw new Error("Erro ao carregar raças");
        }
        
        racas = await resposta.json();
    
    } catch (erro) {
        console.error("Erro ao carregar raças:", erro);
    }
}

// Chama ao abrir a página
carregarRacas();


// III : FUNÇÃO ASSÍNCRONA - Gerar cão

async function gerarCao() {

  try {
    // aparece "carregando" na tela
    if (racas.length === 0) {
        nome.textContent = "Carregando raças...";
        return;
    }

    // busca imagem com raça
    const respostaimagem = await fetch( //busca uma imagem aleatória que tenha raça associada
        "https://api.thedogapi.com/v1/images/search?has_breeds=true",
        {
        headers: {
          "x-api-key": "live_MG3o4p9IwIagnDT4F12LYFmepTr8c5y43WQxlUAIdGP1a8WjO3xLnU46vuA8ccrY" // chave de acesso
        }
      }
    );

    if (!respostaimagem.ok) {
      throw new Error("Erro ao buscar imagem"); // verifica se a requisição deu certo, se não, lança um erro
    }

    const imagemdata = await respostaimagem.json(); //Converte resposta e pega o primeiro cachorro da lista
      // A API retorna um array, pegamos o primeiro resultado
    const cao = imagemdata[0];

    // valida se tem raça
    if (!cao.breeds || cao.breeds.length === 0) { //"Se cao.breeds não existe OU cao.breeds está vazio"
      throw new Error("Imagem sem raça"); //garante que a imagem realmente tem informações da raça 
    }
    
    const racaid = cao.breeds[0].id; // Esse ID será usado p/ encontrar os dados completos

    // tenta pegar dados completos
   const infocompleta = racas.find(function(raca) { //procura (find) no array racas e a raça com o mesmo ID e retorna os dados completos
    return raca.id === racaid;
});
    // fallback se não encontrar
    const info = infocompleta || cao.breeds[0]; //Se encontrar dados completos, usa eles; se não encontrar, usa os dados disponíveis na imagem. Obs: Nesse caso, os dados vão vir, mas podem ser incompletos

    // Atualiza tela

    imagem.src = cao.url; //coloca a imagem do cachorro na tela

    //mostra os dados da raça
    nome.textContent = (info && info.name) || "Não informado";
    temperamento.textContent = (info && info.temperament) || "Não informado";
    vida.textContent = (info && info.life_span) || "Não informado";
    origem.textContent = (info && info.origin) || "Não informado";

  } catch (erro) {

    console.error(erro);

    nome.textContent = "Erro ao carregar dados"; //mostra mensagem de arro para o usuário
    temperamento.textContent = "";
    vida.textContent = "";
    origem.textContent = "";
  }
}

// FIM: Evento do botão - Ele no fim do código evita problemas, como o botão ser considerado NULL

botao.addEventListener("click", gerarCao);
