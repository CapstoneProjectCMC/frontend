import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsingCodeEditorComponent } from './using-code-editor/using-code-editor.component';
import { UsingInputButtonComponent } from './using-input-button/using-input-button.component';
import { UsingDropdownComponent } from './using-dropdown/using-dropdown.component';
import { UsingTextEditorComponent } from './using-text-editor/using-text-editor.component';
import { UsingCardDataComponent } from './using-card-data/using-card-data.component';
import { CodeEditorPage } from './code-editor/code-editor.component';
import { UsingTrendingComponent } from './using-trending/using-trending.component';
import { MenuLayoutComponent } from '../../layouts/layout-components/menu/menu-layout.component';
import { MenuDemoComponent } from './using-main-navbar/menu-demo.component';
import { CommentComponent } from '../../shared/components/fxdonad-shared/comment/comment.component';
import { QuizComponent } from '../../shared/components/fxdonad-shared/quiz/quiz.component';
import { UsingQuizComponent } from './using-quiz/using-quiz.component';

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
  {
    path: 'app-menu-layout',
    component: MenuDemoComponent,
  },
  {
    path: 'app-comment',
    component: CommentComponent,
  },
  {
    path: 'app-quiz',
    component: UsingQuizComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExampleSlideRoutingModule {}
