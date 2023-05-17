import { createContext, useState, useEffect } from 'react'
import { _getFetcher } from '../helpers/fetchHelpers'
import { craftUrl } from '../helpers/urlHelper'

export const Location_data = createContext({
  locationData: null,
  setLocationData: () => null,
})

function LocationContext({ children }) {
  const [locationData, setLocationData] = useState()

  useEffect(() => {
    let data = {}
    _getFetcher({ cities: craftUrl(['cities']) }).then(({ cities }) => {
      cities.data.forEach((city) => {
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
