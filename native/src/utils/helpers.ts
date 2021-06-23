import { Parser, ParserOptions } from 'htmlparser2'

export function parseHTML(html: string, ontext: (data: string) => void, options: ParserOptions = {} ): void  {
    const parser = new Parser({
        ontext,
    }, options)

    parser.write(html)
    parser.end()
}
