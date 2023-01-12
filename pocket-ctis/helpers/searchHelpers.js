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

export const fetchSectors = async (search) => {
  const res = await fetch(
      `http://localhost:3000/api/sectors?name=${search}`,
      {
        headers: {
          'x-api-key': 'SOMESECRETKEYWENEEDTOPUTHERE',
        },
      }
  )
  const { sectors } = await res.json()
  return sectors
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
export const fetchInternshipRecords = async () => {
  const res = await fetch('http://localhost:3000/api/internship', {
    headers: {
      'x-api-key': 'SOMESECRETKEYWENEEDTOPUTHERE',
    },
  })
  const data = await res.json()
  return data
}

export const fetchUserWorkRecords = async (id) => {
  const res = await fetch(
    'http://localhost:3000/api/users/' + id + '/workrecords',
    {
      headers: {
        'x-api-key': 'SOMESECRETKEYWENEEDTOPUTHERE',
      },
    }
  )
  const { data } = await res.json()
  return data
}
export const fetchUserEduRecords = async (id) => {
  const res = await fetch(
    'http://localhost:3000/api/users/' + id + '/educationrecords',
    {
      headers: {
        'x-api-key': 'SOMESECRETKEYWENEEDTOPUTHERE',
      },
    }
  )
  const { data } = await res.json()
  return data
}
export const fetchUserSocials = async (id) => {
  const res = await fetch(
    'http://localhost:3000/api/users/' + id + '/usersocialmedia',
    {
      headers: {
        'x-api-key': 'SOMESECRETKEYWENEEDTOPUTHERE',
      },
    }
  )
  const { data } = await res.json()
  return data
}
export const fetchUserPhone = async (id) => {
  const res = await fetch(
    'http://localhost:3000/api/users/' + id + '/phonenumbers',
    {
      headers: {
        'x-api-key': 'SOMESECRETKEYWENEEDTOPUTHERE',
      },
    }
  )
  const { data } = await res.json()
  return data
}
export const fetchUserSkills = async (id) => {
  const res = await fetch(
    'http://localhost:3000/api/users/' + id + '/userskills',
    {
      headers: {
        'x-api-key': 'SOMESECRETKEYWENEEDTOPUTHERE',
      },
    }
  )
  const { data } = await res.json()
  return data
}
export const fetchUserCertificates = async (id) => {
  const res = await fetch(
    'http://localhost:3000/api/users/' + id + '/certificates',
    {
      headers: {
        'x-api-key': 'SOMESECRETKEYWENEEDTOPUTHERE',
      },
    }
  )
  const { data } = await res.json()
  return data
}
export const fetchUserEmail = async (id) => {
  const res = await fetch(
    'http://localhost:3000/api/users/' + id + '/emailaddress',
    {
      headers: {
        'x-api-key': 'SOMESECRETKEYWENEEDTOPUTHERE',
      },
    }
  )
  const { data } = await res.json()
  return data
}
export const fetchUserErasmus = async (id) => {
  const res = await fetch(
    'http://localhost:3000/api/users/' + id + '/erasmus',
    {
      headers: {
        'x-api-key': 'SOMESECRETKEYWENEEDTOPUTHERE',
      },
    }
  )
  const { data } = await res.json()
  return data
}
export const fetchUserLocation = async (id) => {
  const res = await fetch(
    'http://localhost:3000/api/users/' + id + '/location',
    {
      headers: {
        'x-api-key': 'SOMESECRETKEYWENEEDTOPUTHERE',
      },
    }
  )
  const { data } = await res.json()
  return data
}
export const fetchUserWantSectors = async (id) => {
  const res = await fetch(
    'http://localhost:3000/api/users/' + id + '/userwantsector',
    {
      headers: {
        'x-api-key': 'SOMESECRETKEYWENEEDTOPUTHERE',
      },
    }
  )
  const { data } = await res.json()
  return data
}
export const fetchUserSocieties = async (id) => {
  const res = await fetch(
    'http://localhost:3000/api/users/' + id + '/userstudentsocieties',
    {
      headers: {
        'x-api-key': 'SOMESECRETKEYWENEEDTOPUTHERE',
      },
    }
  )
  const { data } = await res.json()
  return data
}
export const fetchUserCareerObjectives = async (id) => {
  const res = await fetch(
    'http://localhost:3000/api/users/' + id + '/careerobjective',
    {
      headers: {
        'x-api-key': 'SOMESECRETKEYWENEEDTOPUTHERE',
      },
    }
  )
  const { data } = await res.json()
  return data
}
export const fetchProfilePicture = async (id) => {
  const res = await fetch(
    'http://localhost:3000/api/users/' + id + '/profilepicture',
    {
      headers: {
        'x-api-key': 'SOMESECRETKEYWENEEDTOPUTHERE',
      },
    }
  )
  const { data } = await res.json()
  return data
}
export const fetchUserInternships = async (id) => {
  const res = await fetch(
    'http://localhost:3000/api/users/' + id + '/internships',
    {
      headers: {
        'x-api-key': 'SOMESECRETKEYWENEEDTOPUTHERE',
      },
    }
  )
  const { data } = await res.json()
  return data
}
export const fetchUserHighSchool = async (id) => {
  const res = await fetch(
    'http://localhost:3000/api/users/' + id + '/highschool',
    {
      headers: {
        'x-api-key': 'SOMESECRETKEYWENEEDTOPUTHERE',
      },
    }
  )
  const { data } = await res.json()
  return data
}
