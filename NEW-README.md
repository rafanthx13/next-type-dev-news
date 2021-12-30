# New Readme

# confiig vscode

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

## Particularidade do Next

+ Toda `page` deve ser exportada como defaul `expost default NameComponent` mas os componentes nâo precisam disso

## funcionamento das paginas do next

cada arquivo na pagina
``pages`` é uma nova rota

eu posso gerir essa pasta `pages`


posso por pagess dentro de ``src``  criar uma pasta chamada `posts` e por o index.tsx como sedno a raiz dessa rota `post`

### Dinamyc routes : pagina generica para posts

euquero criar uma pagnia como se fosse um template para toda sub-rota.

**O ARQUIVO DEVE SER ESCRITO COM COLHETES**

`[id].tsx`

````tsx
// [id].tsx
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

## Estrilizaçâo no Next com SASS
O nome oficial é SASS: Syntactically Awesome Style Sheets

Difernça entre SASS E SCSS: É apenas sintax, arquivos .sass usam identaçao, enquanto que arquivos scss usam ainda chaves.
+ https://tipscode.com.br/qual-a-diferencas-entre-sass-e-scss
+ Basicamente SASS é como se fosse o YNK=L ebqaubtoi que SCSS o CSS padrao
+ https://tableless.com.br/sass-vs-less-vs-stylus-batalha-dos-pre-processadores/

os arqvuiso na pasta `styles` terminam em `.modeule.css`

Stylizes-componetn é apenas uma forma de estilizar no css no react

OBS: Nessa estilizaçâo de módulos, sóp pomdeos estilziar classe, nao podemos estilizar diretamente tags HTML.

Utilziaremos essa forma + SASS. Assim teremos

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
## SASS

## Vantagens do Sass

+ Pemrite usar math, fazer contaas dentro do css
+ + Tme hernaça e mixins de css
+ + pemrite criar variaveis de uam malhor forma que o css default
+ Com partials (arquivo com '_') podemos importar coisa comunas a outross css sem precisar gera um novo css

basta lacessar o link: https://sass-lang.com/guide

### Uso do sass

É um css incrementado.

permite por classes css dentro de outras. assim ao invez de fazer

````
title {

}

titles span {

}
````

pdoems fazer


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

O caracter & indica o proprio elemento, assim no codigo abaixo

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

& + a = tag a seguida da tag a
&:hover = a:hover
&a.actve = a com a classe active

## Entendo arquivos _app e _document

`_app.tsx` é o arquvio principal , o primeiro do next. Nela podemos configurar algo apra que seja disponibilizadao em toda as páginas da nossa aplicação.

`pages/_document.tsx`: permite customizar o HTML das páginas. Em suma: **EQUUIVALE AO INDEX.HTML DO REACT/VUE**

````tsx
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
````

## Componente Header

Será o Header
 dque será aplicado em todas as nossa paginas

## Client Side Rendereing

**Fake API**
Json-server : Vamo ceriar uma Fake API apra trabalharmos por enquanto

npx json-server api.json -p 333 -w

**ClienteSideRendering**

Para faermos CSR, usamos ``useEffect`` para buscar os dados da API e asim montarmos o nosso post

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

Asism, o Next vai está lendo o conteudo d euma api e asim gerando a pagina pelo CSR.

Essa nâo é a forma que quersomos


Aqui, o cliente esta fazendo a requisçao do conteudo
. Queremos é que essa busca da API nao seja feita pelo cliente, por isos ieremos ver Server Side Rendering.

o BROWSER ESTÁ CONSTRUINDO O HTML.

Problema dessa abordagem: se a chamada da api demorar, a pagina vai ficar meia pronta até cheagr o fetch da api

## Server Side Rendering  (SSR)

Quermos que seja SSR: queremos que um mini servidor node, dsiponibilizado pelo next, gere todo o html, asism , o browser do cliente nao precisa fazer essa busca da api explicitamente.

Dessa forma, o browser já recebe aa pagina pronta, o que torna assim mais rápida.

**Como fazer SSR**

Implementamos o metodo ``getServerSideProps``


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


// descnostruo posts
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

Como esse método funnciona: Quando ess método é implmenetado, o
NEXT EXECUTA ELE PRIMEIRO. É por isso que não tme nehuma chamaada a aele

**``getServerSideProps`` é chamado antes do compoente ser renderizadoe e vai enviar para o nosos componente**

Dessa forma,  listagem da api será motntada no node e estao enviadoa ao browser..

Assim,**ISSO OTIMIZA ÁPAR SEO** POque o conteudo nâo é mais gerado estatico como uma SPA/CSR, agora por ser SSR, os motores de busca ao acessar esse link vao encontrar já rptoonto todo o HTMl DA PAGINA, COM O FETCH E TUDO OMAISW

## 3 forma - static site generation -SSG

Nese modo, o html é todo gerado  no build.

No nosos caso, será ideal para o nosso proejto, pois um post depois de criado nâo é mais mudado, entao com isso, ao fazer o build vai gera já po html do post.

Para fazer SSG implementamos o método `getStaticProps`


O index.tswx vai ficar da seguinte forma

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
pm run build` .Durante o buidl já msotra que OS POSTS SERÃO DO TIPO ssg.

pRA RODAR A BUILD, FAZEMOS O BUILD E EM SEGUIDA ``NEXT START``. cADA POS SERÁ UM documento htmlk gerado automaticamnete.

Como o SSR, por já ter um html fisico ou seja, nao é uma interpretaçao de javascript como o react puro é otimizado ao SEO.

Inserimos o parametro

`revalidate: 5` permiteq que a cada 5 segudnos seja recriado essa pagina estatica, mesmo depois do build

## Incrmental Static Re-Generation

A nossa pagina será estatica, mas havera uma parte de comentarios qque deverá ser atualizada

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
// Como gerar uma página estática de um par}ametro que é dinâmico?
// getStaticPaatjs: Agente cria uma página estátia para CADA POSSIBILIDADE
// ASSIM, SE MEU BLOG TEM 10 POSTS, VAI pergorrer e gerar as 10 paginas estaticas para cada post
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
``fallback: true``. Assim, ao invez de gerar um arquivo a cada novo past, vai gerar so quando o posrt for requisitado.

Isos é necessário para corrigir o seguinte problema: `Caso tiver 100paginas, o nosso projeto nao pode gerr 100html de uma vez só`

**com fallbaxk=true, naovai dar eror ao criar novos posts



## API ROUTES


é O node que o Next tras que permite SSR. OU SEJA UM NMINI-BACK-END QUE PODER SE USADO BONO BROWSER.

É todo arquivo criado na apsta
`api`, aí vira um end-point da API. São rotas/end-pont da API.

Funciona como serveless, assim, NÂO É RECOMENDADOQUE O USE COMO UM BACK-END, mas permite que agente faça pequenas coisas.

````tsx
// src/api/routes
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

Podemos acessar com /aoi/course. No vs-code tem o thudneerClinet:
hyyp://localhost:3000/api/course (get)

## Pageina de nao encontrao

deve estar em `pagse` ser o arquivo `404.tsx`

````
export default function NotFound() {
  return (
    <div>
      <h1>Page not found</h1>
    </div>
  );
}
````
## Dynamic Import


É a importaçâo de componetns/lib por demanda: se eu nunca acessar aquele recurso,nao acessa ela, se nao, aquilo naunca será carregado

Ele apenas vai demosntrear, mas nao vamos usar na reladie.

Esse aprendizado é imporatente para lidar com bibliotecas grandes como moment e lodash.

Exemplo


````ts
// exemplo d euma lib que sera importada
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
      <h1>Calculo</h1>
      <button onClick={handleSum}>Somar</button>
    </div>
  );
}
````

Para fazer DynamicImport devemos atribuir como asynrono na hora de usar a lib.

````ts
async function handleSum() {
    const calc = (await import('../libs/calc')).default;

    alert(calc.sum(5, 6));
  }
````

## Lazy Components

Podemos fazer tambem o carregamentos de compontes
**POR DEMANDA**

Esser será mais outro exemplo do poder do Next.

````ts
// src/libs/calc.ts (exemplo de comoneten que sera carregado de modo LazyLoad)
export function Modal() {
  return <h1>Janela Modal carregada por demanda</h1>;
}
````

````ts
// src/pages/calculo.tsx (exemplo de pagina que vai chamar um compoente por LazyLoad)
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
      <h1>Calculo</h1>
      <button onClick={handleModalVisible}>Somar</button>
      // Se o usaruio nunca clicar no botao que muda 'modalVisible'
      // entao nunca vai chamar e importar o componente 'Modal'
      {modalVisible && <Modal />}
    </div>
  );
}
````

Fazemos o lazyLoad usando `dynamic` do `next/dynamic`

````ts
const Modal = dynamic(
  // primeir parametro é a importaçao
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

// interface para defeinir quais porps dá pra passar na hora da chamada desse componente
// Alguns tem '?' para inidicar que é opcional,  já na chamda, alguns vão receber um valor por default
interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  excludeTitleSuffix?: boolean;
  indexPage?: boolean;
}

// desestruturaamos para já pegar separadao e por valores por defaultt
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


Chamadno ele

````ts

<SEO title="Posts" />
````

## PrimiC CMS

Logado com o @g e senha default

criao um "new type" onde podemos especifiar como será a estrutura do nosso post, da tablea post,


+ cria Repatiable Type de nome "Post"


Depopis busque cria um documento, que serquirar esse layout.  Depois queslava voce tem que pubilhs para realmente disponibilizar ele

api securituy

nome dela: next-project-dev-news

=> MC5ZY3pmb3hFQUFDTUFFd0Ry.Y--_ve-_ve-_ve-_vWnvv73vv70oVe-_vWHvv73vv73vv73vv71HYO-_vQpRHBTvv73vv73vv71gXhwB77-9Tg

## Usano Prismic

Muaresmo os arquivos de post ou sej `pages/posts/index.tsx` e `pages/pots/posts.modules.scss`

Para consumir os dados, vamo criar um serviço separado para fazer o get.
Vamos usar o client do primsic que é uma lib.

amos instalar primic-dom para axuliar a trazer tudo com um formato melhor. Tudo que for riacht-text ssera mantido.

Cliente do Primsic

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

Usano Prismic

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
  // Cliente Primic ja configuraado para fazer a constular a API
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
        // Bucar o primeiro campo que seja do tipo 'paragpath' vai pegar o seu conteudo e por aqui
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


## Cada post individual

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
Usaremos a estrategia do fallback para buscar o post na hora em que for requisitado
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
// serao criadas via fallback, sob demanda
// A cada primeiro acesso a o respectivo psote, vai gerar a página estática
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};

// Será gerado páginas estáticas
// essa páginas criadso serão invalidadas depois de 12 horas
// e porisos serao criadsa denvoo
// Ela pode ficar invalida, ams só será recriada apos um primeiro acesso depois de 12 horas
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

npm i -D jest jest-dom ts-jest @testing-library/jest-dom @testing-library/dom @testing-library/react babel-jest identity-obj-proxy

jest :jest em si
jest-dom: manipular elementos da dom
ts-jest: jest reconhceça typeScript
@testing-library: tem que integrar com jset/dom/react
babel-jest: para que jest leia typescript
identity-obj-porps:? reconhecer SASS

Na raiz do projeto cire o aqruivo

jest.config.js
````js
module.exports = {

  // nao olhar o que tem aki dentro
  testPathIgnorePatterns: ["/node_modules/", "/.next/"],
  // setup inicial que o jest vai executar
  setupFilesAfterEnv: ["<rootDir>/src/tests/setupTests.ts"],
  // o que o babel-jest tem que compilar para o jest interpretar javascrip direito
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest"
  },
  // eveitar um bug
  testEnvironment: "jsdom",
  // interpretar o sass
  moduleNameMapper: {
    "\\.(scss|css|sass)$": "identity-obj-proxy"
  }
};
````

babel.config.js
````js
module.exports = {
  presets: ['next/babel']
}
````

altero o package.json par apor `"test": "jest"`

## Craiando os testes

Em cada pasta do compoente, vai criar o arquivo de text

Para os compoennte, vamos testar cad aum inidivuamente na propria pasta componet colocando como `ActiveLink.spect.tsx`

Exemplo

````tsx
import { render } from '@testing-library/react';
import { ActiveLink } from '.';

// Quando chamar essa lib, vai retornar por default esse objeto (para nao precisar chamar a lib)
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
  // Verficai se o link  Renderizado tem o 'home'
  it('renders correctly', () => {
    const { getByText } = render(
      <ActiveLink href="/" activeClassName="active">
        <a>Home</a>
      </ActiveLink>,
    );

    expect(getByText('Home')).toBeInTheDocument();
  });

  // Verifica se o Activelink de Home com a classe ativda está mesmo ativada, ou seja, se tem a classe active
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

Recuros do Jest parta termos noçao se nosso sestse estao ccubrindo tuo que é necessa´rio

para usalo, comolocmaos mais props no jest.config.js

````js
},
  collectCoverage: true,
  // EM SUNMA: Vai fazer um coverata nosarquivos .tsx que sao os arquivos que tem os componetne que importam
  collectCoverageFrom: [
    "src/**/*.tsx",
    "!src/**/*.spec.tsx", // arquivo de testse nao preciso, OBVIO
    "!src/**/_app.tsx", // nao é um compoenten real a ser testado
    "!src/**/_document.tsx"
  ],
  coverageReporters: ["lcov", "json"]
````

npm run test --coverage

Vai criar uma pasta coverage com um `index.html  que vai ter o relatório



## Principais opções para deploy

Agente precisa do node.js para fazer SSR e SSG,  ppor isos nao é em qualqur lugar que dá pra por nosso projeto Next.

Existe o AWS Amplify

Usaremos na Vercel

Tenha um Repositorio criado, é de lá que o Vercel Vai pegar

Lmebre-se de configurar as varaivels de ambiente

Na variavel de ambiente `NEXT_PUBLIC_URL_SITE` Troque de local Host para a URL criada pelo Vercel


## MModificaçoes finais

1. Instlaar a lib `date-fns` par alidar melhor com dada
2. No slug, usar RichText.asHtml para ler MarkDwons
