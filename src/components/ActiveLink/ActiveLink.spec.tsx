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
