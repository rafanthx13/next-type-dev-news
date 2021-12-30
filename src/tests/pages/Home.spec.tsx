import { render } from '@testing-library/react';
import Home from '../../pages';

describe('Home page', () => {
  it('renders correctly', () => {
    // Renderizo esse componeten
    // Pego dele 3 props para buscar nesse componete
    const { getByText, getByAltText, debug } = render(<Home />);
    /// essedebug permiti agente ver esse compoineten, o seu html no cosnolena hora do TEST doo JEST no CLI
    debug();
    // verifica se la tem tudo que eu estabeleci
    expect(getByText('Olá Dev!')).toBeInTheDocument();
    expect(getByAltText('Home image')).toBeInTheDocument();
  });
});
