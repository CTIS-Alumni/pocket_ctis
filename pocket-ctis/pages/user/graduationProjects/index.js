import { useState} from 'react'
import GraduationProjectsList from '../../../components/GraduationProjectsList/GraduationProjectsList'
import { _getFetcher } from '../../../helpers/fetchHelpers'
import { buildCondition } from '../../../helpers/urlHelper'
import { craftUrl } from '../../../helpers/urlHelper'
import UserPageContainer from '../../../components/UserPageContainer/UserPageContainer'

const GraduationProjectsDashboard = () => {
  const [gradProjects, setGradProjects] = useState([])
  const [total, setTotal] = useState()
  const [isLoading, setIsLoading] = useState(false)

  const onQuery = (queryParams) => {
    const conditions = buildCondition(queryParams)
    setIsLoading(true)
    _getFetcher({ gradProjects: craftUrl(['graduationprojects'], conditions) })
      .then(({ gradProjects }) => {
        setTotal(gradProjects.length)
        setGradProjects(gradProjects.data)
      })
      .finally((_) => setIsLoading(false))
  }

  return (
    <UserPageContainer>
      <GraduationProjectsList graduationProjects={gradProjects} total={total} onQuery={onQuery} isLoading={isLoading} />
    </UserPageContainer>
  )
}

export default GraduationProjectsDashboard
