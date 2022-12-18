export const fetchUsers = async (search) => {
  const res = await fetch(`http://localhost:3000/api/users?name=${search}`)
  const { users } = await res.json()
  return users
}

export const fetchHighSchools = async (search) => {
  const res = await fetch(
    `http://localhost:3000/api/highschools?name=${search}`
  )
  const { highschools } = await res.json()
  return highschools
}

export const fetchCompany = async (search) => {
  const res = await fetch(`http://localhost:3000/api/companies?name=${search}`)
  const { companies } = await res.json()
  return companies
}

export const fetchEduinst = async (search) => {
  const res = await fetch(
    `http://localhost:3000/api/educationinstitutes?name=${search}`
  )
  const { educationinstitutes } = await res.json()
  return educationinstitutes
}

export const fetchGraduationproject = async (search) => {
  const res = await fetch(
    `http://localhost:3000/api/graduationprojects?name=${search}`
  )
  const { gradprojects } = await res.json()
  return gradprojects
}
