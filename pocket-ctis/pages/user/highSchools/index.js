import React from 'react'

const HighSchoolList = ({ highSchools }) => {
  console.log('high schools: ', highSchools)
  return <div>HighSchoolList</div>
}

export async function getStaticProps() {
  const res = await fetch('http://localhost:3000/api/highschools')
  const highSchools = await res.json()
  return { props: { highSchools } }
}

export default HighSchoolList
