export const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

export const getTimePeriod = (start_date, end_date, is_current = false) => {
  const rawStartDate = new Date(start_date)
  const rawEndDate = new Date(end_date)
  const startDate =
    monthNames[rawStartDate.getUTCMonth()] + ' ' + rawStartDate.getFullYear()
  const endDate =
    monthNames[rawEndDate.getUTCMonth()] + ' ' + rawEndDate.getFullYear()

  let months, years

  if (is_current == 1) {
    if (start_date) {
      let now = new Date()
      months = now.getMonth() - rawStartDate.getMonth()
      years = now.getFullYear() - rawStartDate.getFullYear()
      return `${startDate} - Present | ${years} yrs ${months} months`
    } else {
      return `Present`
    }
  } else if (start_date && end_date) {
    months = rawEndDate.getMonth() - rawStartDate.getMonth() + 1
    years = rawEndDate.getFullYear() - rawStartDate.getFullYear()
    if (months < 0) {
      months += 12
      years -= 1
    }
    return `${startDate} - ${endDate} | ${
      years > 0 ? `${years} yrs` : ''
    } ${months} months`
  } else if (start_date) {
    return `Started at: ${startDate}`
  } else if (end_date) {
    return `Ended at: ${endDate}`
  } else {
    return null
  }
}

export const getSemester = (semester, start_date) => {
  const rawStartDate = new Date(start_date)
  if (start_date) {
    const startYear = rawStartDate.getFullYear()
    return `${semester} - ${startYear}`
  } else {
    return `${semester}`
  }
}

export const getProfilePicturePath = (visibility = 0, fileName = null) => {
  if (fileName && visibility == 1) {
    return '/profilepictures/' + fileName + '.png'
  } else {
    return '/profilepictures/defaultUser.png'
  }
}
