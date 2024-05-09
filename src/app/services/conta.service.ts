import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ContaService {
  private contas: Conta[] = [];

  constructor(
    private toastController: ToastController,
    private router: Router
  ) {
    // Carregar contas do armazenamento local quando o serviço é inicializado
    this.carregarContas();
  }

  async cadastrar(cpf: string, senha: string) {
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
    const novaConta: Conta = { cpf, senha };
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
  cpf: string;
  senha: string;
}
