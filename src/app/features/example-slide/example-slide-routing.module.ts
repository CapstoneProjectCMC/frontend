import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsingCodeEditorComponent } from './using-code-editor/using-code-editor.component';
import { UsingInputButtonComponent } from './using-input-button/using-input-button.component';
import { UsingDropdownComponent } from './using-dropdown/using-dropdown.component';
import { UsingTextEditorComponent } from './using-text-editor/using-text-editor.component';
import { UsingCardDataComponent } from './using-card-data/using-card-data.component';
import { CodeEditorPage } from './code-editor/code-editor.component';
import { UsingTrendingComponent } from './using-trending/using-trending.component';

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
  {
    path: 'card-data',
    component: UsingCardDataComponent,
  },
  {
    path: 'code-editor-page',
    component: CodeEditorPage,
  },
  {
    path: 'trending',
    component: UsingTrendingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExampleSlideRoutingModule {}
