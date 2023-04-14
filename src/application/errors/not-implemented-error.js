export class NotImplementedError extends Error {
  constructor({
    className ,
    methodName
  }) {
    const message = `[${className}#${methodName}] is not implemented.`
    super(message)
    this.name = 'NotImplementedError'
  }
}