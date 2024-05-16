import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class ContaService {
  contas: Conta[] = [];
  selectedImage: File | null = null;
  contaLogada: string = '';
  
  constructor(
    private toastController: ToastController,
    private router: Router
  ) {
    // Carregar contas do armazenamento local quando o serviço é inicializado
    this.carregarContas();
    this.carregarContaLogada();
  }

  private async carregarContaLogada() {
    // Carregar o nome da conta logada do localStorage
    const nomeContaLogada = localStorage.getItem('contaLogada');
    if (nomeContaLogada) {
      this.contaLogada = nomeContaLogada;
    }
  }

  alterarAvatar(image: File) {
    this.setSelectedImage(image);
  }
  

  setSelectedImage(image: File) {
    this.selectedImage = image;
  }

  getSelectedImage(): File | null {
    return this.selectedImage;
  }

  async alterarNomeConta(novoNome: string) {
    // Implemente a lógica para alterar o nome da conta aqui
    // Você pode atualizar o nome da conta atualmente logada ou criar uma função que altera o nome da conta em particular
    // Vou fornecer um exemplo básico:
    if (this.contaLogada !== '') { // Verifica se há uma conta logada
      const conta = this.contas.find(conta => conta.nome === this.contaLogada);
      if (conta) {
        conta.nome = novoNome;
        this.salvarContas(); // Salva as alterações no armazenamento local
        this.mostrarToast('Nome da conta alterado com sucesso!');
      } else {
        this.mostrarToast('Erro: Conta não encontrada.');
      }
    } else {
      this.mostrarToast('Erro: Nenhuma conta logada.');
    }
  }

  async alterarCPF(novoCPF: string) {
    // Verifica se o novoCPF contém apenas números
    if (!/^\d+$/.test(novoCPF)) {
      this.mostrarToast('Erro: O CPF deve conter apenas números.');
      return;
    }
  
    if (this.contaLogada !== '') { // Verifica se há uma conta logada
      const conta = this.contas.find(conta => conta.nome === this.contaLogada);
      if (conta) {
        conta.cpf = novoCPF;
        this.salvarContas(); // Salva as alterações no armazenamento local
        this.mostrarToast('CPF da conta alterado com sucesso!');
      } else {
        this.mostrarToast('Erro: Conta não encontrada.');
      }
    } else {
      this.mostrarToast('Erro: Nenhuma conta logada.');
    }
  }
  

  async alterarSenha(senhaAtual: string, novaSenha: string) {
    if (this.contaLogada !== '') { // Verifica se há uma conta logada
      const conta = this.contas.find(conta => conta.nome === this.contaLogada);
      if (conta) {
        // Verifica se a senha atual fornecida coincide com a senha da conta
        if (conta.senha === senhaAtual) {
          // Altera a senha para a nova senha fornecida
          conta.senha = novaSenha;
          this.salvarContas(); // Salva as alterações no armazenamento local
          this.mostrarToast('Senha da conta alterada com sucesso!');
        } else {
          this.mostrarToast('Erro: Senha atual incorreta.');
        }
      } else {
        this.mostrarToast('Erro: Conta não encontrada.');
      }
    } else {
      this.mostrarToast('Erro: Nenhuma conta logada.');
    }
  }

  async cadastrar(nome: string, cpf: string, senha: string) {
    // Verificar se a conta já existe
    if (this.contas.find(conta => conta.cpf === cpf)) {
      const toast = await this.toastController.create({
        message: 'Este CPF já está cadastrado.',
        duration: 2000
      });
      toast.present();
      return;
    }

    // Adicionar a nova conta ao array
    const novaConta: Conta = { nome, cpf, senha };
    this.contas.push(novaConta);

    // Salvar as contas no armazenamento local
    this.salvarContas();

    const toast = await this.toastController.create({
      message: 'Cadastro realizado com sucesso!',
      duration: 2000
    });
    toast.present();

    console.log('Conta cadastrada com sucesso:', novaConta);
  }

  async login(cpf: string, senha: string) {
    console.log('CPF e Senha recebidos:', cpf, senha);
    console.log('Contas registradas:', this.contas);

    const contaEncontrada = this.contas.find(conta => conta.cpf === cpf && conta.senha === senha);

    if (contaEncontrada) {
      this.contaLogada = contaEncontrada.nome; // Define o nome da conta logada
      localStorage.setItem('contaLogada', this.contaLogada); // Salva o nome da conta logada no localStorage
      this.router.navigateByUrl('/tabs/tab2');
      return true;
    } else {
      this.mostrarToast('Credenciais inválidas. Por favor, tente novamente.');
      return false;
    }
  }

  private async salvarContas() {
    // Salvar contas no armazenamento local
    localStorage.setItem('contas', JSON.stringify(this.contas));
  }

  private async carregarContas() {
    // Carregar contas do armazenamento local
    const contasString = localStorage.getItem('contas'); 
    if (contasString) {
      try {
        this.contas = JSON.parse(contasString);
      } catch (error) {
        console.error('Erro ao carregar contas:', error);
        // Se houver algum erro ao analisar os dados salvos, inicialize as contas com um array vazio
        this.contas = [];
      }
    } else {
      // Se não houver dados salvos, inicialize as contas com um array vazio
      this.contas = [];
    }
  }
  
  async mostrarToast(mensagem: string) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}

interface Conta {
  nome: string;
  cpf: string;
  senha: string;
}
