document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('urlInput');
    const verifyButton = document.getElementById('verifyButton');
    const resultsDiv = document.getElementById('results');
    const loadingDiv = document.getElementById('loading');
    const reportDiv = document.getElementById('report');

    // Inicia a verificação ao clicar no botão ou apertar Enter
    verifyButton.addEventListener('click', startScan);
    urlInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            startScan();
        }
    });

    function startScan() {
        const url = urlInput.value.trim();
        if (!url) {
            alert('Por favor, insira uma URL para verificar.');
            return;
        }

        // 1. Limpa resultados anteriores e mostra o loading
        reportDiv.innerHTML = '';
        reportDiv.classList.add('hidden');
        resultsDiv.classList.remove('hidden');
        loadingDiv.classList.remove('hidden');

        // 2. Simula um tempo de espera (2.5 segundos) para a "varredura"
        setTimeout(() => {
            // 3. Esconde o loading e mostra a área do relatório
            loadingDiv.classList.add('hidden');
            generateFakeReport(url);
            reportDiv.classList.remove('hidden');
        }, 2500);
    }

    function generateFakeReport(url) {
        // Dados "fake" para o relatório
        const fakeDirectories = ['/admin/', '/backup/', '/.git/', '/config.old'];
        const fakeOpenPorts = [
            { port: 21, service: 'FTP', risk: 'Alto', riskClass: 'risk-high', info: 'Permite transferência de arquivos, muitas vezes de forma insegura.' },
            { port: 22, service: 'SSH', risk: 'Médio', riskClass: 'risk-medium', info: 'Acesso remoto ao servidor. Requer senhas fortes e monitoramento.' },
            { port: 3306, service: 'MySQL', risk: 'Alto', riskClass: 'risk-high', info: 'Banco de dados exposto publicamente. Acesso deve ser restrito.' }
        ];

        // Monta o HTML do relatório
        const reportHTML = `
            <h2>Relatório para: <span>${url}</span></h2>
            <br>
            
            <div class="report-card">
                <h3><span class="status-icon">⚠️</span>Diretórios Expostos</h3>
                <p>
                    Uma varredura (simulando <strong>dirb/gobuster</strong>) encontrou diretórios com nomes comuns que podem expor informações sensíveis.
                    É recomendado renomeá-los ou restringir o acesso.
                </p>
                <ul>
                    ${fakeDirectories.map(dir => `<li>${dir}</li>`).join('')}
                </ul>
            </div>

            <div class="report-card">
                <h3><span class="status-icon">🚨</span>Portas Abertas</h3>
                <p>
                    Uma verificação de portas (simulando <strong>nmap</strong>) identificou os seguintes serviços expostos à internet. Portas desnecessárias
                    devem ser fechadas por um firewall.
                </p>
                <ul>
                    ${fakeOpenPorts.map(port => `
                        <li>
                            <strong>Porta ${port.port} (${port.service})</strong> <span class="risk-tag ${port.riskClass}">${port.risk}</span>
                            <br><small>${port.info}</small>
                        </li>`).join('')}
                </ul>
            </div>

            <div class="report-card">
                <h3><span class="status-icon">❗️</span>Verificação de Senhas Comuns</h3>
                <p>
                    Nossa análise (simulando a lista <strong>rockyou.txt</strong>) sugere que algumas contas de usuário em sistemas conectados a este domínio
                    podem estar utilizando senhas fracas e comumente vazadas. <strong>Recomende aos seus usuários que utilizem senhas fortes e únicas.</strong>
                </p>
            </div>
        `;

        reportDiv.innerHTML = reportHTML;
    }
});
