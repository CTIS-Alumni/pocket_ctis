import { useEffect, useState } from 'react'
import { _getFetcher } from '../../helpers/fetchHelpers'
import { buildCondition, craftUrl } from '../../helpers/urlHelper'
import { toast, ToastContainer } from 'react-toastify'
import { Spinner } from 'react-bootstrap'
import AdminPageContainer from '../../components/AdminPanelComponents/AdminPageContainer/AdminPageContainer'
import DataTable from '../../components/DataTable/DataTable'

const EduRec = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState([])
  const [columns, setColumns] = useState([])
  const [total, setTotal] = useState()

  const getData = (
    conditions = [
      { name: 'limit', value: 15 },
      { name: 'offset', value: 0 },
    ]
  ) => {
    setIsLoading(true)
    _getFetcher({ eduRec: craftUrl(['educationrecords'], conditions) })
      .then(({ eduRec }) => {
        console.log(eduRec)
        if (eduRec?.errors?.length > 0) {
          eduRec?.errors.map((e) => toast.error(e.error))
          return
        }
        setTotal(eduRec.length)
        setData(eduRec.data)
      })
      .finally((_) => setIsLoading(false))
  }

  useEffect(() => {
    getData()
    setColumns([
      'id',
      'user_id',
      'user_types',
      'profile_picture',
      'first_name',
      'last_name',
      'edu_inst_id',
      'edu_inst_name',
      'city_name',
      'country_name',
      'degree_type_name',
      'name_of_program',
      'start_date',
      'end_date',
      'is_current',
      'record_date',
    ])
  }, [])

  const onQuery = (queryParams) => {
    const conditions = buildCondition(queryParams)
    getData(conditions)
  }

  return (
    <AdminPageContainer>
      <h4>Education Records</h4>
      <div style={{ position: 'relative', height: '100%' }}>
        {data && columns && (
          <div>
            <DataTable
              data={data}
              columns={columns}
              onQuery={onQuery}
              total={total}
              isLoading={isLoading}
              searchCols='skill_name,skill_type_name'
            />
          </div>
        )}
      </div>
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        draggable
        pauseOnHover
        theme='light'
      />
    </AdminPageContainer>
  )
}

export default EduRec
