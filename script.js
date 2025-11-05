// script.js (Modificado)
document.addEventListener('DOMContentLoaded', () => {
    // ... (mesmas variáveis do seu arquivo original)
    const urlInput = document.getElementById('urlInput');
    const verifyButton = document.getElementById('verifyButton');
    const resultsDiv = document.getElementById('results');
    const loadingDiv = document.getElementById('loading');
    const reportDiv = document.getElementById('report');

    verifyButton.addEventListener('click', startScan);
    urlInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            startScan();
        }
    });

    // Função startScan MODIFICADA
    async function startScan() { // Transformamos em 'async'
        const url = urlInput.value.trim();
        if (!url) {
            alert('Por favor, insira uma URL para verificar.');
            return;
        }

        // 1. Limpa e mostra o loading (igual ao seu)
        reportDiv.innerHTML = '';
        reportDiv.classList.add('hidden');
        resultsDiv.classList.remove('hidden');
        loadingDiv.classList.remove('hidden');

        // 2. SUBSTITUÍMOS o 'setTimeout' pela chamada real à API
        try {
            const response = await fetch('http://localhost:3000/scan', { // O endereço do nosso back-end
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: url }), // Enviando a URL para o back-end
            });

            if (!response.ok) {
                throw new Error('A resposta do servidor não foi OK.');
            }

            const data = await response.json(); // Pegando os dados reais

            // 3. Esconde o loading e mostra o relatório
            loadingDiv.classList.add('hidden');
            
            // 4. Usamos os dados reais (data) em vez dos falsos
            generateRealReport(url, data); // Nova função
            
            reportDiv.classList.remove('hidden');

        } catch (error) {
            console.error('Erro ao conectar com o back-end:', error);
            loadingDiv.classList.add('hidden');
            reportDiv.innerHTML = `<p>Erro ao realizar a verificação. O servidor back-end está rodando?</p>`;
            reportDiv.classList.remove('hidden');
        }
    }

    // Função que substitui a 'generateFakeReport'
    function generateRealReport(url, data) {
        // 'data.nmapResult' contém a saída do Nmap.
        // Você precisará tratar essa string para exibi-la formatada.
        // O Gobuster seria similar (data.gobusterResult).

        // Exemplo simples de exibição
        const reportHTML = `
            <h2>Relatório para: <span>${url}</span></h2>
            <br>
            
            <div class="report-card">
                <h3><span class="status-icon">🚨</span>Resultado do Nmap (Portas Abertas)</h3>
                <pre>${data.nmapResult || 'Nenhum resultado.'}</pre>
            </div>
            
            `;

        reportDiv.innerHTML = reportHTML;
    }
});