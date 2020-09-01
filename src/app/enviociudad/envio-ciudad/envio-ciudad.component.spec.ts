import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvioCiudadComponent } from './envio-ciudad.component';

describe('EnvioCiudadComponent', () => {
  let component: EnvioCiudadComponent;
  let fixture: ComponentFixture<EnvioCiudadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnvioCiudadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvioCiudadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
