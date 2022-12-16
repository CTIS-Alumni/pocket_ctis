const Company = ({ company }) => {
  console.log(company)
  return <div>Company</div>
}

export async function getServerSideProps(context) {
  const res = await fetch(
    'http://localhost:3000/api/companies/' + context.params.id
  )
  const company = await res.json()
  return { props: { company } }
}

export default Company
