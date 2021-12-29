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
    fallback: false,
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
