export const fetchUsers = async (search) => {
  const res = await fetch(`http://localhost:3000/api/users?name=${search}`, {
    headers: {
      'x-api-key': 'SOMESECRETKEYWENEEDTOPUTHERE',
    },
  })
  const { users } = await res.json()
  return users
}

export const fetchHighSchools = async (search) => {
  const res = await fetch(
    `http://localhost:3000/api/highschools?name=${search}`,
    {
      headers: {
        'x-api-key': 'SOMESECRETKEYWENEEDTOPUTHERE',
      },
    }
  )
  const { highschools } = await res.json()
  return highschools
}

export const fetchCompany = async (search) => {
  const res = await fetch(
    `http://localhost:3000/api/companies?name=${search}`,
    {
      headers: {
        'x-api-key': 'SOMESECRETKEYWENEEDTOPUTHERE',
      },
    }
  )
  const { companies } = await res.json()
  return companies
}

export const fetchEduinst = async (search) => {
  const res = await fetch(
    `http://localhost:3000/api/educationinstitutes?name=${search}`,
    {
      headers: {
        'x-api-key': 'SOMESECRETKEYWENEEDTOPUTHERE',
      },
    }
  )
  const { educationinstitutes } = await res.json()
  return educationinstitutes
}

export const fetchGraduationproject = async (search) => {
  const res = await fetch(
    `http://localhost:3000/api/graduationprojects?name=${search}`,
    {
      headers: {
        'x-api-key': 'SOMESECRETKEYWENEEDTOPUTHERE',
      },
    }
  )
  const { gradprojects } = await res.json()
  return gradprojects
}

export const fetchPeoplWorkingInSector = async (sectorId) => {
  const resPeople = await fetch(
    'http://localhost:3000/api/workrecords?worksector_id=' + sectorId,
    {
      headers: {
        'x-api-key': 'SOMESECRETKEYWENEEDTOPUTHERE',
      },
    }
  )
  const { work } = await resPeople.json()
  return work
}

export const fetchCompaniesInSector = async (sectorId) => {
  const resCompanies = await fetch(
    'http://localhost:3000/api/companies?sector_id=' + sectorId,
    {
      headers: {
        'x-api-key': 'SOMESECRETKEYWENEEDTOPUTHERE',
      },
    }
  )
  const { companies } = await resCompanies.json()
  return companies
}

export const fetchAllCompanies = async () => {
  const res = await fetch('http://localhost:3000/api/companies', {
    headers: {
      'x-api-key': 'SOMESECRETKEYWENEEDTOPUTHERE',
    },
  })
  const { companies } = await res.json()
  return companies
}

export const fetchAllEducationInstitutes = async () => {
  const res = await fetch('http://localhost:3000/api/educationinstitutes', {
    headers: {
      'x-api-key': 'SOMESECRETKEYWENEEDTOPUTHERE',
    },
  })
  const { educationinstitutes } = await res.json()
  return educationinstitutes
}

export const fetchAllSkillTypes = async () => {
  const res = await fetch('http://localhost:3000/api/skilltypes', {
    headers: {
      'x-api-key': 'SOMESECRETKEYWENEEDTOPUTHERE',
    },
  })
  const { data } = await res.json()
  return data
}

export const fetchAllHighSchool = async () => {
  const res = await fetch('http://localhost:3000/api/highschools', {
    headers: {
      'x-api-key': 'SOMESECRETKEYWENEEDTOPUTHERE',
    },
  })
  const { highschools } = await res.json()
  return highschools
}

export const fetchAllDegreeTypes = async () => {
  const res = await fetch('http://localhost:3000/api/degreetypes', {
    headers: {
      'x-api-key': 'SOMESECRETKEYWENEEDTOPUTHERE',
    },
  })
  const { data } = await res.json()
  return data
}
export const fetchAllSocieties = async () => {
  const res = await fetch('http://localhost:3000/api/studentsocieties', {
    headers: {
      'x-api-key': 'SOMESECRETKEYWENEEDTOPUTHERE',
    },
  })
  const { data } = await res.json()
  return data
}

export const fetchPeopleWantingToWorkInSector = async (sectorId) => {
  const resPeopleWanting = await fetch(
    'http://localhost:3000/api/users?wantsector_id=' + sectorId,
    {
      headers: {
        'x-api-key': 'SOMESECRETKEYWENEEDTOPUTHERE',
      },
    }
  )
  const { users } = await resPeopleWanting.json()
  return users
}

export const fetchErasmusUniversities = async () => {
  const res = await fetch(
    'http://localhost:3000/api/educationinstitutes?erasmus=1',
    {
      headers: {
        'x-api-key': 'SOMESECRETKEYWENEEDTOPUTHERE',
      },
    }
  )
  const { educationinstitutes } = await res.json()
  return educationinstitutes
}
export const fetchInternshipCompanies = async () => {
  const res = await fetch('http://localhost:3000/api/companies?internship=1', {
    headers: {
      'x-api-key': 'SOMESECRETKEYWENEEDTOPUTHERE',
    },
  })
  const { companies } = await res.json()
  return companies
}
export const fetchErasmusRecords = async () => {
  const res = await fetch('http://localhost:3000/api/erasmus', {
    headers: {
      'x-api-key': 'SOMESECRETKEYWENEEDTOPUTHERE',
    },
  })
  const { data } = await res.json()
  return data
}

export const fetchProfile = async (id) => {
  const res = await fetch(
      'http://localhost:3000/api/users/' + id + '/profile',
      {
        headers: {
          'x-api-key': 'SOMESECRETKEYWENEEDTOPUTHERE',
        },
      }
  )
  const { data, errors } = await res.json();
  return  {data, errors}
}
