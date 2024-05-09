import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ContaService } from '../services/conta.service';

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
})
export class Tab5Page {
  cpf: string = '';
  senha: string = '';
  mostrarSenha: boolean = false;


  constructor(private toastController: ToastController, private contaService: ContaService) {}
  
  cadastrar(cpf: string, senha: string) {
    this.contaService.cadastrar(cpf, senha);
  }

  async mostrarToast(mensagem: string) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  toggleMostrarSenha() {
    this.mostrarSenha = !this.mostrarSenha;
  }
  
}

