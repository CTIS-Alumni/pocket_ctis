import UserPageContainer from '../../../components/UserPageContainer/UserPageContainer'
import UniversitiesList from '../../../components/UniversitiesList/UniversitiesList'
import { useState, useEffect } from 'react'
import { _getFetcher } from '../../../helpers/fetchHelpers'
import { craftUrl, buildCondition } from '../../../helpers/urlHelper'

const UniversitiesDashboard = ({ educationinstitutes }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [universities, setUniversities] = useState([])
  const [total, setTotal] = useState()

  useEffect(() => {
    setUniversities(educationinstitutes.data)
    setTotal(educationinstitutes.length)
  }, [])

  const onQuery = (queryParams) => {
    const conditions = buildCondition(queryParams)
    setIsLoading(true)
    _getFetcher({ universities: craftUrl(['educationinstitutes'], conditions) })
      .then(({ universities }) => {
        setTotal(universities.length)
        setUniversities(universities.data)
      })
      .finally((_) => setIsLoading(false))
  }

  return (
    <UserPageContainer>
      <UniversitiesList
        universities={universities}
        isLoading={isLoading}
        total={total}
        onQuery={onQuery}
      />
    </UserPageContainer>
  )
}

export async function getServerSideProps(context) {
  const { cookie } = context.req.headers
  const { educationinstitutes } = await _getFetcher(
    {
      educationinstitutes: craftUrl(['educationinstitutes']),
    },
    cookie
  )
  return { props: { educationinstitutes } }
}
export default UniversitiesDashboard
