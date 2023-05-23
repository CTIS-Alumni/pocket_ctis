import React from 'react'
import UsersInfoPanel from '../../components/UsersInfoPanel/UsersInfoPanel'
import { _getFetcher } from '../../helpers/fetchHelpers'
import { buildCondition, craftUrl } from '../../helpers/urlHelper'
import UserPageContainer from '../../components/UserPageContainer/UserPageContainer'

const UsersRoute = ({ work, edu }) => {
  return (
    <UserPageContainer>
      <UsersInfoPanel work={work.data} edu={edu.data} />
    </UserPageContainer>
  )
}

//call API, using getServerSideProps. This will be called before the page is served to the frontend
//the result will be added to props object, which will be added to the corresponding component.
export async function getServerSideProps(context) {
  const { cookie } = context.req.headers
  const { work, edu } = await _getFetcher(
    {
      work: craftUrl(['workrecords'], buildCondition({limit: 15, offset: 0, column: "record_date", order: "desc"})),
      edu: craftUrl(['educationrecords'], buildCondition({limit: 15, offset: 0, column: "record_date", order: "desc"})),
    },
    cookie
  )

  console.log(work)

  return { props: { work, edu } }
}

export default UsersRoute
