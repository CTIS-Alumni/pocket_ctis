import { useEffect, useState } from 'react'
import AdminPageContainer from '../../components/AdminPanelComponents/AdminPageContainer/AdminPageContainer'
import { _getFetcher } from '../../helpers/fetchHelpers'
import { craftUrl, buildCondition } from '../../helpers/urlHelper'
import { toast, ToastContainer } from 'react-toastify'
import DataTable from '../../components/DataTable/DataTable'

const WorkRec = () => {
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
    _getFetcher({ workRes: craftUrl(['workrecords'], conditions) })
      .then(({ workRes }) => {
        console.log(workRes)
        if (workRes?.errors?.length > 0) {
          workRes?.errors.map((e) => toast.error(e.error))
          return
        }
        setTotal(workRes.length)
        setData(workRes.data)
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
      'company_id',
      'company_name',
      'work_type_name',
      'department',
      'position',
      'city_id',
      'city_name',
      'country_id',
      'country_name',
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
      <h4>Work Records</h4>
      <div style={{ position: 'relative', height: '100%' }}>
        {data && columns && (
          <div>
            <DataTable
              data={data}
              columns={columns}
              onQuery={onQuery}
              total={total}
              isLoading={isLoading}
              searchCols=''
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

export default WorkRec
