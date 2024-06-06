export type ChatMessageType = {
  id: number
  body: string
  userIsAuthor: boolean
}

export const testMessages: ChatMessageType[] = [
  {
    id: 1,
    body: '<b>Meine Frage lautet</b>, warum bei Integreat eigentlich alles gelb ist.<a class="link-external" href="https://www.integreat.app">Weitere Infos</a>',
    userIsAuthor: true,
  },
  {
    id: 2,
    body: 'Informationen zu Ihrer Frage finden Sie auf folgenden Seiten:',
    userIsAuthor: false,
  },
  {
    id: 3,
    body: 'Weitere Meine Frage lautet, warum bei Integreat eigentlich alles gelb ist.',
    userIsAuthor: true,
  },
  {
    id: 4,
    body: 'Weitere Antwort Informationen zu Ihrer Frage finden Sie auf folgenden Seiten:',
    userIsAuthor: false,
  },
  {
    id: 5,
    body: 'Weitere Antwort....',
    userIsAuthor: false,
  },
  {
    id: 6,
    body: 'Informationen zu Ihrer Frage finden Sie auf folgenden Seiten:',
    userIsAuthor: false,
  },
]
