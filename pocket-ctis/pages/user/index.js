import React from 'react'
import NavigationBar from '../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../components/UserInfoSidebar/UserInfoSidebar'
import UsersInfoPanel from '../../components/UsersInfoPanel/UsersInfoPanel'

const UsersRoute = ({work, edu}) => {
    console.log('work:', work)
  return (
    <main>
        <NavigationBar />
        <UserInfoSidebar />
        <UsersInfoPanel work = {work} edu = { edu }/>
    </main>
  )
}

//call API, using getServerSideProps. This will be called before the page is served to the frontend
//the result will be added to props object, which will be added to the corresponding component.
export async function getServerSideProps() {
  const workres = await fetch('http://localhost:3000/api/workrecords');
  const edures = await fetch('http://localhost:3000/api/educationrecords');
  const { work } = await workres.json();
  const { edu } = await edures.json();
  return { props: { work, edu } };
}

export default UsersRoute
