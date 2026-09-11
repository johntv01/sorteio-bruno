const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

const ADMIN_PASSWORD = 'bruno2020';
const tokens = new Set();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/admin/login', (req, res) => {
  const { senha } = req.body;
  if (senha === ADMIN_PASSWORD) {
    const token = require('crypto').randomBytes(32).toString('hex');
    tokens.add(token);
    res.json({ sucesso: true, token });
  } else {
    res.status(401).json({ erro: 'Senha incorreta.' });
  }
});

app.get('/api/admin/participantes', (req, res) => {
  const token = req.headers.authorization;
  if (!token || !tokens.has(token)) {
    return res.status(401).json({ erro: 'Acesso não autorizado.' });
  }
  res.json({ participantes: [], total: 0 });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});