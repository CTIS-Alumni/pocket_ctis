import { createContext, useEffect, useState } from 'react'
import { _getFetcher } from '../helpers/fetchHelpers'
import { craftUrl } from '../helpers/urlHelper'
import { useRouter } from 'next/navigation'

export const User_data = createContext({
  userData: null,
  setUserData: () => null,
  refreshProfile: () => null,
})

function UserContext({ children }) {
  const [userData, setUserData] = useState(null)
  const router = useRouter()
  useEffect(() => {
    if (userData == null) {
      _getFetcher({ res: craftUrl(['basic_info']) })
        .then((res) => {
          if ((res.res.error || res.errors))
            console.log(res.errors);
            //router.push('/login')
          else setUserData(res.res.data[0])
        })
        .catch((err) => console.log('err in user context', err))
    }
  }, [])

  const refreshProfile = () => {
    _getFetcher({ res: craftUrl(['basic_info']) })
    .then((res) => {
      if (res.res.error || res.errors )
        console.log(res.errors);
        //router.push('/login')
      else setUserData(res.res.data[0])
    })
    .catch((err) => console.log(err)) 
  }

  return (
    <User_data.Provider
      value={{
        userData: userData,
        setUserData: setUserData,
        refreshProfile: refreshProfile,
      }}
    >
      {children}
    </User_data.Provider>
  )
}

export default UserContext
