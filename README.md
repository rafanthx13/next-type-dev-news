# Blog DevNews

Reprodução de projeto do curso: https://www.udemy.com/course/curso-pratico-react-e-nextjs-essencial-com-typescript/

Reproduçâo de https://github.com/aluiziodeveloper/devnews

## Configurar VSCode

````json
/* .vscode/settings.json */
{
  "editor.formatOnSave": false,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules\\typescript\\lib"
}
````

## Como o Next funciona

### Particularidade do Next

+ Toda `page` deve ser exportada como default `expost default NameComponent` mas os componentes não precisa disso

### Organização do next: `/pages`

cada arquivo na página ``pages`` é uma nova rotaeu posso gerir essa pasta `pages`


posso pôr pages dentro de ``src``  criar uma pasta chamada `posts` e por o `index.tsx` como sendo a raiz dessa rota `post`

### Dynamic routes : página genérica para posts

Eu quero criar uma página como se fosse um template para toda a sub-rota.

**O ARQUIVO DEVE SER ESCRITO COM COLCHETES**

`[id].tsx`

````tsx
// src/pages/posts/[id].tsx
import { useRouter } from 'next/router';

export default function Post() {
  const router = useRouter();

  return (
    <>
      <h1>Post {router.query.id}</h1>
      <p>{router.asPath}</p>
    </>
  );
}
````

Assim, toda página gerada em posts terá esse template (exceto o `index.tsx`)

### Entendo arquivos `_app` e `_document`

`pages/_app.tsx` é o arquivo principal , o primeiro do next. Nela podemos configurar algo para que seja disponibilizado em todas as páginas da nossa aplicação.

`pages/_document.tsx`: permite customizar o HTML das páginas. Em suma: **EQUIVALE AO INDEX.HTML DO REACT/VUE**

```ts
// src/pages/_document.tsx
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
            rel="stylesheet"
          />
          <link rel="shortcut icon" href="/favicon.png" type="image/png" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
```

## Estilização no Next com SASS

### O que é SASS : Super CSS

O nome oficial é SASS: Syntactically Awesome Style Sheets

Diferença entre SASS E SCSS: É apenas syntax, arquivos .sass usam indentação, enquanto que arquivos scss usam ainda chaves.
+ https://tipscode.com.br/qual-a-diferencas-entre-sass-e-scss
+ Basicamente SASS é como se fosse o YNK=L ebqaubtoi que SCSS o CSS padrao
+ https://tableless.com.br/sass-vs-less-vs-stylus-batalha-dos-pre-processadores/

os arquivos na pasta `styles` terminam em `.module.css`

Stylized-component é apenas uma forma de estilizar no css no react

OBS: Nessa estilização de módulos, só podemos estilizar classe, não podemos estilizar diretamente tags HTML.

Utilizaremos essa forma + SASS. Assim teremos

````css
/* Home.modules.sass */
.container {
  min-height: 100vh;
  padding: 0 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.main {
  padding: 5rem 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
````
### Vantagens do Sass

+ Permite usar math, fazer contas dentro do css
+ + Tme herança e mixins de css
+ + permite criar variáveis de uma melhor forma que o css default
+ Com partials (arquivo com '_') podemos importar coisa comunas a outros css sem precisar gerar um novo css

basta lacessar o link: https://sass-lang.com/guide

### Uso do sass

É um css incrementado.

permite por classes css dentro de outras. assim ao invés de fazer

````
title {

}

titles span {

}
````

podemos fazer


````
title {
  span {

  }
}
````

````tsx
import styles from '../styles/home.module.scss';

export default function Home() {
  return (
    <h1 className={styles.title}>
      Olá <span>Dev!</span>
    </h1>
  );
}
````

### CARACTER & NO SASS

O caracter & indica o próprio elemento, assim no código abaixo

````css
a {
      display: inline-block;
      position: relative;
      padding: 0 0.5rem;
      height: 5rem;
      line-height: 5rem;
      color: var(--gray300);
      transition: color 0.2s;

      & + a {
        margin-left: 2rem;
      }

      &:hover {
        color: var(--white);
      }

      &.active {
        color: var(--white);
        font-weight: bold;
      }
    }
````

+ & + a = tag a seguida da tag a
+ &:hover = a:hover
+ &a.actve = a com a classe active

## Formas de Renderizar no Next

### 1. Client Side Rendering (CSR/SPA)

**Fake API**
Json-server : Vamo criar uma Fake API para trabalharmos por enquanto

npx json-server api.json -p 333 -w

**Client Side Rendering**

Para fazermos CSR, usamos ``useEffect`` para buscar os dados da API e assim montarmos o nosso post

````tsx
// index.tsx
import { useEffect, useState } from 'react';

interface Post {
  id: string;
  title: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch('http://localhost:3333/posts').then(response => {
      response.json().then(data => {
        setPosts(data);
      });
    });
  }, []);

  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {posts.map(post => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}
````

Assim, o Next vai está lendo o conteúdo de uma api e assim gerando a página pelo CSR.

Essa não é a forma que queremos


Aqui, o cliente está fazendo a requisição do conteúdo
. Queremos que essa busca da API não seja feita pelo cliente, por isso iremos ver Server Side Rendering.

o BROWSER ESTÁ CONSTRUINDO O HTML.

Problema dessa abordagem: se a chamada da api demorar, a página vai ficar meia pronta até chegar o fetch da api

### 2. Server Side Rendering  (SSR)

Queremos que seja SSR: queremos que um mini servidor node, disponibilizado pelo next, gere todo o html, assim , o browser do cliente não precisa fazer essa busca da api explicitamente.

Dessa forma, o browser já recebeu a página pronta, o que torna assim mais rápida.

**Como fazer SSR**

Implementamos o método ``getServerSideProps``


````tsx
// index.tsx
import { GetServerSideProps } from 'next';

interface Post {
  id: string;
  title: string;
}

interface HomeProps {
  posts: Post[];
}


// desconstrução posts
export default function Home({ posts }: HomeProps) {
  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {posts.map(post => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const response = await fetch('http://localhost:3333/posts');
  const posts = await response.json();

  return {
    props: {
      posts,
    },
  };
};
````

Como esse método funciona: Quando esse método é implementado, o
NEXT EXECUTA ELE PRIMEIRO. É por isso que não tem nenhuma chamada a aele

**``getServerSideProps`` é chamado antes do component ser renderizado e vai enviar para o nosso componente**

Dessa forma, a listagem da api será montada no node e estão enviada ao browser..

Assim,**ISSO OTIMIZA A PAR SEO** Porque o conteúdo não é mais gerado estático como uma SPA/CSR, agora por ser SSR, os motores de busca ao acessar esse link vai encontrar já pronto todo o HTMl DA PÁGINA, COM O FETCH E TUDO OMAIS

### 3. Static site generation  (SSG)

Neste modo, o html é todo gerado  no build.

No nosso caso, será ideal para o nosso projeto, pois um post depois de criado não é mais mudando, então com isso, ao fazer o build vai gerar já por html do post.

Para fazer SSG implementamos o método 'get Static Props'


O index.tsw vai ficar da seguinte forma

````
// index.tsx
import { GetStaticProps } from 'next';

interface Post {
  id: string;
  title: string;
}

interface PostsProps {
  posts: Post[];
}

export default function Posts({ posts }: PostsProps) {
  return (
    <div>
      <h1>Listagem de Posts</h1>
      <ul>
        {posts.map(post => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}

export const getStaticProps: GetStaticProps<PostsProps> = async () => {
  const response = await fetch('http://localhost:3333/posts');
  const posts = await response.json();

  return {
    props: {
      posts,
    },
    revalidate: 5, // In seconds
  };
};
````

Para geraR, eu tenho que rodar `m
pm run build` .Durante o build já mostra que OS POSTS SERÃO DO TIPO ssg.

PRA RODAR A BUILD, FAZEMOS O BUILD E EM SEGUIDA ``NEXT START``. Cada POST SERÁ UM documento html gerado automaticamente.

Como o SSR, por já ter um html físico ou seja, não é uma interpretação de javascript como o react puro é otimizado ao SEO.

Inserimos o parâmetro

`revalidate: 5` permite que a cada 5 segundos seja recriado essa página estática, mesmo depois do build

### 4. Incremental Static Re-Generation

A nossa página será estática, mas haverá uma parte de comentários que deverá ser atualizada

Isso será somente nos posts internos, que na o next são definidos por `[id].tsx`

````tsx
// [id].tsx
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';

interface Comment {
  id: string;
  body: string;
}

interface CommentsProps {
  comments: Comment[];
}

interface Post {
  id: string;
  title: string;
}

interface PostsProps {
  posts: Post[];
}

export default function Post({ comments }: CommentsProps) {
  // FUNCTIONS
  const router = useRouter();

  // check fallback
  if (router.isFallback) {
    return <p>Loading...</p>;
  }

  // RENDER
  return (
    <>
      <h1>Post {router.query.id}</h1>
      <ul>
        {comments.map(comment => (
          <li key={comment.id}>{comment.body}</li>
        ))}
      </ul>
    </>
  );
}

// Buscar os Post
// Como gerar uma página estática de um parâmetro que é dinâmico?
// getState Posts: Agente cria uma página estática para CADA POSSIBILIDADE
// ASSIM, SE MEU BLOG TEM 10 POSTS, VAI percorrer e gerar as 10 páginas estáticas para cada post
export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch('http://localhost:3333/posts');
  const posts = await response.json();

  const paths = posts.map(post => {
    return {
      params: { id: String(post.id) },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

// Buscar comentários
export const getStaticProps: GetStaticProps<CommentsProps> = async context => {
  const { id } = context.params;
  const response = await fetch(`http://localhost:3333/comments?postId=${id}`);
  const comments = await response.json();

  return {
    props: {
      comments,
    },
    revalidate: 5, // In seconds
  };
};

````
Vamos por
``fallback: true``. Assim, ao invés de gerar um arquivo a cada novo post, vai gerar só quando o post for requisitado.

Isso é necessário para corrigir o seguinte problema: `Caso tiver 100 páginas, o nosso projeto não pode gerar 100 arquivos html de uma vez só`

**com fallback=true, não vai dar erro ao criar novos posts**



## API ROUTES

O Next é como se fosse um React com um mini node. Portanto da pra usar um básico de note nele, através da pasta `api`

Todo arquivo criado na pasta`api`, aí vira um endpoint de API. São rotas/end-point da API.

Funciona como serverless, assim, NÃO É RECOMENDADO QUE O USE COMO UM BACK-END, mas permite que a gente faça pequenas coisas.

No exemplo abaixo criamos uma api simples para acessar uma lista de JSON. Pode ser consultada por `localhost:3000/api/courses`

````tsx
// src/api/courses.ts
// A rota é api/courses
import { NextApiRequest, NextApiResponse } from 'next';

export default (request: NextApiRequest, response: NextApiResponse) => {
  const courses = [
    { id: 1, name: 'Next.js com Typescript' },
    { id: 2, name: 'React.js com Typescript' },
    { id: 3, name: 'Node.js com Typescript' },
    { id: 4, name: 'SASS' },
    { id: 5, name: 'Styled Components' },
  ];

  return response.json(courses);
};
````

Podemos usar o client Thunde do VSCode
`http://localhost:3000/api/course (get)`

## Página Not-Found : `404.tsx`

deve estar em `pages` ser o arquivo `404.tsx`

````tsx
export default function NotFound() {
  return (
    <div>
      <h1>Page not found</h1>
    </div>
  );
}
````
## Dynamic Import


É a importação de componentes/lib por demanda: se eu nunca acessar aquele recurso,não acessa ela, senão, aquilo nunca será carregado

Ele apenas vai demonstrar, mas não vamos usar na realidade.

Esse aprendizado é importante para lidar com bibliotecas grandes como moment e lodash.

Exemplo


````ts
// exemplo de uma lib que será importada
export default {
  sum: (x: number, y: number) => {
    return x + y;
  },
  sub: (x: number, y: number) => {
    return x - y;
  },
};
````


````ts
export default function Calculo() {
  async function handleSum() {
    const calc = (await import('../libs/calc')).default;

    alert(calc.sum(5, 6));
  }

  return (
    <div>
      <h1>Cálculo</h1>
      <button onClick={handleSum}>Somar</button>
    </div>
  );
}
````

Para fazer Dynamic Import devemos atribuir como assíncrono na hora de usar a lib.

````ts
async function handleSum() {
    const calc = (await import('../libs/calc')).default;

    alert(calc.sum(5, 6));
  }
````

## Lazy Components

Podemos fazer também o carregamentos de componentes
**POR DEMANDA**

Esse será mais outro exemplo do poder do Next.

````ts
// src/libs/calc.ts (exemplo de componente que será carregado de modo LazyLoad)
export function Modal() {
  return <h1>Janela Modal carregada por demanda</h1>;
}
````

````ts
// src/pages/cálculo.tsx (exemplo de página que vai chamar um componente por LazyLoad)
/* eslint-disable react/display-name */
import { useState } from 'react';
import dynamic from 'next/dynamic';


const Modal = dynamic(
  () => import('../components/Modal').then(mod => mod.Modal),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  },
);

export default function Calculo() {

  // Estado que vai gerenciar o estado
  const [modalVisible, setModalVisible] = useState(false);

  async function handleSum() {
    const calc = (await import('../libs/calc')).default;

    //alert(calc.sum(5, 6));
  }

  function handleModalVisible() {
    setModalVisible(true);
  }

  return (
    <div>
      <h1>Cálculo</h1>
      <button onClick={handleModalVisible}>Somar</button>
      // Se o usuário nunca clicar no botão que muda 'modal Visible'
      // então nunca vai chamar e importar o componente 'Modal'
      {modalVisible && <Modal />}
    </div>
  );
}
````

Fazemos o lazyLoad usando `dynamic` do `next/dynamic`

````ts
const Modal = dynamic(
  // primeiro parâmetro é a importação
  () => import('../components/Modal').then(mod => mod.Modal),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  },
);
````

## SEO

````ts
// src/components/SEO.tsx
import Head from 'next/head';

// interface para definir quais porps dá pra passar na hora da chamada desse componente
// Alguns têm '?' para indicar que é opcional,  já na chamada, alguns vão receber um valor por default
interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  excludeTitleSuffix?: boolean;
  indexPage?: boolean;
}

// desestruturados para já pegar separado e por valores por default
export default function SEO({
  title,
  description,
  image,
  excludeTitleSuffix = false,
  indexPage = true,
}: SEOProps) {
  const pageTitle = `${title} ${!excludeTitleSuffix ? '| Dev News' : ''}`;

  const pageImage = image
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/${image}`
    : null;
  return (
    <Head>
      <title>{pageTitle}</title>

      {description && <meta name="description" content={description} />}
      {pageImage && <meta name="image" content={pageImage} />}
      {!indexPage && <meta name="robots" content="noindex,nofollow" />}

      <meta httpEquiv="x-ua-compatible" content="IE=edge,chrome=1" />
      <meta name="MobileOptimized" content="320" />
      <meta name="HandheldFriendly" content="True" />
      <meta name="theme-color" content="#302F38" />
      <meta name="msapplication-TileColor" content="#302F38" />
      <meta name="referrer" content="no-referrer-when-downgrade" />
      <meta name="google" content="notranslate" />

      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={pageTitle} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:image:secure_url" content={pageImage} />
      <meta property="og:image:alt" content="Thumbnail" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@ContactstSmart" />
      <meta name="twitter:creator" content="@ContactstSmart" />
      <meta name="twitter:image" content={pageImage} />
      <meta name="twitter:image:src" content={pageImage} />
      <meta name="twitter:image:alt" content="Thumbnail" />
      <meta name="twitter:image:width" content="1200" />
      <meta name="twitter:image:height" content="620" />
    </Head>
  );
}
````


Chamando ele

````ts

<SEO title="Posts" />
````

## PrismicCMS

### Como usar

É gratuito. Usei Logado com o @g e senha default.

1. Cria um "new type" onde podemos especificar como será a estrutura do nosso post, da tablea post,
2. Cria Repeatable Type de nome "Post"
3. Depois busque criar um documento, que servirá esse layout: terá 3 elmentos slug (o id - gerado automaticmanete a depender do titulo), titulo e RichText (Markdown).
4.  Depois que salvar você tem que fazer o publish para realmente disponibilizar ele
5. Em seguida acessa a parte de `Security & API  `: Busque pelo token e pelo end-point do seu projeto do prismic. Coloqueos na variável de ambiente que no fica tem o seguinte template

### Env da aplicação

```env
# arquivo original deve ser env.development
NEXT_PUBLIC_SITE_URL=
API_URL=
PRISMIC_ACCESS_TOKEN=
PRISMIC_ENDPOINT=

```

### Usando Prismic

Será alterado os arquivos de post ou seja `pages/posts/index.tsx` e `pages/pots/posts.modules.scss`

Para consumir os dados, vamos criar um serviço separado para fazer o get.
Vamos usar o cliente do prismic que é uma lib.

Vamos instalar primic-dom para auxiliar a trazer tudo com um formato melhor. Tudo que for rich-text será mantido.

Cliente do Prismic

````ts
// src/services/prismic.ts
import Prismic from '@prismicio/client';

export function getPrismicClient(req?: unknown) {
  const prismic = Prismic.client(process.env.PRISMIC_ENDPOINT, {
    req,
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
  });

  return prismic;
}
````

Usando Prismic

````tsx
import { GetStaticProps } from 'next';
import Link from 'next/link';
import SEO from '../../components/SEO';
import styles from './posts.module.scss';
// Chamando Prismic
import { getPrismicClient } from '../../services/prismic';
import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
}

interface PostsProps {
  posts: Post[];
}

export default function Posts({ posts }: PostsProps) {
  return (
    <>
      <SEO title="Posts" />

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map(post => (
            <Link href="#" key={post.slug}>
              <a>
                <time>{post.updatedAt}</time>
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  // Cliente Prismic já configurado para fazer a consultar a API
  const prismic = getPrismicClient();
  // Fetch da API
  const response = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    {
      fetch: ['post.title', 'post.content'],
    },
  );
  // Para cada dado da response
  const posts = response.results.map(post => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      excerpt:
        // Buscar o primeiro campo que seja do tipo 'paragraph' vai pegar o seu conteúdo e por aqui
        post.data.content.find(content => content.type === 'paragraph')?.text ??
        '',
      updatedAt: new Date(post.last_publication_date).toLocaleDateString(
        'pt-BR',
        {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        },
      ),
    };
  });

  return {
    props: {
      posts,
    },
    revalidate: 60 * 60 * 12, // 12 horas
  };
};

````

### Cada post individual

````ts
// src/pages/posts/[slugs].tsx
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import SEO from '../../components/SEO';
import styles from './post.module.scss';
// Primisc
import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';
import { getPrismicClient } from '../../services/prismic';

// Interface para cada dado do post
interface PostProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  };
}

/*
Usaremos a estratégia do fallback para buscar o post na hora em que for requisitado
*/
export default function Post({ post }: PostProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <SEO title="Post" />

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          {/* dangerouslySetInnerHTML: Indica que é MarkDown internamente nessa div */}
        </article>
      </main>
    </>
  );
}

// Gerencia a página em si, a sua url
// serão criadas via fallback, sob demanda
// A cada primeiro acesso a o respectivo post, vai gerar a página estática
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};

// Será gerado páginas estáticas
// essa páginas criados serão invalidadas depois de 12 horas
// e por isso serão criadas de novo
// Ela pode ficar inválida, mas só será recriada após um primeiro acesso depois de 12 horas
export const getStaticProps: GetStaticProps = async context => {

  const { slug } = context.params;

  const prismic = getPrismicClient();

  const response = await prismic.getByUID('post', String(slug), {});

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asText(response.data.content),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString(
      'pt-BR',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      },
    ),
  };

  return {
    props: {
      post,
    },
    revalidate: 60 * 60 * 12, // 12 horas
  };
};
````

## Testes usando Jest e Test Library

### Instalar libs

```sh
npm i -D jest jest-dom ts-jest @testing-library/jest-dom @testing-library/dom @testing-library/react babel-jest identity-obj-proxy
```

+ jest :jest em si
+ jest-dom: manipular elementos da dom
+ ts-jest: jest reconhceça typeScript
+ @testing-library: tem que integrar com jset/dom/react
+ babel-jest: para que jest leia typescript
+ identity-obj-porps:? reconhecer SASS

Na raiz do projeto crie o arquivo

`jest.config.js`
````js
module.exports = {

  // não olhar o que tem aqui dentro
  testPathIgnorePatterns: ["/node_modules/", "/.next/"],
  // setup inicial que o jest vai executar
  setupFilesAfterEnv: ["<rootDir>/src/tests/setupTests.ts"],
  // o que o babel-jest tem que compilar para o jest interpretar javascript direito
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest"
  },
  // evitar um bug
  testEnvironment: "jsdom",
  // interpretar o sass
  moduleNameMapper: {
    "\\.(scss|css|sass)$": "identity-obj-proxy"
  }
};
````

`babel.config.js`
````js
module.exports = {
  presets: ['next/babel']
}
````

Altero=ar o `package.json` para pôr `"test": "jest"`

### Criando os testes

Em cada pasta do componente, vai criar o arquivo de texto

Para os componente, vamos testar cada um indevidamente na própria pasta component colocando como `ActiveLink.spec.tsx`

Exemplo

````tsx
import { render } from '@testing-library/react';
import { ActiveLink } from '.';

// Quando chamar essa lib, vai retornar por default esse objeto (para não precisar chamar a lib)
jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        asPath: '/',
      };
    },
  };
});

describe('ActiveLink component', () => {
  // Verifica se o link  Renderizado tem o 'home'
  it('renders correctly', () => {
    const { getByText } = render(
      <ActiveLink href="/" activeClassName="active">
        <a>Home</a>
      </ActiveLink>,
    );

    expect(getByText('Home')).toBeInTheDocument();
  });

  // Verifica se o Activelink de Home com a classe ativa está mesmo ativada, ou seja, se tem a classe active
  it('adds active class if the link as currently active', () => {
    const { getByText } = render(
      <ActiveLink href="/" activeClassName="active">
        <a>Home</a>
      </ActiveLink>,
    );
    // Verifica se
    expect(getByText('Home')).toHaveClass('active');
  });
});

````

### Coverage Report

Recursos do Jest para termos noção se nosso sest se estão cobrindo tudo que é necessário

para usá lo, colocamos mais props no jest.config.js

````js
},
  collectCoverage: true,
  // EM SUMA: Vai fazer um coverage dos arquivo `.tsx` que são os arquivos que tem os componente que importam
  collectCoverageFrom: [
    "src/**/*.tsx",
    "!src/**/*.spec.tsx", // arquivo de teste não preciso, ÓBVIO
    "!src/**/_app.tsx", // não é um componente real a ser testado
    "!src/**/_document.tsx"
  ],
  coverageReporters: ["lcov", "json"]
````

npm run test --coverage

Vai criar uma pasta coverage com um `index.html  que vai ter o relatório



## Principais opções para Deploy

A gente precisa do node.js para fazer SSR e SSG,  por isso não é em qualquer lugar que dá pra por nosso projeto Next.

Opções no mercado:

+ Existe o AWS Amplify
+ Usaremos na Vercel

## Usando Vercel para Deploy

Tenha um Repositório criado, é de lá que o Vercel Vai pegar

Lembre-se de configurar as variáveis de ambiente

Na variável de ambiente `NEXT_PUBLIC_URL_SITE` Troque de localHost para a URL criada pelo Vercel


## Modificações finais

1. Instalar a lib `date-fns` para lidar melhor com dada
2. No slug, usar RichText.asHtml para ler MarkDown ao invez de Text comun

## Finalizando projeto
Ao rodar a aplicaçâo fiz as seguinte modificações para não apresentar nenum erro nem mensagem de eror em lugar nenhum

1. Por arquivo setupTests.ts em src/tests
2. Onde chama `mocked` usar a lib `jest-mock` pois a lib original `jest` não tem mais esse método
3. eslin ignorar arquivos `*.js` pois reclama de `module`
4. Todos os arquivos de estilo são `nome_do_componente.module.scss`


