import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormContainerComponent } from './components/form-container.component';

@Component({
  selector: 'app-root',
  imports: [FormContainerComponent],
  template: `<app-form-container></app-form-container>`,
  styles: [`
    :host {
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    }
  `],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class App {}
