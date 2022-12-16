import React from 'react'

const InternshipsList = ({ internships }) => {
  console.log('Internships:', internships)
  return <div>InternshipsList</div>
}

export async function getServerSideProps() {
  const res = await fetch('http://localhost:3000/api/internships')
  const internships = await res.json()
  return { props: { internships } }
}
export default InternshipsList
