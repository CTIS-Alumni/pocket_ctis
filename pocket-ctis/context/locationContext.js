import { createContext, useState, useEffect } from 'react'
import { fetchAllCities } from '../helpers/searchHelpers'

export const Location_data = createContext(null)

function LocationContext({ children }) {
  const [locationData, setLocationData] = useState()

  useEffect(() => {
    let data = {}
    fetchAllCities().then((res) => {
      res.data.forEach((city) => {
        if (`${city.country_id}-${city.country_name}` in data) {
          data[`${city.country_id}-${city.country_name}`].push(
            `${city.id}-${city.city_name}`
          )
        } else {
          data[`${city.country_id}-${city.country_name}`] = [
            `${city.id}-${city.city_name}`,
          ]
        }
      })
    })
    setLocationData(data)
  }, [])

  return (
    <Location_data.Provider value={{ locationData, setLocationData }}>
      {children}
    </Location_data.Provider>
  )
}

export default LocationContext
