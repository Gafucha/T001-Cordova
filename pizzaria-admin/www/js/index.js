document.addEventListener('deviceready', onDeviceReady, false);

//Execução instantânea
function onDeviceReady() {
    cordova.plugin.http.setDataSerializer('json');

        //Definindo listeners
    document.getElementById('btnNovo').addEventListener('click', pgc);
    document.getElementById('btnFoto').addEventListener('click', tirarFoto);
    document.getElementById('btnSalvar').addEventListener('click', postPizza);
    document.getElementById('btnExcluir').addEventListener('click', deletaPizza);
    document.getElementById('btnCancelar').addEventListener('click', pgcret);
}

//Função para trocar de página
function pgc() {
    //V1
    //Fazendo a página da lista ficar invisível
    document.getElementById("applista").style.display = "none";
    //Fazendo a página de cadastro ficar visível
    document.getElementById("appcadastro").style.display = "flex";
}

//Função para trocar de página
function pgcret() {
    //V1
    //Fazendo a página da lista ficar visível
    document.getElementById("applista").style.display = "flex";
    //Fazendo a página de cadastro ficar invisível
    document.getElementById("appcadastro").style.display = "none";
}

//Constante tirando foto
const tirarFoto = () => {
    navigator.camera.getPicture(onSuccess, onFail, {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL
    });

    function onSuccess(imageData) {
        document.getElementById('imagem').style.backgroundImage = "url('" + imageData + "')";
    }

    function onFail(message) {
        alert('Failed because: ' + message);
    }}

//Constante pra enviar a foto
const enviarFoto = (dadoImagem) => {
    cordova.plugin.http.setDataSerializer('json');
    cordova.plugin.http.post('https://pedidos-pizzaria.glitch.me/imagem', {
    imagem: dadoImagem
    }, {}, function(response) {
    alert(response.status);
    }, function(response) {
    alert(response.error);
    });
    }

//Variável pra testar se é Salvar ou PUT
let sorp = 0;
//Salvando os dados da pizza (Via POST)
const postPizza = () => {
    //Definindo as variáveis
    vPIZZARIA_ID = document.getElementById('pizzaria').value
    vpizza = document.getElementById('pizza').value
    vpreco = document.getElementById('preco').value
    vimagem = imagem.style.backgroundImage
    //Testando se é POST ou PUT
    if(sorp == 0) {
        //Processo de POST
        cordova.plugin.http.setDataSerializer('json');
        cordova.plugin.http.post('https://pedidos-pizzaria.glitch.me/admin/pizza/', {
        pizzaria: vPIZZARIA_ID, pizza: vpizza, preco: vpreco, imagem: vimagem
        }, {}, function(response) {
        alert(response.status);
        }, function(response) {
        alert(response.error);
        });
    } else {
        //Realizando o PUT
        cordova.plugin.http.setDataSerializer('json');
        cordova.plugin.http.put('https://pedidos-pizzaria.glitch.me/admin/pizza/', {
        pizzaid: vID, pizzaria: vPIZZARIA_ID, pizza: vpizza, preco: vpreco, imagem: vimagem
        }, {}, function(response) {
        alert(response.status);
        }, function(response) {
        alert(response.error);
        });
    }
    
}

//Não consegui fazer o GET pelo nome da pizzaria
const request = () => {
    //Processo de GET pelo nome da pizzaria
    cordova.plugin.http.get('https://pedidos-pizzaria.glitch.me/admin/pizzas/' + vPIZZARIA_ID, {
}, {}, function(response) {
  // para converter a resposta em JSON
  console.log(JSON.parse(response.data));
  alert(response.data);
}, function(response) {
  alert(response.error);
});
}

//Função para deletar a pizzaria
const deletaPizza = () => {
    //Processo de DELETE pelo nome da pizzaria e a pizza
    cordova.plugin.http.delete('https://pedidos-pizzaria.glitch.me/admin/pizza/' + vPIZZARIA_ID + '/' + vpizza, {
    }, {}, function(response) {
        console.log(JSON.parse(response.data));
        alert(response.data);
      }, function(response) {
        alert(response.error);
      });
      }

//Variável global para armazenar pizza
let listaPizzasCadastradas
//Função para carregar as pizzas
function carregarPizzas() {
    //Processo de GET pelo nome da pizzaria
    cordova.plugin.http.get('https://pedidos-pizzaria.glitch.me/admin/pizzas/' + vPIZZARIA_ID, {
    }, {}, function(response) {
        if(response.data != '') {
            listaPizzasCadastradas = JSON.parse(response.data);
        }
    });
    //Percorrenco a variável pra montar a lista
    listaPizzasCadastradas.forEach((item, idx) => {

        const novo = document.createElement('div');
        novo.classList.add('linha');
        novo.innerHTML = item.pizza;
        novo.id = idx;
        novo.onclick = function () {
            carregarDadosPizza (novo.id);
        };
        
        listaPizzas.appendChild(novo);
    });
}

//Carregando dados da pizza
function carregarDadosPizza(id) {
    //Exibir o cadastro da pizza
    document.getElementById('pizza').value = vpizza
    document.getElementById('preco').value = vpreco
    //Colocando a imagem da nova pizza
    imagem.style.backgroundImage = listaPizzasCadastradas[id].imagem
    //Fazer um PUT final quando o usuário clicar em salvar
    //Definindo as variáveis
    vID = id
    vPIZZARIA_ID = document.getElementById('pizzaria').value
    vpizza = document.getElementById('pizza').value
    vpreco = document.getElementById('preco').value
    vimagem = imagem.style.backgroundImage
    //Setando a variável de PUT
    sorp = 1;
}