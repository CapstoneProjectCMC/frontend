// src/types/turndown.d.ts
declare module 'turndown' {
  export default class TurndownService {
    constructor(options?: any);
    turndown(html: string): string;
    addRule(key: string, rule: any): void;
    keep(rules: string[]): void;
    remove(rules: string[]): void;
    use(plugin: any): void;
  }
}
