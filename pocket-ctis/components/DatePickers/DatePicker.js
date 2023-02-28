import { useField, useFormikContext } from 'formik'
import DatePicker from 'react-date-picker/dist/entry.nostyle'

/*
for datepicker documentation, refer to https://github.com/wojtekmaj/react-date-picker 
for calender documentation, refer to https://github.com/wojtekmaj/react-calendar#props

Since next js does not allow styles from node_modules to be leveraged 
  (refer to https://nextjs.org/docs/messages/css-npm )
to solve this issue, the .nostyle version of DatePicker was imported.

the styles were copied (from the node_modules of react-calender and react-date-picker) and
added to /styles direcctory as global, and imported on _app.js

for any changes in styles, YOU can directly make changes to /styles/DatePicker.css

tl,dr; to avoid error when opening calender, make sure the value passed is of datatype Date and not string
*/

export const DatePickerField = ({ ...props }) => {
  const { setFieldValue } = useFormikContext()
  const [field] = useField(props)
  return (
    <DatePicker
      {...field}
      {...props}
      selected={(field.value && new Date(field.value)) || null}
      onChange={(val) => {
        setFieldValue(field.name, val)
      }}
    />
  )
}

export default DatePickerField
