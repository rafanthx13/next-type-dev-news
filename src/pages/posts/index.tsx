// src/pages/pots/index.tsx : Tem uma lista de micro-posts,
// para depois ecolhermos qual pos vamos le
import { GetStaticProps } from 'next';
import Link from 'next/link';
import SEO from '../../components/SEO';
import styles from './posts.module.scss';
// Chamando Prismic
import { getPrismicClient } from '../../services/prismic';
import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';

// final mods
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
            <Link href={`/posts/${post.slug}`} key={post.slug}>
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
      // Usamos do primix-dom para renderizar mlehor, da mesma forma que foi inserido no primix, pois senao vem como texto puro
      title: RichText.asText(post.data.title),
      // Bucar o primeiro campo que seja do tipo 'paragpath' vai pegar o seu conteudo e por aqui
      excerpt:
        post.data.content.find(content => content.type === 'paragraph')?.text ??
        '',
      updatedAt: format(
        new Date(post.last_publication_date),
        "d 'de' MMMM 'de' yyyy",
        { locale: ptBR },
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
