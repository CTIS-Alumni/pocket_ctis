import React from 'react'

const GraduationProjectsList = ({ gradProjects }) => {
  console.log('Graduation Projects: ', gradProjects)
  return <div>GraduationProjectsList</div>
}

export async function getStaticProps() {
  const res = await fetch('http://localhost:3000/api/graduationprojects')
  const gradProjects = await res.json()
  return { props: { gradProjects } }
}

export default GraduationProjectsList
