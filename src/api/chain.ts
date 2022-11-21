import { NotifyType, Tx, useChurchTxStore } from 'npool-cli-v4'

const tx = useChurchTxStore()
export const getTxs = (offset : number, limit: number) => {
  tx.getTxs({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_COINS',
        Message: 'MSG_GET_COINS_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean, txs: Array<Tx>) => {
    if (error || txs.length < limit) {
      return
    }
    getTxs(offset + limit, limit)
  })
}
