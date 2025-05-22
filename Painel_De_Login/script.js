// Proteções básicas contra DDoS/DoS
let loginAttempts = 0;
const maxAttempts = 5;
let isBlocked = false;
let blockTime = 30000; // 30 segundos de bloqueio após muitas tentativas

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Impede o envio padrão do formulário
    
    if (isBlocked) {
        document.getElementById('errorMessage').textContent = 'Acesso temporariamente bloqueado devido a muitas tentativas. Tente novamente mais tarde.';
        return;
    }
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Simulação de verificação de credenciais
    if (username === 'admin' && password === 'senha123') {
        alert('Login bem-sucedido!');
        // Resetar contador após login bem-sucedido
        loginAttempts = 0;
        document.getElementById('attemptsCounter').textContent = `Tentativas restantes: ${maxAttempts - loginAttempts}`;
    } else {
        loginAttempts++;
        document.getElementById('attemptsCounter').textContent = `Tentativas restantes: ${maxAttempts - loginAttempts}`;
        
        if (loginAttempts >= maxAttempts) {
            blockUser();
        } else {
            document.getElementById('errorMessage').textContent = 'Credenciais inválidas. Por favor, tente novamente.';
        }
    }
});

function blockUser() {
    isBlocked = true;
    document.getElementById('loginButton').disabled = true;
    document.getElementById('errorMessage').textContent = `Muitas tentativas falhas. Acesso bloqueado por ${blockTime/1000} segundos.`;
    
    // Mostrar contador regressivo
    let secondsLeft = blockTime / 1000;
    const timerElement = document.getElementById('timerMessage');
    timerElement.textContent = `Tempo restante: ${secondsLeft} segundos`;
    
    const timerInterval = setInterval(() => {
        secondsLeft--;
        timerElement.textContent = `Tempo restante: ${secondsLeft} segundos`;
        
        if (secondsLeft <= 0) {
            clearInterval(timerInterval);
            isBlocked = false;
            loginAttempts = 0;
            document.getElementById('loginButton').disabled = false;
            document.getElementById('errorMessage').textContent = '';
            timerElement.textContent = '';
            document.getElementById('attemptsCounter').textContent = `Tentativas restantes: ${maxAttempts}`;
        }
    }, 1000);
}

// Limitar taxa de requisições (Rate Limiting)
let lastRequestTime = 0;
const minTimeBetweenRequests = 1000; // 1 segundo entre requisições

document.getElementById('loginForm').addEventListener('submit', function(e) {
    const currentTime = Date.now();
    
    if (currentTime - lastRequestTime < minTimeBetweenRequests) {
        e.preventDefault();
        document.getElementById('errorMessage').textContent = 'Por favor, espere um momento antes de tentar novamente.';
        return;
    }
    
    lastRequestTime = currentTime;
});

// Proteção contra preenchimento automático
setTimeout(() => {
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}, 50);