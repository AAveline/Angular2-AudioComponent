import {NgModule} from '@angular/core';

import {GoogleSignInProviderService} from './src/ngx-google-sign-in.service';
import {NgxGoogleSignInComponent} from './src/ngx-google-signin.component';

export * from './src/ngx-google-sign-in.service';
export * from './src/ngx-google-signin.component';

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
