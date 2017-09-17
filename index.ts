import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AudioComponent} from './src/audio.component';

export * from './src/audio.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        AudioComponent
    ],
    exports: [
        AudioComponent
    ]
})

export class Angular2AudioComponentModule {
}
