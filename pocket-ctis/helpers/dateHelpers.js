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

export const getWorkTimePeriod = (start_date, end_date) => {
  const rawStartDate = new Date(start_date)
  const startDate =
    monthNames[rawStartDate.getUTCMonth()] + ' ' + rawStartDate.getFullYear()

  const rawEndDate = new Date(end_date)
  let endDate, months, years
  if (end_date) {
    endDate =
      monthNames[rawEndDate.getUTCMonth()] + ' ' + rawEndDate.getFullYear()
    months = rawEndDate.getMonth() - rawStartDate.getMonth()
    years = rawEndDate.getFullYear() - rawStartDate.getFullYear()
  } else {
    endDate = 'Present'
    let now = new Date()
    months = now.getMonth() - rawStartDate.getMonth()
    years = now.getFullYear() - rawStartDate.getFullYear()
  }

  return `${startDate} - ${endDate} | ${years} yrs ${months} months`
}
