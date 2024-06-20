import { gqlApi } from '~/helpers/axiosConfig';

export default {
  getMetrics: async () => gqlApi.post('', {
      query: `
        query Metrics {
          infra {
            usersCount
            teamsCount
            teamRequestsCount
            teamCollectionsCount
          }
        }
      `       
  })
};