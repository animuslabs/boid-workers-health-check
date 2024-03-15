import { TRPCHistoryDeltasClient } from "trpc/trpc"
import { DeltasDataItem } from "types/types"

  function getDateRange() {
    const today = new Date();
    const toDate = new Date(today);
    toDate.setDate(toDate.getDate() - 1); // Yesterday
    const fromDate = new Date(toDate);
    fromDate.setDate(fromDate.getDate() - 6); // 7 days ago from yesterday
  
    // Formatting dates as 'YYYY-MM-DD'
    const format = (date) => date.toISOString().split('T')[0];
  
    return { from: format(fromDate), to: format(toDate) };
  }
 

  export async function fetchGetDeltasBoidIDData(boid_id: string, url: string, endpointName: string): Promise<DeltasDataItem[]> {
    const trpcHistoryDeltasClient = new TRPCHistoryDeltasClient(url).getClient();
    const { from, to } = getDateRange();
  
    try {
      const data = await trpcHistoryDeltasClient.GetDeltasBoidID.query({ boid_id, from, to });
      if (data.length === 0) {
        throw new Error(`No history user data returned from ${endpointName} (${url}) in the date range: ${from} to ${to}. There might be an issue with getting data in this range.`);
      }
      return data;
    } catch (error: any) {
      console.error(`Error fetching history deltas from ${endpointName} (${url}):`, error);
      throw new Error(`Error fetching history deltas from ${endpointName} (${url}): ${error.message}`);
    }
  }
