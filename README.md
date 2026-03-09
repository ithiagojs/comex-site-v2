# 📊 COMEX.IO — Import Hunter

## ℹ️ Contexto do Projeto

O projeto **COMEX.IO** surge para resolver um desafio estratégico no setor de comércio exterior:

**Qual é o valor FOB dos produtos comprados pelos concorrentes na China para decidir se vale a pena importá-los?**

**FOB** (Free On Board) representa o valor do produto na origem. Sem acesso às notas fiscais dos concorrentes, nosso papel foi utilizar **engenharia reversa financeira** para estimar esses valores a partir do preço final de venda praticado no mercado brasileiro (Drones DJI e Smartphones Xiaomi).

## 📊 Dashboard de Performance e Auditoria

Antes da análise técnica, a ferramenta oferece uma interface de auditoria e analytics com métricas estratégicas:

### 🔎 Visão Geral

Nesta visão, o sistema processa:

- Custo China Estimado (FOB)
- Margem Bruta Real vs. Esperada
- Markup e ROI (Retorno sobre Investimento)
- Valor de Mercado consolidado

### 🚢 Análise Logística e Tributária

- **Portos de Entrada**: Identificação de tendências (ex: Drones via Viracopos/Aéreo e Smartphones via Santos/Marítimo).
- **Impacto dos Impostos**: Visualização clara do peso do **II**, **IPI**, **PIS/COFINS** e **ICMS** no preço final — identificando os "vilões fiscais".

### 🔁 Engenharia Reversa — Estimativa de FOB

Para estimar o valor FOB, o sistema consome preços reais de mercado e aplica a cadeia tributária brasileira em ordem inversa.

### 📌 Premissas Utilizadas

- **Impostos**: Alíquotas baseadas no NCM de Drones e Smartphones.
- **Margens**: Estimativa de lucro do revendedor local para chegar ao custo de importação puro.

### 🔎 Duas perspectivas de cálculo

- **FOB via Markup**: Cálculo baseado na visão da área de compras.
- **FOB Engenharia Reversa**: Cálculo removendo camadas de impostos e margens (visão financeira).

## 🤖 Funcionalidades da Ferramenta

- **Motor de Busca**: Pesquisa dinâmica por categorias.
- **Exportação CSV**: Geração de relatórios no formato compatível com o Siscomex.
- **Analytics Interativo**: Gráficos de distribuição de margem e peso total de carga.

## 🎯 Conclusão

Mesmo sem dados internos dos concorrentes, a engenharia reversa permite materializar informações que apoiam a tomada de decisão. O dashboard traz indicadores que geram insights para **negociação**, **precificação** e **logística**, transformando dados brutos de mercado em suporte estratégico.

## 🔄 Pipeline de Dados e Tecnologias

O projeto foi construído com uma arquitetura moderna dividida em:

### Backend (Processamento)

- **Node.js + Express**: API de integração e lógica de cálculo.
- **Axios**: Coleta de dados externos.

### Frontend (Visualização)

- **React + Vite**: Interface rápida e responsiva.
- **Recharts**: Dashboards e visualização de dados analíticos.

## 🔗 Links Úteis

- 💻 **Repositório Técnico (Automação)**: [Comex-io-Dashboard-Data](https://github.com/karinamsilva/Comex-io-Dashboard-Data)
- 🌐 **Site Oficial (Deploy)**: [Comex](https://import-hunter.vercel.app/)
- 📑 **Base de Dados (Google Sheets)**: [Acesse a planilha](https://docs.google.com/spreadsheets/d/1XmZuiNUZMyYHbPke7uMoERvs3WeGM2ayMoiSdAgiNZM/edit?usp=sharing)
- 🗄️ **Streamlit de Referência**: [Dados Luiz Chiavini](https://comexio.streamlit.app/)
- 🧩 **Board Trello**: [Gestão do Grupo 7](https://trello.com/b/rxpxQ09r/comex-io-grupo-7)

## 📖 Sobre o Projeto

O **Comex.io** foi desenvolvido em conjunto por **Karina Martins** e **Thiago Jacques** para o projeto final do **Bootcamp de Analista de Dados da Generation Brasil**.
