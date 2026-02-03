# Guia de Deploy Seguro no Vercel - Comex.io

Este guia passo a passo ajudará você a colocar seu projeto online para apresentação. A estratégia "Monorepo" (um repositório, dois projetos no Vercel) é a mais organizada e profissional para o seu caso.

## 1. Preparação (Já Realizada)
- [x] O código do Backend foi corrigido e configurado.
- [x] O código do Frontend foi configurado para build correto.
- [x] Arquivos de configuração do Vercel (`vercel.json`) verificados.

## 2. Criar Repositório no GitHub
Como você está no Windows, a maneira mais fácil é via navegador ou GitHub Desktop, mas se tiver Git instalado no terminal:

1. Vá para a pasta raiz `sitev2`.
2. Inicialize o git: `git init`
3. Adicione os arquivos: `git add .`
4. Faça o primeiro commit: `git commit -m "Inicializando projeto comex.io"`
5. Crie um novo repositório no GitHub (ex: `comex-site-v2`) e siga as instruções para conectar (o comando `git remote add origin ...` e `git push ...`).

## 3. Deploy do Backend (Faça este PRIMEIRO)
O Backend precisa estar online para fornecer a URL que o Frontend vai usar.

1. Acesse seu dashboard no **Vercel** (vercel.com).
2. Clique em **"Add New..."** > **"Project"**.
3. Importe seu repositório do GitHub (`comex-site-v2`).
4. **IMPORTANTE**: Na configuração do projeto:
   - **Project Name**: Use algo como `comex-backend`.
   - **Root Directory**: Clique em "Edit" e selecione a pasta `backend`.
5. Clique em **Deploy**.
6. Aguarde finalizar. Quando estiver pronto, copie o domínio gerado (ex: `https://comex-backend-xyz.vercel.app`).
   - *Teste o backend acessando no navegador: `https://seu-backend.vercel.app/` (Deve ver a mensagem de status).*

## 4. Conectar Frontend ao Backend
Agora precisamos dizer ao Frontend onde o Backend está.

1. No seu computador, abra o arquivo `frontend/vercel.json`.
2. Encontre a linha `"destination"`.
3. Substitua a URL antiga pela URL nova do SEU backend.
   
   **Exemplo:**
   ```json
   "rewrites": [
     {
       "source": "/api/:path*",
       "destination": "https://comex-backend-xyz.vercel.app/api/:path*"
     }
   ]
   ```
   *(Mantenha o final `/api/:path*` exatamento como está)*

4. Salve o arquivo.
5. "Comite" e envie a alteração para o GitHub:
   ```bash
   git add frontend/vercel.json
   git commit -m "Configura URL do backend"
   git push
   ```

## 5. Deploy do Frontend
Com a ligação feita, vamos subir o site.

1. No dashboard do **Vercel**, clique novamente em **"Add New..."** > **"Project"**.
2. Importe o **MESMO** repositório (`comex-site-v2`).
3. **IMPORTANTE**: Na configuração deste novo projeto:
   - **Project Name**: Use algo como `comex-frontend`.
   - **Root Directory**: Clique em "Edit" e selecione a pasta `frontend`.
   - **Framework Preset**: O Vercel deve detectar "Vite". Se não, selecione "Vite".
4. Clique em **Deploy**.

## 6. Teste Final
Acesse a URL do seu Frontend (ex: `https://comex-frontend-abc.vercel.app`).
- O site deve carregar.
- Teste as funcionalidades que usam o backend (cotação do dólar, cálculo de impostos).
- Se funcionar, parabéns! Você está pronto para apresentar.

> [!TIP]
> Se precisar alterar algo no código, basta fazer `git push`. O Vercel atualizará automaticamente os projetos afetados.
