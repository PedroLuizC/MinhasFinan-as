import { Component, OnInit } from '@angular/core';
import { ContaService } from '../../app/services/conta.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})

export class Tab4Page implements OnInit {
  mostrarSenha: boolean = false;
  cpf: string = '';
  senha: string = '';

  constructor(private contaService: ContaService,private router: Router) {}

  ngOnInit() {}

  toggleMostrarSenha() {
    this.mostrarSenha = !this.mostrarSenha;
  }

  login(cpf: string, senha: string) {
    this.contaService.login(this.cpf,this.senha);
  }
}
