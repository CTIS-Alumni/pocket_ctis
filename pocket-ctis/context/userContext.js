import {createContext, useEffect, useState} from 'react'
import {_getFetcher} from "../helpers/fetchHelpers";
import {craftUrl} from "../helpers/urlHelper";
import {redirect} from "next/navigation";

export const User_data = createContext(null)

function UserContext({ children }) {
  const [userData, setUserData] = useState()

  useEffect(() => {
    console.log(userData)
    if (userData == null) {
      _getFetcher({res: craftUrl(['basic_info'])} ).then((res) => {
        console.log(res);
        if(res.errors || (res.data && !res.data.length))
          redirect('/login')
        else setUserData(res.data[0])
      }).catch((err) => console.log(err))

    }
  }, [])

  return (
    <User_data.Provider value={{ userData, setUserData }}>
      {children}
    </User_data.Provider>
  )
}

export default UserContext
