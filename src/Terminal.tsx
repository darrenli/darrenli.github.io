import React from 'react'
// @ts-ignore
import HttpsRedirect from 'react-https-redirect'
import Header from './Header'
import Input from './Input'

// TODO http://tobiasahlin.com/moving-letters/#1

type Props = {}

const Terminal = (props: Props) => {
  return (
    <HttpsRedirect>
      <div className="terminal">
        <Header />
        <Input />
      </div>
    </HttpsRedirect>
  )
}

export default Terminal
