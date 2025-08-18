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
    if (!html) return '';

    // --- Step 1: decode entity ---
    html = html
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&nbsp;/g, ' ');

    // --- Step 2: tách dòng ---
    const lines = html
      .replace(/<br\s*\/?>/gi, '\n')
      .split(/<\/div>/i)
      .map((line: string) => line.replace(/<div[^>]*>/gi, '').trim())
      .filter((line: string) => line.length > 0);

    let inCodeBlock = false;
    const result: string[] = [];

    for (let line of lines) {
      // --- Inline formatting ---
      line = line
        .replace(/<b>(.*?)<\/b>/gi, '**$1**')
        .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
        .replace(/<i>(.*?)<\/i>/gi, '*$1*')
        .replace(/<em>(.*?)<\/em>/gi, '*$1*')
        .replace(/<u>(.*?)<\/u>/gi, '__$1__')
        .replace(/<del>(.*?)<\/del>/gi, '~~$1~~')
        .replace(/<code>(.*?)<\/code>/gi, '`$1`');

      // --- Blockquote ---
      if (/^<blockquote>([\s\S]*)<\/blockquote>$/.test(line)) {
        const text = line
          .replace(/^<blockquote>([\s\S]*)<\/blockquote>$/, '$1')
          .trim();
        result.push(`> ${text}`);
        continue;
      }

      // --- Nếu đã có # heading thì giữ nguyên ---
      if (/^#+\s/.test(line)) {
        result.push(line);
        continue;
      }

      // --- Nếu nguyên dòng là bold thì convert thành heading ---
      if (/^\*\*(.*)\*\*$/.test(line)) {
        result.push(`# ${line.replace(/^\*\*(.*)\*\*$/, '$1').trim()}`);
        continue;
      }

      // --- List ---
      line = line.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, inner: string) =>
        inner.replace(
          /<li[^>]*>(.*?)<\/li>/gi,
          (_: string, item: string) => `- ${item}\n`
        )
      );

      line = line.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, inner: string) => {
        let i = 1;
        return inner.replace(
          /<li[^>]*>(.*?)<\/li>/gi,
          (_: string, item: string) => `${i++}. ${item}\n`
        );
      });

      // --- Inline code ---
      line = line.replace(
        /`([^`]+?)`/g,
        (_: string, code: string) => `\`${code.trim()}\``
      );

      // --- Detect code block ---
      const isCodeLine = /^(const|let|function|import|\s*<pre|\s*<code)/i.test(
        line
      );

      if (isCodeLine && !inCodeBlock) {
        inCodeBlock = true;
        result.push('```js'); // ✅ chuẩn markdown
      }
      if (!isCodeLine && inCodeBlock) {
        inCodeBlock = false;
        result.push('```'); // ✅ chuẩn markdown
      }

      result.push(line);
    }

    if (inCodeBlock) result.push('```');

    // --- Step cuối: normalize xuống dòng và ký tự ---
    return result
      .join('\n')
      .replace(/\r\n/g, '\n') // chuẩn hóa newline
      .replace(/ˋ/g, '`') // thay ký tự na ná backtick
      .trim();
  }
}
