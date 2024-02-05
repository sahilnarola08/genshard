export const RemoveConsoleLog = () => {
  if (process.env.NODE_ENV !== 'development') {
    console.log = () => {}
    console.debug = () => {}
    console.info = () => {}
    console.error = () => {}
  }
}

export const RemoveConsoleWarning = () => {
  console.warn = () => {}
}
