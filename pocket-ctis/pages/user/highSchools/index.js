import UserPageContainer from '../../../components/UserPageContainer/UserPageContainer'
import HighSchoolList from '../../../components/HighSchoolsList/HighSchoolsList'
import { useEffect, useState } from 'react'
import { _getFetcher } from '../../../helpers/fetchHelpers'
import { craftUrl, buildCondition } from '../../../helpers/urlHelper'

const HighSchoolDashboard = ({ res }) => {
  const [highschools, setHighschools] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [total, setTotal] = useState()

  useEffect(() => {
    setHighschools(res.data)
    setTotal(res.length)
    setIsLoading(false)
  }, [])

  const onQuery = (queryParams) => {
    const conditions = buildCondition(queryParams)
    setIsLoading(true)
    _getFetcher({ highschools: craftUrl(['highschools'], conditions) })
      .then(({ highschools }) => {
        setTotal(highschools.length)
        setHighschools(highschools.data)
      })
      .finally((_) => setIsLoading(false))
  }

  return (
    <UserPageContainer>
      <HighSchoolList
        highSchools={highschools}
        total={total}
        onQuery={onQuery}
        isLoading={isLoading}
      />
    </UserPageContainer>
  )
}

export async function getServerSideProps(context) {
  const { cookie } = context.req.headers
  const { highschools } = await _getFetcher(
    { highschools: craftUrl(['highschools']) },
    cookie
  )
  return { props: { res: highschools } }
}

export default HighSchoolDashboard
