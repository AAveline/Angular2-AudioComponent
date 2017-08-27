import {NgModule} from '@angular/core';

import {GoogleSignInProviderService} from './ngx-google-sign-in.service';
import {NgxGoogleSignInComponent} from './ngx-google-signin.component';

export * from './ngx-google-sign-in.service';
export * from './ngx-google-signin.component';

@NgModule({
  declarations: [
    NgxGoogleSignInComponent
  ],
  exports: [
    NgxGoogleSignInComponent
  ]
})

export class NgxGoogleSignInModule {
  static forRoot() {
    return {
      ngModule: NgxGoogleSignInModule,
      providers: [
        GoogleSignInProviderService
      ]
    }
  }
}
