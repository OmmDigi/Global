import React, { Suspense } from 'react'
import ExistAdmissionPage from './ExistAdmissionPage'

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ExistAdmissionPage />
    </Suspense>
  )
}
