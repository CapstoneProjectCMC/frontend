# Text Editor Component

Một component text editor hoàn chỉnh với các tính năng định dạng văn bản cơ bản, được xây dựng bằng Angular.

## Tính năng

### Định dạng văn bản
- **In đậm** (Bold)
- **In nghiêng** (Italic)
- **Gạch chân** (Underline)
- **Gạch ngang** (Strikethrough)

### Căn chỉnh văn bản
- Căn trái
- Căn giữa
- Căn phải
- Căn đều

### Danh sách
- Danh sách không đánh số (Bullet list)
- Danh sách đánh số (Numbered list)

### Thụt lề
- Tăng thụt lề
- Giảm thụt lề

### Khác
- Xóa định dạng
- Placeholder text
- Chế độ chỉ đọc (Readonly)
- Responsive design
- Hỗ trợ dark theme

## Cách sử dụng

### Import component

```typescript
import { TextEditor, TextEditorConfig } from './text-editor';
```

### Basic usage

```html
<app-text-editor 
  [(value)]="content"
  [config]="editorConfig"
  (onChange)="onContentChange($event)">
</app-text-editor>
```

### Configuration

```typescript
const editorConfig: TextEditorConfig = {
  placeholder: 'Nhập nội dung...',
  height: '300px',
  minHeight: '200px',
  maxHeight: '600px',
  readonly: false,
  toolbar: {
    bold: true,
    italic: true,
    underline: true,
    strikethrough: true,
    alignLeft: true,
    alignCenter: true,
    alignRight: true,
    alignJustify: true,
    bulletList: true,
    numberedList: true,
    indent: true,
    outdent: true,
    clearFormat: true,
  }
};
```

### Events

```typescript
// Content change
onContentChange(content: string) {
  console.log('Content changed:', content);
}

// Focus event
onEditorFocus() {
  console.log('Editor focused');
}

// Blur event
onEditorBlur() {
  console.log('Editor blurred');
}
```

## API Reference

### Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` | `string` | `''` | Nội dung HTML của editor |
| `config` | `TextEditorConfig` | See below | Cấu hình editor |

### Outputs

| Event | Type | Description |
|-------|------|-------------|
| `valueChange` | `EventEmitter<string>` | Emit khi nội dung thay đổi |
| `onChange` | `EventEmitter<string>` | Emit khi nội dung thay đổi |
| `onFocus` | `EventEmitter<void>` | Emit khi editor được focus |
| `onBlur` | `EventEmitter<void>` | Emit khi editor mất focus |

### TextEditorConfig Interface

```typescript
interface TextEditorConfig {
  placeholder?: string;        // Text placeholder
  height?: string;             // Chiều cao editor
  minHeight?: string;          // Chiều cao tối thiểu
  maxHeight?: string;          // Chiều cao tối đa
  readonly?: boolean;          // Chế độ chỉ đọc
  toolbar?: {                  // Cấu hình toolbar
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
    alignLeft?: boolean;
    alignCenter?: boolean;
    alignRight?: boolean;
    alignJustify?: boolean;
    bulletList?: boolean;
    numberedList?: boolean;
    indent?: boolean;
    outdent?: boolean;
    clearFormat?: boolean;
  };
}
```

## Ví dụ sử dụng

### Editor cơ bản

```html
<app-text-editor 
  [(value)]="content"
  placeholder="Nhập nội dung của bạn...">
</app-text-editor>
```

### Editor với toolbar tùy chỉnh

```typescript
const minimalConfig: TextEditorConfig = {
  placeholder: 'Minimal editor...',
  height: '200px',
  toolbar: {
    bold: true,
    italic: true,
    bulletList: true,
    numberedList: true,
  }
};
```

### Editor chỉ đọc

```typescript
const readonlyConfig: TextEditorConfig = {
  readonly: true,
  height: '200px',
  toolbar: {}
};
```

## Styling

Component sử dụng SCSS với các class chính:

- `.text-editor-container` - Container chính
- `.text-editor-toolbar` - Thanh công cụ
- `.text-editor-content` - Vùng nội dung

### Custom styling

```scss
.text-editor-container {
  border: 2px solid #007bff;
  border-radius: 12px;
  
  .text-editor-toolbar {
    background: #f8f9fa;
  }
  
  .text-editor-content {
    font-family: 'Arial', sans-serif;
    font-size: 16px;
  }
}
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Keyboard Shortcuts

- `Ctrl+B` - Bold
- `Ctrl+I` - Italic
- `Ctrl+U` - Underline
- `Ctrl+Z` - Undo
- `Ctrl+Y` - Redo

## Accessibility

- Hỗ trợ keyboard navigation
- ARIA labels cho các button
- Focus indicators
- Screen reader friendly

## Performance

- Sử dụng MutationObserver để theo dõi thay đổi
- Debounced content updates
- Memory leak prevention với proper cleanup

## Troubleshooting

### Lỗi thường gặp

1. **Editor không hiển thị toolbar**
   - Kiểm tra `config.toolbar` có được set đúng không
   - Đảm bảo `readonly` không được set thành `true`

2. **Content không update**
   - Kiểm tra two-way binding `[(value)]`
   - Đảm bảo component được import đúng cách

3. **Styling không apply**
   - Kiểm tra file SCSS được import
   - Đảm bảo Angular CLI compile SCSS

## Contributing

1. Fork repository
2. Create feature branch
3. Make changes
4. Add tests
5. Submit pull request

## License

MIT License 