import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GraphsHomePage } from './graphs-home.page';

describe('GraphsHomePage', () => {
  let component: GraphsHomePage;
  let fixture: ComponentFixture<GraphsHomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphsHomePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GraphsHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
