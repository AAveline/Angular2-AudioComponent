import {NgModule} from '@angular/core';

import {AudioComponent} from './src/audio.component';

export * from './src/audio.component';

@NgModule({
    declarations: [
        AudioComponent
    ],
    exports: [
        AudioComponent
    ]
})

export class Angular2AudioComponentModule {
}
