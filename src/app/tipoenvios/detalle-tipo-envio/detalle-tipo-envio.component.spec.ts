import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleTipoEnvioComponent } from './detalle-tipo-envio.component';

describe('DetalleTipoEnvioComponent', () => {
  let component: DetalleTipoEnvioComponent;
  let fixture: ComponentFixture<DetalleTipoEnvioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleTipoEnvioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleTipoEnvioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
