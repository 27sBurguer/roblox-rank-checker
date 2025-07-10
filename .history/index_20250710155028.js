const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const GROUP_ID = 34259681; // Coloque o ID do seu grupo aqui

app.post('/get-rank', async (req, res) => {
  const userId = req.body.userId;
  if (!userId) {
    return res.status(400).json({ error: 'userId é obrigatório' });
  }

  try {
    const response = await axios.get(`https://groups.roblox.com/v1/users/${userId}/groups`);
    const groups = response.data.data;

    console.log(`Grupos do usuário ${userId}:`, groups);

    const groupData = groups.find(group => group.id === GROUP_ID);

    if (!groupData) {
      return res.json({ inGroup: false });
    }

    return res.json({
      inGroup: true,
      rank: groupData.roleRank,
      role: groupData.role
    });
  } catch (error) {
    console.error('Erro ao consultar API da Roblox:', error);
    if (error.response) {
      console.error('Status da resposta:', error.response.status);
      console.error('Dados da resposta:', error.response.data);
    }
    return res.status(500).json({ error: 'Erro ao consultar API da Roblox' });
  }
});

app.get('/', (req, res) => {
  res.send('API de verificação de grupo Roblox ativa!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
