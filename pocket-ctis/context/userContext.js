import { createContext, useEffect, useState } from 'react'
import { _getFetcher } from '../helpers/fetchHelpers'
import { craftUrl } from '../helpers/urlHelper'
import { redirect } from 'next/navigation'

export const User_data = createContext({
  userData: null,
  setUserData: () => null,
})

function UserContext({ children }) {
  const [userData, setUserData] = useState()

  useEffect(() => {
    if (userData == null) {
      _getFetcher({ res: craftUrl(['basic_info']) })
        .then((res) => {
          if (res.errors || (res.data && !res.data.length)) redirect('/login')
          else setUserData(res.res.data[0])
        })
        .catch((err) => console.log(err))
    }
  }, [])

  return (
    <User_data.Provider
      value={{ userData: userData, setUserData: setUserData }}
    >
      {children}
    </User_data.Provider>
  )
}

export default UserContext
