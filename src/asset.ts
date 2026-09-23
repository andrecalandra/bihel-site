/** Resolve um caminho de public/ considerando o `base` do Vite (GitHub Pages
 *  serve o site em /bihel-site/, não na raiz). */
export function asset(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}
