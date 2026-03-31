
// I : Declaração de variáveis

const imagem = document.querySelector(".imagemdocao");
const nome = document.querySelector(".resposta1");
const temperamento = document.querySelector(".resposta2");
const vida = document.querySelector(".resposta3");
const origem = document.querySelector(".resposta4");
const botao = document.getElementById("buscarbtn");


// Array global (armazena todas as raças vindas da API)
let racas = [];


// II : FUNÇÕES 

async function carregarRacas() { //função que busca todas as raças da API
    try {
        const resposta = await fetch("https://api.thedogapi.com/v1/breeds", { //Requisição GET para obter todas as raças disponíveis na API
            headers: {
                "x-api-key": "live_VkdeW0dzrzi0XPTB4bxtvNUMsFdpZdKfafzDrueyJb70zdF9YUanwu9mFJpHOMGi" //chave de acesso
            }
        });
        
        if (!resposta.ok) { // verifica se a requisição deu certo, se não, lança um erro
            throw new Error("Erro ao carregar raças");
        }
        
        racas = await resposta.json(); //Converte a resposta em JSON e armazena todas as raças no array global
    
    } catch (erro) {
        console.error("Erro ao carregar raças:", erro);
    }
}

// A função é acionada ao abrir a página
carregarRacas();


// III : FUNÇÃO ASSÍNCRONA - Gerar cão

async function gerarCao() { //Acionada ao clicar no botão

  try {
    // aparece "carregando" na tela
    if (racas.length === 0) {
        nome.textContent = "Carregando raças...";
        return;
    }

    // busca imagem com raça
    const respostaimagem = await fetch( 
        "https://api.thedogapi.com/v1/images/search?has_breeds=true", //Retorna imagem aleatória COM raça
        {
        headers: {
          "x-api-key": "live_VkdeW0dzrzi0XPTB4bxtvNUMsFdpZdKfafzDrueyJb70zdF9YUanwu9mFJpHOMGi" // chave de acesso
        }
      }
    );

    if (!respostaimagem.ok) {
      throw new Error("Erro ao buscar imagem"); // verifica se a requisição deu certo, se não, lança um erro
    }

    const imagemdata = await respostaimagem.json(); //Converte resposta 
      // A API retorna um array, pegamos o primeiro resultado
    const cao = imagemdata[0];

    // valida se tem raça
    if (!cao.breeds || cao.breeds.length === 0) { //"Se cao.breeds não existe OU cao.breeds está vazio"
      throw new Error("Imagem sem raça"); //garante que a imagem realmente tem informações da raça 
    }

    //pega o ID da raça da imagem
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
