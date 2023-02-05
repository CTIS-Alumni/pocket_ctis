export const _getFetcher = async (url) => {
  const res = await fetch(url, {
    headers: {
      'x-api-key': 'SOMESECRETKEYWENEEDTOPUTHERE',
    },
  })
  return await res.json()
}
