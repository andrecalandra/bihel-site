# Lançamento do site novo em www.bihel.com.br

Esta versão está pronta na branch `lancamento`. Enquanto ela não for aplicada, o site continua bloqueado
para o Google em `bihel-site.vercel.app` (de propósito).

## O que a branch `lancamento` muda
- Remove o bloqueio de indexação (`noindex`) do HTML e do cabeçalho do servidor.
- Troca canonical, `og:url`, imagens de compartilhamento e dados estruturados para `https://www.bihel.com.br`.
- Cria `public/sitemap.xml` e liga o `robots.txt` a ele.
- Redireciona os endereços antigos do WordPress (`/sobre-nos`, `/servicos/...`, `/contato`, `/blog`...) para a página nova (301/308).
- Mantém `/painel` e `/api/` fora do Google; `/privacidade` continua com `noindex`.
- Inclui `scripts/verificar-lancamento.mjs`, que confere tudo depois que o site entrar no ar.

## Ordem certa (importa!)

### 1. Antes de tudo (você)
- Na Vercel, no projeto do site **novo** (`bihel-site`): **Settings → Domains → Add** `www.bihel.com.br` e `bihel.com.br`.
  - Se os domínios estiverem no projeto da página de manutenção, remova de lá primeiro (**Settings → Domains → Remove**).
  - Em `bihel.com.br` (sem www), escolha **Redirect to www.bihel.com.br**.
  - Se a Vercel pedir ajuste de DNS, siga o que ela mostrar (normalmente já está certo, pois o domínio já usa a Vercel).
- Espere o selo **Valid Configuration** nos dois domínios.

### 2. Aplicar a versão de lançamento (eu)
- Dizer "pode lançar" no chat. Eu faço o merge da branch `lancamento` na `main`, e a Vercel publica sozinha.
- Em seguida rodo: `node scripts/verificar-lancamento.mjs --dominios` e confiro tudo.

### 3. Depois que `www.bihel.com.br` abrir o site novo (eu)
- Ativo o redirecionamento de `bihel-site.vercel.app` para `www.bihel.com.br` (só depois de confirmar que o domínio funciona,
  senão o site sumiria para quem usa o endereço antigo).
- Se quiser, desligo também o GitHub Pages (`andrecalandra.github.io/bihel-site`), que é uma cópia do site.

### 4. Google (você; leva 10 minutos)
1. Abra https://search.google.com/search-console e **adicione a propriedade** `bihel.com.br` (tipo *Domínio*).
   O Google pede para criar um registro TXT no DNS. Se preferir não mexer no DNS, escolha *Prefixo do URL*
   `https://www.bihel.com.br/` e me mande a tag `<meta name="google-site-verification" ...>` que eu coloco no site.
2. **Sitemaps** → envie `https://www.bihel.com.br/sitemap.xml`.
3. **Inspeção de URL** → cole `https://www.bihel.com.br/` → **Solicitar indexação**.
4. Perfil da Empresa no Google (Google Meu Negócio): confira se o site cadastrado é `https://www.bihel.com.br`.
5. Em **Páginas** (Indexação), depois de alguns dias, veja se aparece algum endereço antigo com erro 404. Me mande a lista
   que eu incluo os redirecionamentos que faltarem.

## Quanto tempo leva?
- Busca pelo nome "Bihel Engenharia": normalmente alguns dias após o pedido de indexação.
- Buscas como "autovistoria Niterói" e "inspeção predial Niterói": de semanas a meses. Não dá para prometer posição.
- O site novo tem uma página só (mais a política de privacidade). Para ganhar mais presença no Google, o próximo passo
  é criar **uma página para cada serviço** (por exemplo "Autovistoria Predial em Niterói").

## Se algo der errado
- Voltar atrás é simples: reverter o merge na `main` (a Vercel republica em ~1 minuto).
- Se o site novo abrir mas o Google não indexar em 2 semanas, o Search Console mostra o motivo em **Inspeção de URL**.
