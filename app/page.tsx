import Image from 'next/image'
import React from 'react'

function Landingpage() {
  return (
    <div>
      <nav>
        <div className="logo">
          <Image
            src="/assets/logo.png"
            alt="TabooTalks Logo"
            width={250}
            height={250}
            />
        </div>
        <ul>
          <li>Home</li>
          <li>About</li>
          <li>Contact</li>
        </ul>

      </nav>
      <h1>
        Welcome to TabooTalks
      </h1>

      
    </div>
  )
}

export default Landingpage
