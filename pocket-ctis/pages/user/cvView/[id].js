import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { _getFetcher } from '../../../helpers/fetchHelpers'
import { craftUrl } from '../../../helpers/urlHelper'

//for some reason, a direct import does not work for next.js
//hence a dynamic import is created and used.
const CvPDFView = dynamic(
  () => import('../../../components/PDFViewers/CvPDF'),
  { ssr: false }
)

const PDFView = () => {
  const [data, setData] = useState(null)
  const router = useRouter()

  useEffect(() => {  
    _getFetcher(
      { userInfo: craftUrl(['users', router.query.id, 'profile']) }
    ).then(({userInfo}) => {
      console.log('veryFirst', userInfo, router.query.id)
      if (userInfo.errors.length == 0)
        setData(userInfo.data)
      }
    )
  }, [router.query.id])

  return <CvPDFView data={data} />
}

export default PDFView
