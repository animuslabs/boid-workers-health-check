import axios from 'axios'
import config from "../../.env.json"

export async function checkRPCEndpoints() {
    const currentTime = new Date();
    let errors: string[] = [];
    for (const rpc of config.ChainRPCs) {
      try {
        const response = await axios.get(`${rpc.url}/v1/chain/get_info`);
        const headBlockTime = new Date(response.data.head_block_time);
  
        // Calculate the difference in seconds between now and the head block time
        const timeDiffInSeconds = (currentTime.getTime() - headBlockTime.getTime()) / 1000;
  
        if (timeDiffInSeconds > 30) {
          console.error(`${rpc.name} head_block_time is older than 30 seconds.`);
          errors.push(`${rpc.name} head_block_time is older than 30 seconds.`);
        } else {
          console.log(`${rpc.name} responded successfully and is up to date.`);
        }
      } catch (error) {
        console.error(`${rpc.name} failed to respond.`);
        errors.push(`${rpc.name} failed to respond.`);
      }
    }
    if (errors.length > 0) {
      throw new Error(errors.join('\n'));
  }}
  