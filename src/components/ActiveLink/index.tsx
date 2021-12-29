/* Craimos um compnoeten para que possamos indicar que a pagina está ativa
 assim, se estiver na parte de posts, a aba de
 'Post' no Header estará estilziada de forma diferente, indicando que estamos nessa aba
 => Sem criar esse ctiveLink seprados, termiso que por no Header vários if
   omo o a seguir: asPath === otherProps.href ? activeClassName : '';
 */

// LinkProps posi teremos que acessar mais internamente o Link, e nao apaenas usalo
// LinksProps define todas as propriedade que Link tem
import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';
import { ReactElement, cloneElement } from 'react';

// extende, ou seja, tem esse + o original de LinkProps
interface ActiveLinkProps extends LinkProps {
  children: ReactElement;
  activeClassName: string;
}

export function ActiveLink({
  children,
  activeClassName,
  ...otherProps // spread para pegar todas as otros props de link
}: ActiveLinkProps) {
  const { asPath } = useRouter();

  const className = asPath === otherProps.href ? activeClassName : '';

  return (
    <Link {...otherProps}>
      {/* cloneElment: Agente clona um elmento e ao mesmo tempo manipulalo: vmvamos colocar chidlren passando o className */}
      {cloneElement(children, {
        className,
      })}
    </Link>
  );
}
