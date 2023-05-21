import UserPageContainer from '../../../components/UserPageContainer/UserPageContainer'
import UniversitiesList from '../../../components/UniversitiesList/UniversitiesList'
import { useState, useEffect } from 'react'
import { _getFetcher } from '../../../helpers/fetchHelpers'
import { craftUrl } from '../../../helpers/urlHelper'

const UniversitiesDashboard = ({ educationinstitutes }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [universities, setUniversities] = useState([])

  useEffect(() => {
    setUniversities(educationinstitutes.data)
  }, [])

  const onSearch = ({ searchValue }) => {
    setIsLoading(true)
    _getFetcher({
      educationinstitutes: craftUrl(
        ['educationinstitutes'],
        [{ name: 'name', value: searchValue }]
      ),
    })
      .then(({ educationinstitutes }) =>
        setUniversities(educationinstitutes.data)
      )
      .catch((err) => console.log(err))
      .finally((_) => setIsLoading(false))
  }

  return (
    <UserPageContainer>
      <UniversitiesList
        universities={universities}
        isLoading={isLoading}
        onSearch={onSearch}
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
