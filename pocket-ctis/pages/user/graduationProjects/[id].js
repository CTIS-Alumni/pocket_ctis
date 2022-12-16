import React from 'react'

const GraduationProject = ({ graduationproject }) => {
  console.log('Graduation project: ', graduationproject)
  return <div>GraduationProject</div>
}

export async function getServerSideProps(context) {
  const res = await fetch(
    'http://localhost:3000/api/graduationprojects/' + context.params.id
  )
  const graduationproject = await res.json()
  return { props: { graduationproject } }
}
export default GraduationProject
