import React from 'react'

const HighSchool = ({ highSchool }) => {
  console.log('High School: ', highSchool)
  return <div>HighSchool</div>
}

export async function getServerSideProps(context) {
  const res = await fetch(
    'http://localhost:3000/api/highschools/' + context.params.id
  )
  const highSchool = await res.json()
  return { props: { highSchool } }
}

export default HighSchool
