export interface AdditionalType {
    accountMeta?:Record<string, unknown>
    teamMeta?:Record<string, unknown>
  }

export interface DeltasDataItem {
    timeStamp:string;
    boid_id:string;
    balance:number;
    selfStaked:number;
    power:number;
    receivedDelegatedStake:number;
  }