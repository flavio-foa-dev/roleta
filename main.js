// Variáveis
let saldo = 100;
let items = ['🍒', '🍊', '🍇', '🔔', '💰', '⭐'];
let grid = document.getElementById('grid');
let apostarButton = document.getElementById('apostar');
let girarButton = document.getElementById('girar');
let saldoSpan = document.getElementById('saldo');

// Adicione um evento de clique ao botão 'Apostar'
apostarButton.addEventListener('click', function () {
    if (saldo >= 10) {
        saldo -= 10;
        saldoSpan.textContent = saldo;
        girarButton.disabled = false;
    }
});

// Adicione um evento de clique ao botão 'Girar'
girarButton.addEventListener('click', function () {
    if (saldo >= 10) {
        saldo -= 10;
        saldoSpan.textContent = saldo;

        // Gere aleatoriamente três itens
        let resultados = [];
        for (let i = 0; i < 3; i++) {
            resultados.push(items[Math.floor(Math.random() * items.length)]);
        }

        // Atualize a grade com os resultados
        for (let i = 0; i < grid.children.length; i++) {
            grid.children[i].textContent = resultados[i];
        }

        // Verifique se há uma combinação vencedora
        if (resultados[0] === resultados[1] && resultados[1] === resultados[2]) {
            saldo += 30; // Exemplo de pagamento
            saldoSpan.textContent = saldo;
        }
    }

    girarButton.disabled = true;
});