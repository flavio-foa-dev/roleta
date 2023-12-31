let saldo = 100;
let ganhos = 0;
let aposta = 10;
let apostasRealizadas = 0;
let rodadasRealizadas = 0;
let rodadasAutomaticas = 10
let giradas = [0, 0, 0]; // Contador de giradas para cada coluna
let maxGiradas = 3; // Número máximo de giradas para cada coluna
let reels = [document.getElementById('reel1'), document.getElementById('reel2'), document.getElementById('reel3')];
let reelContainers = [document.getElementById('reel-container1'), document.getElementById('reel-container2'), document.getElementById('reel-container3')];
let apostarButton = document.getElementById('apostar');
let girarButton = document.getElementById('girar');
let adicionarDinheiroButton = document.getElementById('adicionar-dinheiro'); // Novo botão
let saldoSpan = document.getElementById('saldo');
let ganhosSpan = document.getElementById('ganhos');
let apostaSpan = document.getElementById('aposta');
let spinSound = document.getElementById('spinSound');
let winSound = document.getElementById('winSound');
let infoMessage = document.getElementById('info-message'); // Elemento de mensagem adicionado
let buttonClickSound = document.getElementById('buttonClickSound');
const toggleSoundButton = document.getElementById('toggleSoundButton');
let soundEnabled = true;
let errosConsecutivos = 0;
let girosParaganharFacil = randomize()

function randomize(){
    return Math.floor(Math.random() * 4) + 1
}
// Adicionando som de entrada no jogo
window.onload = function () {
    if (soundEnabled) {
        playSound('spinSound')
    }
};

function startSpinner() {
// Exiba o spinner
document.getElementById('spinner').style.display = 'inline-block';

// Execute a lógica do giro ou qualquer outra ação desejada

// Simule um atraso de 2 segundos (você pode substituir isso pela sua lógica real)
setTimeout(stopSpinner, 3000);
}

function stopSpinner() {
// Oculte o spinner após a conclusão da lógica
document.getElementById('spinner').style.display = 'none';
}

toggleSoundButton.addEventListener('click', function() {
    soundEnabled = !soundEnabled;
    toggleSoundButton.textContent = soundEnabled ? 'Som: Ligado' : 'Som: Desligado';
});


apostarButton.addEventListener('click', function () {
    console.log("Botão Apostar clicado");
    if (saldo >= aposta) {
        saldo -= aposta;
        saldoSpan.textContent = saldo;
        apostasRealizadas++;
        if (apostasRealizadas % 5 === 0) {
            aposta = 10;
        }
        apostaSpan.textContent = aposta;
        ganhosSpan.textContent = ganhos;
        girarButton.disabled = false;

    }
});

adicionarDinheiroButton.addEventListener('click', function () {
    console.log("Botão Adicionar Dinheiro clicado");
    saldo += 50; // Adiciona R$50 ao saldo
    saldoSpan.textContent = saldo;
});

function girarReel(reel, delay, colunaIndex) {
    return new Promise(resolve => {
        setTimeout(() => {
            const symbols = ['🍒', '🍊', '🍇', '🔔', '💰', '⭐', '🐯', '🐰', '😺'];
            let i = 0;
            let interval = setInterval(() => {
                reel.innerHTML = '';
                for (let j = 0; j < 3; j++) {
                    const randomIndex = Math.floor(Math.random() * symbols.length);
                    const symbol = document.createElement('div');
                    symbol.classList.add('symbol');
                    symbol.textContent = symbols[randomIndex];
                    reel.appendChild(symbol);
                }
                i++;
                if (i === maxGiradas * symbols.length) {
                    clearInterval(interval);
                    resolve(colunaIndex);
                }
            }, 100);
            giradas[colunaIndex]++;
        }, delay);
    });
}

function checkWin() {
    console.log("Verificando vitória");
    let markers = document.querySelectorAll('.marker');
    let symbols = [];

    // Adicione a classe 'marker' para destacar a linha do meio
    for (let i = 0; i < reelContainers.length; i++) {
        const marker = reelContainers[i].querySelector('.marker');
        marker.style.display = 'block';
        const symbol = reels[i].querySelector('.symbol:nth-child(2)').textContent;
        symbols.push(symbol);
    }

    if (symbols[0] === symbols[1] && symbols[1] === symbols[2]) {
        saldo += aposta * 3;
        ganhos += aposta * 3;
        saldoSpan.textContent = saldo;
        ganhosSpan.textContent = ganhos;
        if (soundEnabled) {
            winSound.play();
        }
        girosParaganharFacil = randomize()
        errosConsecutivos = 0
        showInfoMessage("Você ganhou!");
        rodadasVitoriosas++;
    } else {
        showInfoMessage("Tente novamente. Faça sua aposta.");
        for (let i = 0; i < giradas.length; i++) {
            if (giradas[i] < maxGiradas) {
            girarButton.disabled = false;
            break;
            }
        }
        errosConsecutivos++;
        if (errosConsecutivos === girosParaganharFacil) {
            // Força uma vitória na próxima rodada
            errosConsecutivos = 0; // Reinicia o contador de erros consecutivos
            forceWinNextRound();
        }
    }

    giradas = [0, 0, 0]; // Resetar contadores de giradas
    girarButton.disabled = false; // Habilitar o botão de girar novamente
}

function forceWinNextRound() {
    // Escolha um símbolo aleatório
    const symbol = getSymbol();

    // Defina as três colunas na linha do meio com o mesmo símbolo apenas no índice 1
    for (let i = 0; i < reels.length; i++) {
        reels[i].innerHTML = '';
        for (let j = 0; j < 3; j++) {
            const symbolElement = document.createElement('div');
            symbolElement.classList.add('symbol');

            // Defina o símbolo apenas no índice 1 (linha do meio)
            if (j === 1) {
                symbolElement.textContent = symbol;
            } else {
                // Para os índices 0 e 2, escolha símbolos aleatórios
                symbolElement.textContent = getSymbol();
            }

            reels[i].appendChild(symbolElement);
        }
    }

    // Exiba a mensagem de vitória forçada
    showInfoMessage("Vitória Bomus! Parabéns!");

    // Atualize o saldo e os ganhos
    saldo += aposta * 3;
    ganhos += aposta * 3;
    saldoSpan.textContent = saldo;
    ganhosSpan.textContent = ganhos;

    girosParaganharFacil = randomize()
    errosConsecutivos = 0
    console.log(girosParaganharFacil,errosConsecutivos)

    // Tocar som de vitória, se estiver habilitado
    if (soundEnabled) {
        winSound.play();
    }
}


function showInfoMessage(message) {
    infoMessage.textContent = message;
    infoMessage.style.display = 'block';
    setTimeout(() => {
        infoMessage.style.display = 'none';
    }, 1000);
}

girarButton.addEventListener('click', async function () {
    console.log("Botão Girar clicado");
    if (saldo >= aposta) {
        saldo -= aposta;
        saldoSpan.textContent = saldo;

        // Resetar o contador de apostas realizadas quando o botão de girar é pressionado
        apostasRealizadas = 0;


        girarButton.disabled = true;
        if (soundEnabled) {
             buttonClickSound.play(); // Tocar som do botão de girar
        }

        const results = await Promise.all(reels.map((reel, index) => {
            const resultSymbol = getSymbol();
            return girarReel(reel, index * 500, index);
        }));

        setTimeout(() => {
            checkWin();
           // spinSound.play();
        }, 1000);
    } else {
        showInfoMessage("Sem saldo. Adicione mais dinheiro para continuar.");
        girarButton.disabled = false;
    }
});

function getSymbol() {
    const symbols = ['🍒', '🍊', '🍇', '🔔', '💰', '⭐', '🐯', '🐰']; // Adicionando tigrinho e coelhinho
    const randomIndex = Math.floor(Math.random() * symbols.length);
    return symbols[randomIndex];
}

function playSound(soundId) {
    const sound = document.getElementById(soundId);
    if (sound) {
        sound.play();
    }
}