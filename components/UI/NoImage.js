import React from 'react'
import Image from 'next/image'

export default function NoImage() {
  return (
    <div className='noimage-block'>
        <div className='noimage-logo'>
            <Image
                src="/assets/images/infra-logo.png"
                layout="fill"
                objectFit='contain'
                objectPosition='center'
                alt="site_logo"
            />
        </div>
    </div>
  )
}
