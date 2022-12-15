import React from 'react'

const CompaniesList = ({ companies }) => {
  console.log('companies: ', companies)
  return <div>CompaniesList</div>
}

export async function getStaticProps() {
  const res = await fetch('http://localhost:3000/api/companies')
  const companies = await res.json()
  return { props: { companies } }
}

export default CompaniesList
