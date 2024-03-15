import { TRPCHistoryClient } from "../trpc/trpc"

// Formatting dates as 'YYYY-MM-DD'
const format = (date) => date.toISOString().split('T')[0];
export const actions = ["invite.add", "stake", "unstake.end", "invite.claim", "offer.claim", "unstake.init", "invite.add", "account.edit", "team.change"]


  function getDateRange() {
    const today = new Date();
    const toDate = new Date(today);
    toDate.setDate(toDate.getDate() - 1); // Yesterday
    const fromDate = new Date(toDate);
    fromDate.setDate(fromDate.getDate() - 6); // 7 days ago from yesterday
 
    return { from: fromDate, to: toDate };
  }
  
export async function fetchHistoryActions(actions: string[], url: string, endpointName: string): Promise<any> {
    const trpcHistoryClient = new TRPCHistoryClient(url).getClient();
    const { from, to } = getDateRange();
    try {
      const response = await trpcHistoryClient.actions.query({
        skip: 0,
        sort: 'desc',
        start: from,
        end: to,
        limit: 100,
        actions: actions,
      });
  
      if (response.length === 0) {
        throw new Error(`No actions data returned from ${endpointName} (${url}) in the date range: ${format(from)} to ${format(to)}. There might be an issue with getting data in this range.`);
      }
      return response;
    } catch (error: any) {
      console.error(`Error fetching history actions from ${endpointName} (${url}):`, error);
      throw new Error(`Error fetching history actions from ${endpointName} (${url}): ${error.message}`);
    }
  }
