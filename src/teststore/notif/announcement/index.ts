import { defineStore } from 'pinia'
import { API } from './const'
import {
  Announcement,
  GetNAppAnnouncementsRequest,
  GetNAppAnnouncementsResponse
} from './types'
import { doActionWithError } from 'npool-cli-v4'

export const useChurchAnnouncementStore = defineStore('church-announcement-v4', {
  state: () => ({
    Announcements: {
      Announcements: new Map<string, Array<Announcement>>(),
      Total: 0
    }
  }),
  getters: {
    getAnnouncementByAppID () {
      return (appID: string) => {
        const rows = this.Announcements.Announcements.get(appID)
        return !rows ? [] as Array<Announcement> : rows
      }
    }
  },
  actions: {
    getAppAnnouncements (req: GetNAppAnnouncementsRequest, done: (error: boolean, rows: Array<Announcement>) => void) {
      doActionWithError<GetNAppAnnouncementsRequest, GetNAppAnnouncementsResponse>(
        API.GET_N_APP_ANNOUNCEMENTS,
        req,
        req.Message,
        (resp: GetNAppAnnouncementsResponse): void => {
          const rows = this.getAnnouncementByAppID(req.TargetAppID)
          rows.push(...resp.Infos)
          this.Announcements.Announcements.set(req.TargetAppID, rows)
          this.Announcements.Total = resp.Total
          done(false, resp.Infos)
        }, () => {
          done(true, [] as Array<Announcement>)
        }
      )
    }
  }
})
