import { tx, notify } from 'src/npoolstore'

const _tx = tx.useTxStore()
export const getTxs = (offset : number, limit: number) => {
  _tx.getTxs({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_COINS',
        Message: 'MSG_GET_COINS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, txs: Array<tx.Tx>) => {
    if (error || txs.length === 0) {
      return
    }
    getTxs(offset + limit, limit)
  })
}
