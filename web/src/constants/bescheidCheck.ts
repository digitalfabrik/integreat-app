export const MAX_FILES = 10
export const MAX_FILE_SIZE_MB = 20
export const BYTES_PER_MB = 1_048_576
export const ACCEPTED_FILE_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png', '.heic']
export const MAX_PROGRESS = 100

export const PLACEHOLDER_EXPLANATION = {
  title: 'Platzhalter: BAMF-Bescheid Einfache Ablehnung',
  summaryTitle: 'Was steht im Bescheid?',
  summary:
    'Platzhalter: Dein Asylantrag wurde als „offensichtlich unbegründet“ abgelehnt. Das ist ein juristischer Begriff. Er sagt nichts darüber, was du erlebt hast. Er bedeutet: Für dich gelten kürzere Fristen. In der Regel fordert dich das BAMF auf, Deutschland zu verlassen, und droht dir die Abschiebung an. Oft ordnet es außerdem ein Einreise- und Aufenthaltsverbot an. Ob das bei dir so ist, steht in deinem Bescheid.',
  meaningTitle: 'Was bedeutet das für dich?',
  meaning: [
    'Platzhalter: Aufenthalt: Meistens musst du Deutschland innerhalb einer Woche verlassen. In manchen Fällen setzt das BAMF keine Frist. Dann musst du sofort ausreisen. Was für dich gilt, steht in deinem Bescheid.',
    'Platzhalter: Abschiebung: Wenn du rechtzeitig einen Eilantrag stellst, darfst du nicht abgeschoben werden, bis das Gericht darüber entschieden hat. Ohne Eilantrag oder wenn das Gericht ihn ablehnt, kannst du abgeschoben werden, auch während deine Klage noch läuft. Eine Abschiebung wird meist nicht angekündigt.',
  ],
  steps: [
    {
      title: 'Platzhalter: Beobachten Sie die Frist',
      description:
        'Überprüfen Sie das Datum, an dem Sie die Mitteilung erhalten haben. Dieses Datum kann für weitere Schritte wichtig sein.',
    },
    {
      title: 'Platzhalter: Kontaktieren Sie ein Beratungszentrum',
      description: 'Aufgrund der kurzen Frist ist es wichtig, bald mit einem Beratungszentrum zu sprechen.',
    },
    {
      title: 'Platzhalter: Halten Sie die Mitteilung bereit',
      description: 'Bringen Sie die vollständige Mitteilung und alle dazugehörigen Dokumente zur Beratung mit.',
    },
  ],
}
