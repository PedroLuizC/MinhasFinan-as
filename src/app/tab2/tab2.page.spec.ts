import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { ContaService } from '../../app/services/conta.service';
import { Tab2Page } from './tab2.page';

describe('Tab2Page', () => {
  let component: Tab2Page;
  let fixture: ComponentFixture<Tab2Page>;
  let alertControllerSpy: jasmine.SpyObj<AlertController>;
  let contaServiceSpy: jasmine.SpyObj<ContaService>;

  beforeEach(async () => {
    const alertController = jasmine.createSpyObj('AlertController', ['create']);
    const contaService = jasmine.createSpyObj('ContaService', ['getSelectedImage', 'contaLogada']);
    await TestBed.configureTestingModule({
      declarations: [Tab2Page],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: AlertController, useValue: alertController },
        { provide: ContaService, useValue: contaService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Tab2Page);
    component = fixture.componentInstance;
    alertControllerSpy = TestBed.inject(AlertController) as jasmine.SpyObj<AlertController>;
    contaServiceSpy = TestBed.inject(ContaService) as jasmine.SpyObj<ContaService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('calcularTotalExtrato()', () => {
    it('should return correct total of expenses', () => {
      component.despesasFixas = [{ nome: 'Despesa 1', valor: 50, data: '2024-05-16', pago: false }, { nome: 'Despesa 2', valor: 100, data: '2024-05-16', pago: false }];
      component.gastosGerais = [{ nome: 'Gasto 1', valor: 30, data: '2024-05-16', pago: false }, { nome: 'Gasto 2', valor: 70, data: '2024-05-16', pago: false }];
      const total = component.calcularTotalExtrato();
      expect(total).toEqual(250); // Usando toEqual() para verificar se o valor retornado é igual a 250
    });

    it('should return 0 when there are no expenses', () => {
      const total = component.calcularTotalExtrato();
      expect(total).toEqual(0); // Usando toEqual() para verificar se o valor retornado é igual a 0
    });
  });

});