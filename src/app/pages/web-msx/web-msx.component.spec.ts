import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Game } from 'src/app/models/game';

import { WebMSXComponent } from './web-msx.component';

describe('WebMSXComponent', () => {
  let component: WebMSXComponent;
  let fixture: ComponentFixture<WebMSXComponent>;

  beforeEach(async () => {
    let game: Game = new Game("name", "12345", 12345);
    game.setCompany("company");
    game.setYear("1986");
    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => JSON.stringify(game),
              },
            },
          },
        },
      ],
      declarations: [WebMSXComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebMSXComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
