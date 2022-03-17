import { OverlayModule } from '@angular/cdk/overlay';
import { HttpClient } from '@angular/common/http';
import { ComponentFixture, inject, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { ContextMenuService } from 'ngx-contextmenu';
import { HttpLoaderFactory } from 'src/app/app.module';
import { InternationalizationModule } from 'src/app/internationalization/internationalization.module';
import { ScanParametersComponent } from 'src/app/popups/scan-parameters/scan-parameters.component';
import { FileSystemChooserComponent } from 'src/app/shared/fs-chooser/fs-chooser.component';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        RouterTestingModule,
        OverlayModule,
        InternationalizationModule.forRoot({ locale_id: 'en-US' }),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })
      ],
      declarations: [
        HomeComponent,
        ScanParametersComponent,
        FileSystemChooserComponent,
        NgbDropdown
      ],
      providers: [
        ContextMenuService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', waitForAsync(inject([ContextMenuService], (contextMenuService: ContextMenuService) => {
    expect(component).toBeTruthy();
  })));
});
