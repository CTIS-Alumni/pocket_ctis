import GraduationProjectsList from '../../../components/GraduationProjectsList/GraduationProjectsList'
import { _getFetcher } from '../../../helpers/fetchHelpers'
import { craftUrl } from '../../../helpers/urlHelper'
import UserPageContainer from '../../../components/UserPageContainer/UserPageContainer'

const GraduationProjectsDashboard = ({ gradprojects }) => {
  return (
    <UserPageContainer>
      <GraduationProjectsList graduationProjects={gradprojects.data} />
    </UserPageContainer>
  )
}

export async function getServerSideProps(context) {
  const { cookie } = context.req.headers
  const { gradprojects } = await _getFetcher(
    {
      gradprojects: craftUrl(['graduationprojects']),
    },
    cookie
  )
  return { props: { gradprojects } }
}

export default GraduationProjectsDashboard
