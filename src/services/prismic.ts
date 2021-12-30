import Prismic from '@prismicio/client';

// prsimic nao tem uma tipagem definar, por isso o 'unknown'
export function getPrismicClient(req?: unknown) {
  const prismic = Prismic.client(process.env.PRISMIC_ENDPOINT, {
    req,
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
  });

  return prismic;
}
