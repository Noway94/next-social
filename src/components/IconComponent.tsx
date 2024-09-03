import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const IconComponent = () => {
  return (
    <>
        <div className="cursor-pointer">
            <Link href="/friends">
              <Image src="/people.png" alt="" width={24} height={24} />
              </Link>
            </div>
            <div className="cursor-pointer">
             <Link href="/messages">
              <Image src="/messages.png" alt="" width={20} height={20} />
                </Link> 
            </div>
            <div className="cursor-pointer">
              <Image src="/notifications.png" alt="" width={20} height={20} />
            </div>

     

    </>
  )
}

export default IconComponent