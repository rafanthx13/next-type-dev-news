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
