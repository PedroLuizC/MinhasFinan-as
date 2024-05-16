import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ContaService } from '../../app/services/conta.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})

export class Tab2Page implements OnInit {
 
  saldo: number = 0;
  avatars: Avatar[] = [];
  despesasFixas: Despesa[] = [];
  gastosGerais: Despesa[] = [];
  extrato: Despesa[] = [];
  totalExtrato: number = 0;
  mostrarModal: boolean = false;
  salarioDia: number = 1;
  dinheiroGuardado: number = 0;
  selectedImage: File | null = null;
  nomeDaConta: string = '';
  
 

  constructor(private alertController: AlertController, public contaService: ContaService) {}


  ngOnInit() {
    this.nomeDaConta = this.contaService.contaLogada;
    this.selectedImage = this.contaService.getSelectedImage();
    this.calcularTotalExtrato();
    this.loadAvatars();
  }

  getObjectURL(file: File): string {
    return URL.createObjectURL(file);
  }


  getSituacao(): string {
    const diferenca = this.saldo - this.calcularTotalExtrato();

    if (diferenca >= this.saldo * 0.5) {
      return 'tranquilo';
    } else if (diferenca === 0) {
      return 'cuidado';
    } else {
      return 'grave';
    }
  }

  getSituacaoClass(): string {
    const situacao = this.getSituacao();
    if (situacao === 'tranquilo') {
      return 'verde';
    } else if (situacao === 'cuidado') {
      return 'amarelo';
    } else {
      return 'vermelho';
    }
  }


  loadAvatars() {
    const avatarNames = ['Depositar', 'Pagar', 'Pedir extrato', 'Salário', 'Guardar'];
    const avatarUrls = [
      '../../assets/avatar/cash-outline.svg',
      '../../assets/avatar/barcode-outline.svg',
      '../../assets/avatar/document-text-outline.svg',
      '../../assets/avatar/wallet-outline.svg',
      '../../assets/avatar/lock-closed-outline.svg'
    ];

    avatarUrls.forEach((url, index) => {
      this.avatars.push({ nome: avatarNames[index], imgUrl: url });
    });
  }

  avatarClick(avatar: Avatar) {
    switch (avatar.nome) {
      case 'Depositar':
        this.depositar();
        break;
      case 'Pagar':
      this.calcularTotalDespesas();
      break;
      case 'Pedir extrato':
      this.mostrarExtrato();
      break;
      case 'Transferir':
      this.transferir();
      break;
      case 'Salário':
      this.receberSalario(); 
      break;
      case 'Guardar':
      this.guardarDinheiro(); 
      break;
      default:
        // Lógica para os outros avatares
        console.log(`Clicado no avatar: ${avatar.nome}`);
        break;
    }
  }

  

  mostrarExtrato() {
    
    this.mostrarModal = true;
  }

  fecharExtrato() {
    this.mostrarModal = false;
  }

  // Adicione esta função à sua classe Tab2Page
  async transferir() {
  const alert = await this.alertController.create({
    header: 'Transferir',
    message: 'Em breve...',
    buttons: ['OK']
  });

  await alert.present();
 }


  async depositar() {
    const alert = await this.alertController.create({
      header: 'Depositar',
      inputs: [
        {
          name: 'valor',
          type: 'number',
          placeholder: 'Valor',
          min: '0', // Define o valor mínimo como 0
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Depósito cancelado');
          }
        },
        {
          text: 'Depositar',
          handler: (data) => {
            const valor = parseFloat(data.valor);
            if (isNaN(valor) || valor <= 0 || valor < this.saldo) {
              this.exibirAlerta('O valor do depósito deve ser um número positivo maior que zero e menor que o saldo atual.');
              return false; // Retorna falso para manter o alerta aberto
            } else {
              this.saldo += valor;
              console.log('Depósito realizado:', valor);
              return true; // Retorna true para fechar o alerta
            }
          }
        }
      ]
    });
  
    await alert.present();
  }

  calcularTotalExtrato(): number {
    let totalExtrato = 0;
    this.despesasFixas.forEach(despesa => totalExtrato += Number(despesa.valor));
    this.gastosGerais.forEach(gasto => totalExtrato += Number(gasto.valor));
    return totalExtrato;
  }
  
  async calcularTotalDespesas() {
    let totalDespesas = 0;
    this.despesasFixas.forEach(despesa => totalDespesas += Number(despesa.valor));
    this.gastosGerais.forEach(gasto => totalDespesas += Number(gasto.valor));
  
    if (totalDespesas > 0) {
      const alert = await this.alertController.create({
        header: 'Pagar Fatura',
        message: `Deseja pagar sua fatura no total de R$ ${totalDespesas.toFixed(2)}?`,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Pagamento cancelado');
            }
          },
          {
            text: 'Confirmar',
            handler: () => {
              this.realizarPagamento(totalDespesas);
            }
          }
        ]
      });
    
      await alert.present();
    } else {
      this.exibirAlerta('Não há despesas para pagar.');
    }
  }
  
  async receberSalario() {
    const alert = await this.alertController.create({
      header: 'Receber Salário',
      inputs: [
        {
          name: 'valor',
          type: 'number',
          placeholder: 'Informe o valor do salário'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Confirmar',
          handler: async (data) => {
            const salario = parseFloat(data.valor);
            if (isNaN(salario) || salario <= 0) {
              this.exibirAlerta('Por favor, insira um valor válido para o salário.');
            } else {
              const hoje = new Date();
              if (hoje.getDate() === 1) {
                this.saldo += salario;
                await this.exibirAlerta('Seu salário caiu na conta.');
              } else {
                await this.exibirAlerta('Salário cadastrado com sucesso. O pagamento será efetuado no primeiro dia do mês.');
              }
            }
          }
        }
      ]
    });
  
    await alert.present();
  }

  async guardarDinheiro() {
    if (this.dinheiroGuardado === 0) {
      const alertSemDinheiro = await this.alertController.create({
        header: 'Guardar Dinheiro',
        inputs: [
          {
            name: 'valor',
            type: 'number',
            placeholder: 'Informe o valor a ser guardado'
          }
        ],
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary'
          },
          {
            text: 'Confirmar',
            handler: async (data) => {
              const valorGuardado = parseFloat(data.valor);
              if (isNaN(valorGuardado) || valorGuardado <= 0) {
                this.exibirAlerta('Por favor, insira um valor válido para ser guardado.');
              } else if (valorGuardado > this.saldo) {
                this.exibirAlerta('Saldo insuficiente para guardar este valor.');
              } else {
                this.dinheiroGuardado += valorGuardado;
                this.saldo -= valorGuardado;
                await this.exibirAlerta(`Você guardou R$ ${valorGuardado.toFixed(2)}.`);
              }
            }
          }
        ]
      });
  
      await alertSemDinheiro.present();
    } else {
      const alertComDinheiro = await this.alertController.create({
        header: 'Dinheiro Guardado',
        message: `Dinheiro armazenado: R$ ${this.dinheiroGuardado.toFixed(2)}, deseja retirar ou armazenar mais?`,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary'
          },
          {
            text: 'Retirar',
            handler: async () => {
              await this.retirarDinheiro();
            }
          },
          {
            text: 'Armazenar Mais',
            handler: async () => {
              await this.armazenarMaisDinheiro();
            }
          }
        ]
      });
  
      await alertComDinheiro.present();
    }
  }
  
  async retirarDinheiro() {
    this.saldo += this.dinheiroGuardado;
    await this.exibirAlerta(`R$ ${this.dinheiroGuardado.toFixed(2)} retirado do dinheiro guardado.`);
    this.dinheiroGuardado = 0;
  }
  
  async armazenarMaisDinheiro() {
    const alert = await this.alertController.create({
      header: 'Guardar Mais Dinheiro',
      inputs: [
        {
          name: 'valor',
          type: 'number',
          placeholder: 'Informe o valor a ser guardado'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Confirmar',
          handler: async (data) => {
            const valorGuardado = parseFloat(data.valor);
            if (isNaN(valorGuardado) || valorGuardado <= 0) {
              this.exibirAlerta('Por favor, insira um valor válido para ser guardado.');
            } else if (valorGuardado > this.saldo) {
              this.exibirAlerta('Saldo insuficiente para guardar este valor.');
            } else {
              this.dinheiroGuardado += valorGuardado;
              this.saldo -= valorGuardado;
              await this.exibirAlerta(`Você guardou mais R$ ${valorGuardado.toFixed(2)}.`);
            }
          }
        }
      ]
    });
  
    await alert.present();
  }
  
  realizarPagamento(valor: number) {
    let despesasPagas = false; // Variável para verificar se há despesas pagas
    
    // Verificar se há despesas fixas pagas
    this.despesasFixas.forEach(despesa => {
      if (despesa.pago) {
        despesasPagas = true;
        return; // Sai do loop assim que encontrar uma despesa paga
      }
    });
    
    // Verificar se há gastos gerais pagos
    this.gastosGerais.forEach(gasto => {
      if (gasto.pago) {
        despesasPagas = true;
        return; // Sai do loop assim que encontrar um gasto pago
      }
    });
  
    // Se houver despesas pagas, exibir um alerta e sair da função
    if (despesasPagas) {
      this.exibirAlerta('Você já pagou todas as contas.');
      return;
    }
  
    // Se não houver despesas pagas, continuar com o pagamento
    if (valor <= this.saldo) {
      this.saldo -= valor;
      console.log('Pagamento realizado');
      this.exibirAlerta('Pagamento realizado com sucesso!');
      
      // Marcar as despesas como pagas
      this.despesasFixas.forEach(despesa => despesa.pago = true);
      this.gastosGerais.forEach(gasto => gasto.pago = true);
    } else {
      this.exibirAlerta('Saldo insuficiente para realizar o pagamento.');
    }
  }

  
  async presentAlert(tipo: string) {
    const alert = await this.alertController.create({
      header: `Adicionar ${tipo}`,
      inputs: [
        {
          name: 'nomeDespesa',
          type: 'text',
          placeholder: 'Nome da Despesa',
          label: 'Nome da Despesa',
        },
        {
          name: 'valorDespesa',
          type: 'number',
          placeholder: 'Valor',
          label: 'Valor',
          min: 0
        },
        {
          name: 'dataDespesa',
          type: 'date',
          placeholder: 'Data',
          label: 'Data',
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Operação cancelada');
          }
        },
        {
          text: 'Adicionar',
          handler: (data) => {
            if (data.valorDespesa < 0) {
              this.exibirAlerta('O valor da despesa não pode ser negativo.');
              return;
            }
            console.log(`${tipo} adicionado:`, data);
            if (tipo === 'Despesas Fixas') {
              this.despesasFixas.push({
                nome: data.nomeDespesa,
                valor: data.valorDespesa,
                data: data.dataDespesa,
                pago: false // Adiciona a propriedade pago com o valor inicial false
              });
            } else if (tipo === 'Gastos Gerais') {
              this.gastosGerais.push({
                nome: data.nomeDespesa,
                valor: data.valorDespesa,
                data: data.dataDespesa,
                pago: false // Adiciona a propriedade pago com o valor inicial false
              });
            }
            
          }
        }
      ]
    });

    await alert.present();
  }


  removerDespesa(despesa: Despesa) {
    const index = this.despesasFixas.indexOf(despesa);
    if (index > -1) {
      this.despesasFixas.splice(index, 1);
    }
  }

  removerGasto(gasto: Despesa) {
    const index = this.gastosGerais.indexOf(gasto);
    if (index > -1) {
      this.gastosGerais.splice(index, 1);
    }
  }

  private async exibirAlerta(mensagem: string) {
    const alert = await this.alertController.create({
      header: 'Erro',
      message: mensagem,
      buttons: ['OK']
    });

    await alert.present();
  }

  

}

interface Despesa {
  nome: string;
  valor: number;
  data: string;
  pago: boolean;
}


interface Avatar {
  nome: string;
  imgUrl: string;
}

