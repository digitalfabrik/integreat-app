import ChatMessageModel from 'shared/api/models/ChatMessageModel'

export const testMessages: ChatMessageModel[] = [
  new ChatMessageModel({
    id: 1,
    body: '<b>Meine Frage lautet</b>, warum bei Integreat eigentlich alles gelb ist. <a rel="noopener" class="link-external" target="_blank" href="https://www.google.com" >Weitere Infos</a>',
    userIsAuthor: true,
  }),
  new ChatMessageModel({
    id: 2,
    body: 'Informationen zu Ihrer Frage finden Sie auf folgenden Seiten:',
    userIsAuthor: false,
  }),
]
