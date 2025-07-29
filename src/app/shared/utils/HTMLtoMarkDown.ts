// import { Injectable } from '@angular/core';
// import TurndownService from 'turndown';

// @Injectable({ providedIn: 'root' })
// export class HtmlToMdService {
//   private turndownService: TurndownService;

//   constructor() {
//     this.turndownService = new TurndownService({
//       headingStyle: 'atx',
//       codeBlockStyle: 'fenced',
//       bulletListMarker: '-',
//     });

//     // Remove span, script, style
//     this.turndownService.addRule('removeSpanStyleScript', {
//       filter: (node: HTMLElement): boolean => {
//         return (
//           node.nodeName === 'SPAN' ||
//           node.nodeName === 'STYLE' ||
//           node.nodeName === 'SCRIPT'
//         );
//       },
//       replacement: () => '',
//     });

//     // Preserve pre > code blocks
//     this.turndownService.addRule('preCode', {
//       filter: (node: HTMLElement): boolean => {
//         return (
//           node.nodeName === 'PRE' &&
//           node.firstChild !== null &&
//           (node.firstChild as HTMLElement).nodeName === 'CODE'
//         );
//       },
//       replacement: (_content, node) => {
//         const code = node.textContent || '';
//         return `\n\n\`\`\`js\n${code.trim()}\n\`\`\`\n\n`;
//       },
//     });

//     // Bold
//     this.turndownService.addRule('bold', {
//       filter: ['strong', 'b'],
//       replacement: (content) => `**${content}**`,
//     });

//     // Blockquote
//     this.turndownService.addRule('blockquote', {
//       filter: 'blockquote',
//       replacement: (content) => {
//         const lines = content.split('\n').map((line) => `> ${line}`);
//         return lines.join('\n');
//       },
//     });
//     this.turndownService.addRule('boldDivToHeading', {
//       filter: (node) => {
//         return (
//           node.nodeName === 'DIV' &&
//           node.childNodes.length === 1 &&
//           (node.firstChild?.nodeName === 'B' ||
//             node.firstChild?.nodeName === 'STRONG')
//         );
//       },
//       replacement: (_content, node) => {
//         const innerText = (node.textContent || '').trim();
//         return `\n\n## ${innerText}\n\n`;
//       },
//     });
//     this.turndownService.addRule('emptyDivWithBr', {
//       filter: (node) => {
//         return (
//           node.nodeName === 'DIV' &&
//           node.childNodes.length === 1 &&
//           node.firstChild?.nodeName === 'BR'
//         );
//       },
//       replacement: () => '\n\n',
//     });
//     this.turndownService.addRule('codeBlockInParagraph', {
//       filter: function (node: any) {
//         return (
//           node.nodeName === 'P' && node.textContent?.trim().startsWith('const ') // nhận biết đoạn code
//         );
//       },
//       replacement: function (_content, node) {
//         const code = node.textContent || '';
//         return `\n\n\`\`\`js\n${code.trim()}\n\`\`\`\n\n`;
//       },
//     });
//   }
//   preprocess(html: string): string {
//     const divRegex = /<div>(.*?)<\/div>/g;
//     const codeLines: string[] = [];
//     const lines: string[] = [];

//     const isEmptyLine = (text: string): boolean => {
//       return (
//         text === '' ||
//         text === '<br>' ||
//         text === '<b><br></b>' ||
//         text === '&nbsp;'
//       );
//     };

//     const isCodeLike = (text: string): boolean => {
//       const plain = text
//         .replace(/&lt;/g, '<')
//         .replace(/&gt;/g, '>')
//         .replace(/&amp;/g, '&')
//         .trim();

//       return (
//         /^((const|let|var|function|return|trở lại)\s)/.test(plain) || // bắt đầu bằng từ khoá
//         /^[<{[(]/.test(plain) || // mở đầu bằng các ký tự đặc trưng
//         /=>\s*{?/.test(plain) || // arrow function
//         plain.endsWith(';') || // kết thúc bằng ;
//         /^[\s]*<\/?[a-z]/i.test(plain) // thẻ html như <ul>
//       );
//     };

//     const flushCodeLines = () => {
//       if (codeLines.length > 0) {
//         lines.push('\n````js\n' + codeLines.join('\n') + '\n````\n');
//         codeLines.length = 0;
//       }
//     };

//     let match;
//     while ((match = divRegex.exec(html)) !== null) {
//       const rawHtml = match[1].trim();

//       if (isEmptyLine(rawHtml)) {
//         flushCodeLines();
//         lines.push('');
//         continue;
//       }

//       const normalized = rawHtml
//         .replace(/&lt;/g, '<')
//         .replace(/&gt;/g, '>')
//         .replace(/&amp;/g, '&')
//         .trim();

//       // Tiêu đề <b>...</b> như <b>1. Mở đầu bài viết</b>
//       const headingMatch = rawHtml.match(/^<b>(.*?)<\/b>$/i);
//       if (headingMatch) {
//         flushCodeLines();
//         lines.push(`# ${headingMatch[1].trim()}`);
//         continue;
//       }

//       if (isCodeLike(normalized)) {
//         codeLines.push(normalized);
//       } else {
//         flushCodeLines();
//         lines.push(normalized);
//       }
//     }

//     flushCodeLines(); // flush cuối cùng
//     return lines.join('\n\n');
//   }

//   convert(html: string): string {
//     const preprocessed = this.preprocess(html);
//     return this.turndownService.turndown(preprocessed);
//   }
// }
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HtmlToMdService {
  convert(html: string): string {
    // Bước 1: decode các entity HTML cơ bản
    html = html
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&');

    // Bước 2: tách các dòng từ thẻ <div>
    const lines = html
      .replace(/<br\s*\/?>/gi, '\n') // <br> thành xuống dòng
      .split(/<\/div>/i)
      .map((line) =>
        line
          .replace(/<div[^>]*>/gi, '') // bỏ thẻ <div>
          .trim()
      )
      .filter((line) => line.length > 0);

    let inCodeBlock = false;
    let result: string[] = [];

    for (let line of lines) {
      // Bước 3: tiêu đề từ <b>
      if (/^<b>.*<\/b>$/.test(line)) {
        const text = line.replace(/^<b>(.*)<\/b>$/, '$1').trim();
        result.push(`# ${text}`);
        continue;
      }

      // Bước 4: xử lý inline code `...` trong văn bản
      line = line.replace(/`([^`]+?)`/g, (_, code) => `\\\`${code.trim()}\\\``);

      // Bước 5: xác định block code
      const isCodeLine = /^(const|let|function|<[/a-z]|{|}|;|\)).*/i.test(line);

      if (isCodeLine && !inCodeBlock) {
        inCodeBlock = true;
        result.push('\\`\\`\\`js');
      }

      if (!isCodeLine && inCodeBlock) {
        inCodeBlock = false;
        result.push('\\`\\`\\`');
      }

      result.push(line);
    }

    if (inCodeBlock) result.push('\\`\\`\\`');

    return result.join('\n').trim();
  }
}
