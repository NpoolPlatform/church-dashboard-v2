import { useChurchAPIStore } from 'src/teststore/apis'
import { API } from 'src/teststore/apis/types'

const api = useChurchAPIStore()
export const getAPIs = (offset: number, limit: number) => {
  api.getAPIs({
    Exported: true,
    Depracated: false,
    Offset: offset,
    Limit: limit,
    Message: {}
  }, (error: boolean, rows: Array<API>) => {
    if (error || rows.length < limit) {
      return
    }
    getAPIs(offset + limit, limit)
  })
}

export const updateAPI = (row: API, done: (error: boolean) => void) => {
  api.updateAPI({
    ID: row.ID,
    Depracated: row.Depracated,
    Message: {
    }
  }, (error: boolean) => {
    done(error)
  })
}
