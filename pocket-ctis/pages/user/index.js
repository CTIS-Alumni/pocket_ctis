import React from 'react'
import NavigationBar from '../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../components/UserInfoSidebar/UserInfoSidebar'
import UsersInfoPanel from '../../components/UsersInfoPanel/UsersInfoPanel'
import {
  getEducationUpdates,
  getWorkUpdates,
} from '../../helpers/searchHelpers'

const UsersRoute = ({ work, edu }) => {
  return (
    <main>
      <NavigationBar />
      <UserInfoSidebar />
      <UsersInfoPanel work={work.data} edu={edu.data} />
    </main>
  )
}

//call API, using getServerSideProps. This will be called before the page is served to the frontend
//the result will be added to props object, which will be added to the corresponding component.
export async function getServerSideProps() {
  //   const workres = await getWorkUpdates()
  //   const edures = await getEducationUpdates()
  const workres = await fetch(process.env.BACKEND_PATH + '/workrecords', {
    headers: {
      'x-api-key': process.env.API_KEY,
    },
  })
  const edures = await fetch(process.env.BACKEND_PATH + '/educationrecords', {
    headers: {
      'x-api-key': process.env.API_KEY,
    },
  })

  const work = await workres.json()
  const edu = await edures.json()

  return { props: { work, edu } }
}

export default UsersRoute
