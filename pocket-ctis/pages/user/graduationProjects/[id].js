import React from 'react'
import { _getFetcher } from '../../../helpers/fetchHelpers'
import { craftUrl } from '../../../helpers/urlHelper'
import UserPageContainer from '../../../components/UserPageContainer/UserPageContainer'

const GraduationProject = ({ graduationproject }) => {
  return <UserPageContainer>GraduationProject</UserPageContainer>
}

export async function getServerSideProps(context) {
  const { cookie } = context.req.headers
  const { graduationproject } = await _getFetcher(
    { graduationproject: craftUrl(['graduation_project', context.params.id]) },
    cookie
  )
  return { props: graduationproject }
}
export default GraduationProject
