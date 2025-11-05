// server.js (Corrigido)

const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');
const { URL } = require('url'); // Importante: Usaremos a classe URL nativa
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post('/scan', (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'Nenhuma URL fornecida.' });
    }

    let hostname;
    try {
        // 1. Extraímos o hostname da URL completa
        // Ex: "http://testphp.vulnweb.com/index.php" -> "testphp.vulnweb.com"
        hostname = new URL(url).hostname;

    } catch (error) {
        // 2. Se falhar (ex: usuário digitou "google.com" sem "http://")
        // Nós adicionamos o "http://" e tentamos de novo.
        try {
            hostname = new URL('http://' + url).hostname;
        } catch (e) {
            // Se falhar de novo, a URL é realmente inválida.
            console.error("URL inválida:", url);
            return res.status(400).json({ error: 'URL inválida ou não reconhecível.' });
        }
    }
    
    // 3. !!! VALIDAÇÃO DE SEGURANÇA !!!
    // Agora que temos *apenas* o hostname, verificamos se ele
    // contém caracteres perigosos (como ';', '&', '|', etc.)
    // Esta regex procura por qualquer coisa que NÃO seja letra, número, ponto ou hífen.
    if (/[^a-zA-Z0-9.-]/.test(hostname)) {
        console.error("Hostname inválido (possível injeção):", hostname);
        return res.status(400).json({ error: 'Hostname inválido.' });
    }

    // 4. Se chegou aqui, o hostname é limpo e válido.
    console.log(`Iniciando scan para (hostname): ${hostname}`);

    // 5. Executando o Nmap com o hostname correto
    const nmapCommand = `nmap -F ${hostname}`; 

    exec(nmapCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`Erro ao executar Nmap: ${stderr}`);
            return res.status(500).json({ error: 'Falha ao escanear.' });
        }

        // 6. Devolvendo o resultado real do Nmap
        res.json({
            nmapResult: stdout
        });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor back-end rodando na porta ${PORT}`);
});