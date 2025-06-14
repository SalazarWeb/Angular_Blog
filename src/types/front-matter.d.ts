declare module 'front-matter' {
  interface FrontMatterResult<T> {
    attributes: T;
    body: string;
    frontmatter?: string;
  }

  function frontMatter<T = any>(text: string): FrontMatterResult<T>;
  
  export = frontMatter;
}