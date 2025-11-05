import React, { Suspense } from 'react'
import NavComp from './NavComp'

export default function Navbar() {
  return (
    <Suspense fallback={<div>Loading..</div>}>
      <NavComp />
    </Suspense>
  )
}
