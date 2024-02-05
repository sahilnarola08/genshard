export const getGenTicketUrl = (uri: string, index: number, decimal = 64) => {
  let count = decimal - index.toString().length
  let newIndex = index.toString()
  while (count-- > 0) {
    newIndex = '0' + newIndex
  }
  console.log('resdataURL -->', uri.replace('{id}', newIndex))
  return uri.replace('{id}', newIndex)
}
