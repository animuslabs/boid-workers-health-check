import axios from 'axios';
import config from "../../.env.json";

export async function checkIPFSGatewaysForCID() {
  let errors = []; // Collect errors encountered during checks

  for (const gateway of config.IPFSgateways) {
    const url = `${gateway.url}/ipfs/${config.testCID}`;
    try {
      const response = await axios.head(url);
      if (response.status === 200) {
        console.log(`${gateway.name} indicates CID ${config.testCID} is accessible.`);
      } else {
        console.error(`${gateway.name} responded, but CID might not be accessible. Status: ${response.status}`);
        errors.push(`${gateway.name} responded, but CID might not be accessible. Status: ${response.status}` as never);
      }
    } catch (error:any) {
      console.error(`${gateway.name} failed to access CID ${config.testCID}. Error: ${error.message}`);
      errors.push(`${gateway.name} failed to access CID ${config.testCID}. Error: ${error.message}` as never);
    }
  }

  // If there were any errors, concatenate them into a single message and throw as an error
  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }
}