import { createContext, useState } from 'react'

export const User_data = createContext(null)

function Context({ children }) {
  const [userData, setUserData] = useState()

  return (
    <User_data.Provider value={{ userData, setUserData }}>
      {children}
    </User_data.Provider>
  )
}

export default Context
