import {
  Component,
  Input,
  ContentChildren,
  QueryList,
  AfterContentInit,
  TemplateRef,
} from '@angular/core';
import { NgIf, NgFor, NgClass, CommonModule } from '@angular/common';
import { InteractiveButtonComponent } from '../../fxdonad-shared/button/button.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, NgClass, CommonModule, InteractiveButtonComponent],
})
export class TableComponent implements AfterContentInit {
  @Input() data: Array<{ [key: string]: any }> = [];
  @Input() headers: Array<{ label: string; value: string }> = [];
  @Input() amountDataPerPage: number = 10;
  @Input() needNo = false;
  @Input() dataTabletype = '';
  @Input() editField?: string;
  @Input() idSelect = '';
  @Input() needEdit = false;
  @Input() needDelete = false;
  @Input() needViewResult = false;

  @ContentChildren(TemplateRef) templates!: QueryList<TemplateRef<any>>;
  templateMap: { [key: string]: TemplateRef<any> } = {};

  currentIndex = 1; // Hoặc inject store selector nếu cần

  ngAfterContentInit() {
    // Tìm các template có tên #cell_<value>
    this.templates.forEach((tpl: any) => {
      if (tpl._declarationTContainer?.localNames?.length) {
        const name = tpl._declarationTContainer.localNames[0];
        if (name.startsWith('cell_')) {
          const key = name.replace('cell_', '');
          this.templateMap[key] = tpl;
        }
      }
    });
  }

  handleDeleteClick(id: string | number) {
    console.log('Delete', id);
  }

  handleEditClick(id: string | number) {
    console.log('Edit', id);
  }

  handleStatusClick(id: string | number, status: number) {
    console.log('Status Clicked', { id, status });
  }

  handleNavigation(id: string, userId: string) {
    console.log('Navigate to report with:', id, userId);
  }
}
