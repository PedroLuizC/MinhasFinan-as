import { TestBed } from '@angular/core/testing';
import { ContaService } from './conta.service';

describe('ContaService (Integração)', () => {
  let service: ContaService;

  beforeAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000; // Definindo o limite para 10 segundos
  });
  

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContaService]
    });
    service = TestBed.inject(ContaService);
  });

  it('should register a new account and login successfully', async () => {
    // Registra uma nova conta
    const nome = 'Test User';
    const cpf = '12345678900';
    const senha = 'testpassword';

    await service.cadastrar(nome, cpf, senha);

    // Tenta fazer login com as credenciais recém-cadastradas
    const loggedIn = await service.login(cpf, senha);

    // Verifica se o login foi bem-sucedido
    expect(loggedIn).toBeTruthy();
    expect(service.contaLogada).toEqual(nome);
  });
});
