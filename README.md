# 🚢 Comex.io - Import Hunter

Sistema de análise de importação que utiliza **engenharia reversa** para calcular valores FOB (Free On Board) a partir de preços de venda no mercado brasileiro.

## 📋 Sobre o Projeto

O **Comex.io** é uma ferramenta que permite:
- Buscar produtos (Drones DJI e Smartphones Xiaomi) com preços reais
- Calcular o valor FOB estimado através de engenharia reversa de impostos
- Gerar relatórios de auditoria com dados de importação
- Exportar planilhas CSV no formato Siscomex
- Visualizar analytics com gráficos de margem, peso e distribuição

A ferramenta aplica a **cadeia tributária brasileira em ordem reversa** para estimar o custo real de importação, considerando:
- Imposto de Importação (II)
- IPI (Imposto sobre Produtos Industrializados)
- PIS/COFINS
- ICMS
- Margem estimada do vendedor

## 🚀 Tecnologias

**Backend:**
- Node.js + Express
- Axios (integração com APIs externas)
- json2csv (geração de relatórios)

**Frontend:**
- React + Vite
- Recharts (visualização de dados)
- CSS moderno com temas claro/escuro

## 💻 Como Rodar Localmente

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Backend
```bash
cd backend
npm install
npm start
```
O backend rodará em `http://localhost:3001`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
O frontend rodará em `http://localhost:5173`

## 📦 Estrutura do Projeto

```
sitev2/
├── backend/
│   ├── controllers/          # Controladores (lógica de rotas)
│   ├── services/             # Serviços (lógica de negócio)
│   ├── data/                 # Base de dados NCM
│   └── server.js             # Entrada do servidor
├── frontend/
│   ├── src/
│   │   ├── components/       # Componentes React
│   │   ├── services/         # Integração com API
│   │   └── utils/            # Utilitários
│   └── index.html
└── GUIA_DEPLOY.md           # Guia de deploy no Vercel
```

## 🌐 Deploy

Para fazer deploy no Vercel, siga as instruções detalhadas no arquivo [GUIA_DEPLOY.md](./GUIA_DEPLOY.md).

## 📸 Funcionalidades

- **Motor de Busca**: Pesquisa de produtos por categoria (Drones/Smartphones)
- **Cálculo FOB**: Engenharia reversa de impostos para estimar custo de importação
- **Tabela de Auditoria**: Visualização detalhada de produtos analisados
- **Analytics**: Gráficos de margem, peso total e distribuição
- **Exportação CSV**: Formato compatível com Siscomex

## 📄 Licença

MIT

---

Desenvolvido com ❤️ para otimização de processos de importação
