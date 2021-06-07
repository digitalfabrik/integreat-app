declare module 'sanitize-html-react' {
  interface IOptions {
    allowedAttributes?: Record<string, string[]> | false
    allowedSchemes?: string[] | boolean
    allowedTags?: string[] | false
  }

  export default function sanitize(dirty: string, options?: IOptions): string
}
