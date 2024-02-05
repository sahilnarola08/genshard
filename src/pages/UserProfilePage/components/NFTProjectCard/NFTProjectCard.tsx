import React from 'react'
import { useIPFS } from '../../../../hooks/useIPFS';
import "./style.sass"

const NFTProjectCard = ({ nftData }: any) => {
  const { resolveLink } = useIPFS();
  return (
    <div className='nftProjectCard'>
      <img src={resolveLink(nftData.image)} alt="nftImg" />
      <div className='title'>{nftData.name}</div>
      <button className='mint' onClick={() => window.open(`https://testnets.opensea.io/assets/bsc-testnet/${nftData?.genNFTAddress}/${nftData?.tokenId}`, '_blink')}>VIEW NFT</button>
    </div>
  )
}

export default NFTProjectCard