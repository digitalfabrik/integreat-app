export abstract class Page {
  abstract get(): Promise<void>
}
