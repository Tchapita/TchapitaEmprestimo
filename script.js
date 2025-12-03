// Variáveis globais
let valorPedidoGlobal = 0;
let processFeeGlobal = 0;
let valorTotalGlobal = 0;

// Prefixos e Limites para os pop-ups de prova social
const PREFIXOS = ["84", "86", "82", "85", "87", "83"];
const VALOR_MIN = 500;
const VALOR_MAX = 5000;
const TIMEOUT_MIN = 5000; // 5 segundos
const TIMEOUT_MAX = 10000; // 10 segundos

// ==============================================
// FUNÇÕES DE NAVEGAÇÃO ENTRE PÁGINAS
// ==============================================
function goToPage1() { 
    document.getElementById('page1').style.display = 'block'; 
    document.getElementById('page2').style.display = 'none'; 
    document.getElementById('page3').style.display = 'none'; 
}

// A função goToPage2 usa a validação 'required' do HTML para os campos de arquivo
function goToPage2() {
    const nomeInput = document.getElementById('nome');
    const telefoneInput = document.getElementById('telefone');
    
    // Validação de campos de texto (o required do HTML cuida dos campos file)
    if (nomeInput.value && telefoneInput.value) {
        document.getElementById('page1').style.display = 'none';
        document.getElementById('page2').style.display = 'block';
        document.getElementById('page3').style.display = 'none';
        simular(); 
    } else {
        // Esta mensagem só aparecerá se os campos de texto estiverem vazios
        alert("Por favor, preencha o Nome e Telefone para avançar.");
    }
}

function goToPage3() {
    if (processFeeGlobal <= 0) { 
        alert("Erro: O valor da taxa de processamento não foi calculado. Tente simular novamente."); 
        return; 
    }
    document.getElementById('page1').style.display = 'none';
    document.getElementById('page2').style.display = 'none';
    document.getElementById('page3').style.display = 'block';
    document.getElementById('feeDisplay').textContent = processFeeGlobal.toFixed(2);
    document.getElementById('loanAmountDisplay').textContent = valorPedidoGlobal.toFixed(2);
}

// ==============================================
// FUNÇÃO DE CÁLCULO DA SIMULAÇÃO (PÁGINA 2)
// ==============================================
function simular() {
    const valorInput = document.getElementById('valor');
    const valorPedido = parseFloat(valorInput.value);
    
    if (valorPedido < 500 || valorPedido > 20000 || isNaN(valorPedido)) {
        alert("O valor deve ser entre 500 Mts e 20000 Mts.");
        valorInput.value = 1000;
        return;
    }
    
    // Cálculo do Empréstimo e Taxa de Processamento
    const taxaEmprestimo = 0.30;
    const custoEmprestimo = valorPedido * taxaEmprestimo;
    const valorTotal = valorPedido + custoEmprestimo;
    const taxaProcessamento = valorPedido * 0.10; 

    valorPedidoGlobal = valorPedido;
    processFeeGlobal = taxaProcessamento;
    valorTotalGlobal = valorTotal;
    
    // Apresenta os Valores
    document.getElementById('valorSolicitado').textContent = valorPedido.toFixed(2);
    document.getElementById('custoEmprestimo').textContent = custoEmprestimo.toFixed(2);
    document.getElementById('valorTotal').textContent = valorTotal.toFixed(2);
    
    // Geração das Opções de Prazo
    const opcoesDiv = document.getElementById('opcoesPrazo');
    opcoesDiv.innerHTML = ''; 
    
    const addOption = (semanas, prazoTexto) => {
        const numParcelas = (semanas === 2) ? 1 : semanas;
        const valorParcela = valorTotal / numParcelas;
        const periodo = (semanas === 2) ? "Pagamento Único" : `${numParcelas} pagamentos semanais`;

        opcoesDiv.innerHTML += `
            <div class="opcao-prazo">
                <div>
                    <strong>${prazoTexto}</strong> (${periodo})<br>
                    Parcela: ${valorParcela.toFixed(2)} Mts
                </div>
                <button onclick="goToPage3()">Escolher</button>
            </div>
        `;
    };

    addOption(2, "2 Semanas");
    addOption(4, "1 Mês");
    addOption(8, "2 Meses");
    addOption(16, "4 Meses");

    document.getElementById('resultado').style.display = 'block';
}

// ==============================================
// FUNÇÕES DO CHATBOT (MODAL)
// ==============================================
function openChatModal() { 
    document.getElementById('chatModal').style.display = 'block'; 
}

function closeChatModal() { 
    document.getElementById('chatModal').style.display = 'none'; 
}

function sendChatMessage() {
    const nome = document.getElementById('chat-nome').value;
    const telefone = document.getElementById('chat-telefone').value;
    const mensagem = document.getElementById('chat-mensagem').value;

    if (!nome || !telefone || !mensagem) { 
        alert("Por favor, preencha todos os campos."); 
        return; 
    }

    alert(`Mensagem de ${nome} enviada com sucesso! \n\nDetalhes:\nTelefone: ${telefone}\nMensagem: "${mensagem}"\n\nResponderemos brevemente.`);
    
    // Limpa o formulário e fecha
    document.getElementById('chat-nome').value = '';
    document.getElementById('chat-telefone').value = '';
    document.getElementById('chat-mensagem').value = '';
    closeChatModal();
}

// Fechar modal ao clicar fora
window.onclick = function(event) {
    const modal = document.getElementById('chatModal');
    if (event.target == modal) { 
        closeChatModal(); 
    }
}

// ==============================================
// FUNÇÕES DE PROVA SOCIAL (POP-UP)
// ==============================================
function gerarNumeroAleatorio(prefixos) {
    const prefixo = prefixos[Math.floor(Math.random() * prefixos.length)];
    const digitosAleatorios = Math.floor(1000000 + Math.random() * 9000000).toString().substring(1, 5); 
    return prefixo + 'xxx' + digitosAleatorios; 
}

function gerarValorAleatorio(min, max) {
    return (Math.floor(Math.random() * (max - min + 1)) + min);
}

function mostrarPopup() {
    const popup = document.getElementById('social-proof-popup');
    
    const numero = gerarNumeroAleatorio(PREFIXOS);
    const valor = gerarValorAleatorio(VALOR_MIN, VALOR_MAX);
    
    popup.innerHTML = `
        ✅ **Sucesso!**<br>
        ${numero} Recebeu ${valor} Mts.
    `;
    
    popup.classList.add('show');
    
    // Esconder o pop-up
    setTimeout(() => {
        popup.classList.remove('show');
    }, 3000); 

    // Agendar o próximo pop-up
    const proximoTimeout = Math.floor(Math.random() * (TIMEOUT_MAX - TIMEOUT_MIN + 1)) + TIMEOUT_MIN;
    setTimeout(mostrarPopup, proximoTimeout);
}

// ==============================================
// INICIALIZAÇÃO
// ==============================================
document.addEventListener('DOMContentLoaded', () => {
    simular();
    // Inicia o ciclo de pop-ups após um breve atraso
    setTimeout(mostrarPopup, 2000); 
});