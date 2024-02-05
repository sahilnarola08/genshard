import { BaseProject, Card, ExtendedProject } from '../../state/market/types'
import Papa from 'papaparse'
import Web3 from 'web3'

export const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max).toString();
}
export const createCardArray = (length: number) =>
  // @jae
  new Array(length).fill(undefined).map(
    (item, index) =>
      new Card({
        networkChainIdValue: 5,
        networkChainName: 'GOERLI',
        src: 'https://upload.wikimedia.org/wikipedia/commons/7/73/Pale_Blue_Dot.png',
        name: 'Blackhole',
        total: '500',
        remain: getRandomInt(500),
        balance: getRandomInt(9),
        description: '<Insert Card Description>',
        address: '0x',
        price: '0',
        index: index
      })
  )

export const handleProjectData = async (item: BaseProject, genMarket: (address: string) => any) => {
  let startDate = item.startDate
  console.log(startDate)
  if (startDate === undefined && item.marketAddress !== undefined) {
    startDate = await genMarket(item.marketAddress!).methods.startTime().call()
  }
  console.log(startDate)
  let subPrivate = item.subPrivate
  let subPublic = item.subPublic
  if (item.subSheet !== undefined) {
    const results = await new Promise(function (complete, error) {
      Papa.parse(item.subSheet!, {
        download: true,
        header: true,
        complete,
        error
      })
    });
    console.log(results)
    // @ts-ignore
    subPrivate = (parseFloat((results.data[0] && results.data[0].sub) || 0) * 100).toFixed(2)
    // @ts-ignore
    subPublic = (parseFloat((results.data[2] && results.data[2].sub) || 0) * 100).toFixed(2)
  }

  return {
    ...item,
    subPublic: subPublic,
    subPrivate: subPrivate,
    startDate
  } as ExtendedProject
}

export const isVideoFormat = (src: string) => {
  if (src) {
    const splitByDots = src.split('.')
    const srcExt = splitByDots[splitByDots.length - 1]
    if (srcExt === 'mp4') {
      return true
    } else {
      return false
    }
  } return false
}