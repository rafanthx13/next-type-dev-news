import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import SEO from '../../components/SEO';
import styles from './post.module.scss';
// Primisc
import { RichText } from 'prismic-dom';
import { getPrismicClient } from '../../services/prismic';
// mods finais
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
    content: RichText.asHtml(response.data.content),
    updatedAt: format(
      new Date(response.last_publication_date),
      "d 'de' MMMM 'de' yyyy",
      { locale: ptBR },
    ),
  };

  return {
    props: {
      post,
    },
    revalidate: 60 * 60 * 12, // 12 horas
  };
};
