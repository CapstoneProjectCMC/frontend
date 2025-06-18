import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsingCodeEditorComponent } from './using-code-editor/using-code-editor.component';
import { UsingInputButtonComponent } from './using-input-button/using-input-button.component';
import { UsingDropdownComponent } from './using-dropdown/using-dropdown.component';
import { UsingTextEditorComponent } from './using-text-editor/using-text-editor.component';

const routes: Routes = [
  {
    path: 'code-editor',
    component: UsingCodeEditorComponent,
  },
  {
    path: 'input-button',
    component: UsingInputButtonComponent,
  },
  {
    path: 'dropdown',
    component: UsingDropdownComponent,
  },
  {
    path: 'text-editor',
    component: UsingTextEditorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExampleSlideRoutingModule {}
