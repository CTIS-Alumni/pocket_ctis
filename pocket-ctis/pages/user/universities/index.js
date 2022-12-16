const UniversitiesList = ({ universities }) => {
  console.log('universities', universities)
  return <div>UniversitiesList</div>
}

export async function getServerSideProps() {
  const res = await fetch('http://localhost:3000/api/educationinstitutes')
  const universities = await res.json()
  return { props: { universities } }
}
export default UniversitiesList
