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

export const getWorkTimePeriod = (start_date, end_date, is_current) => {
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
    let now = new Date()
    months = now.getMonth() - rawStartDate.getMonth()
    years = now.getFullYear() - rawStartDate.getFullYear()
    return `${startDate} - ${endDate} | ${years} yrs ${months} months`
  } else if (start_date) {
    return `Started at: ${startDate}`
  } else if (end_date) {
    return `Ended at: ${endDate}`
  } else {
    return null
  }
}
