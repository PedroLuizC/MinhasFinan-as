import { ComponentFixture, TestBed, waitForAsync, fakeAsync, tick } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { Tab1Page } from './tab1.page';

describe('Tab1Page', () => {
  let component: Tab1Page;
  let fixture: ComponentFixture<Tab1Page>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [Tab1Page],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Tab1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should call openFileSelector() when "Adicionar avatar" button is clicked', fakeAsync(() => {
    spyOn(component, 'openFileSelector'); // Espionar a função openFileSelector()

    const compiled = fixture.nativeElement;
    const adicionarAvatarButton = compiled.querySelector('ion-item ion-button'); // Selecionar o botão "Adicionar avatar"

    adicionarAvatarButton.click(); // Simular o clique no botão "Adicionar avatar"

    fixture.detectChanges();
    tick();

    // Verificar se a função openFileSelector() foi chamada
    expect(component.openFileSelector).toHaveBeenCalled();
  }));
});
