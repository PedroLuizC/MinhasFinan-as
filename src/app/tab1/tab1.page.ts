import { Component, ViewChild } from '@angular/core';
import { ContaService } from '../../app/services/conta.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page {

  @ViewChild('fileInput') fileInput: any;
  mostrarSenha: boolean = false;
  novoNomeConta: string = '';
  novoCPF: string = '';
  senhaAtual: string = ''; 
  novaSenha: string = '';

  constructor( private contaService: ContaService) {}
  
  toggleMostrarSenha() {
    this.mostrarSenha = !this.mostrarSenha;
  }

  openFileSelector() {
    this.fileInput.nativeElement.click();
  }

  handleFileInputChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.processFile(file);
    }
  }

  processFile(file: File) {
    this.contaService.alterarAvatar(file);
  }

  alterarNomeConta() {
    this.contaService.alterarNomeConta(this.novoNomeConta);
  }

  alterarCPF() {
    this.contaService.alterarCPF(this.novoCPF);
  }

  alterarSenha() {
    this.contaService.alterarSenha(this.senhaAtual, this.novaSenha)
      .then(() => {
        // Limpar os campos após a alteração da senha
        this.senhaAtual = '';
        this.novaSenha = '';
      })
      .catch((error) => {
        console.error('Erro ao alterar senha:', error);
        // Tratar o erro, se necessário
      });
  }
  
}
