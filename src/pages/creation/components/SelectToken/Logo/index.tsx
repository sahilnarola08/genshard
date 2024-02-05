import React, { useState } from 'react'
import { HelpCircle } from 'react-feather'
import { ImageProps } from 'rebass'

const BAD_SRCS: { [tokenAddress: string]: true } = {}

// export interface LogoProps extends Pick<ImageProps, 'style' | 'alt' | 'className'> {
//   srcs: string
// }


interface CurrencyLogo {
  src?: string;
  alt?: string;
  style?: React.CSSProperties;
}

/**
 * Renders an image by sequentially trying a list of URIs, and then eventually a fallback triangle alert
 */
export default function Logo({src, alt, ...rest }: CurrencyLogo) {
  // const [, refresh] = useState<number>(0)

  // const src: any = srcs.find(src => !BAD_SRCS[src])

if(src){

    return (
      <img
        {...rest}
        alt={alt}
        src={src}
      />
    )

}
    
  

  return <HelpCircle {...rest} />
}
