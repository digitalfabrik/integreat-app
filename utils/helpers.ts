import { Parser } from 'htmlparser2'

export function parseHTML(html: string, ontext: function, options: ParserOptions = {} ): void  {
    const parser = new Parser({
        ontext,
    }, options)

    parser.write(html)
    parser.end()
}