import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(private router: Router) {}

  showTabBar(): boolean {
    // Retorna true se a rota atual não for 'tab4' nem 'tab5', caso contrário, retorna false
    return !this.router.url.includes('/tabs/tab4') && !this.router.url.includes('/tabs/tab5');
  }
}

