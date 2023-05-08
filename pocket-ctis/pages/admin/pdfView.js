import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

//for some reason, a direct import does not work for next.js
//hence a dynamic import is created and used.
const ReportPDF = dynamic(
  () => import('../../components/PDFViewers/ReportPDF'),
  { ssr: false }
)

const PDFView = () => {
  return <ReportPDF data='Proof of Concept' />
}

export default PDFView
