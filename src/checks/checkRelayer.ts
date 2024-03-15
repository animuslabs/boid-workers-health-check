import { Name, PrivateKey, UInt8, UInt32, Action, AnyAction, Serializer } from "@wharfkit/antelope"
import config from "../../.env.json"
import { abi, Types } from "../types/boid.contract.types"
import { TRPCRelayerClient } from "../trpc/trpc"
import { AdditionalType } from "../types/types"
import { toObject } from "../reuseFunctions"

async function signActions(privKey:PrivateKey, actions:AnyAction[], nonce:UInt8, expires_utc_sec:UInt32) { 
  const message = Serializer.encode({ object: actions, abi, type: "Action[]" }) 
  const nonceBytes = Serializer.encode({ type: UInt8, object: nonce })
  const expiresBytes = Serializer.encode({ type: UInt32, object: expires_utc_sec })
  const chainNameBytes = Serializer.encode({ type: Name, object: config.chainData.chainName })
  message.append(nonceBytes)
  message.append(expiresBytes)
  message.append(chainNameBytes)
  const sig = privKey.signMessage(message.array)
  return sig
}

function createAct(name:string, data:Record<string, any> = {}, account = config.contracts.system, auth = [{ actor: config.contracts.system, permission: "active" }]) {
    return Action.from({ account, name, authorization: auth, data })
  }

  const sysActions = {
    buyInvites: () => {
      // Check if the configuration and necessary fields are loaded correctly
      if (!config || !config.testerID || !config.testerID.boid_id) {
        console.error("Configuration error: 'boid_id' is missing or undefined in 'testerID'. Please check your configuration.");
        return; // Return undefined to indicate failure
      }
  
      try {
        const inviteBuyAction = Types.invitebuy.from({
          boid_id: config.testerID.boid_id, 
          quantity: 1
        });
  
        // If action creation was successful, proceed to create the act
        return createAct("invite.buy", inviteBuyAction);
      } catch (error) {
        console.error("Error creating 'invite.buy' action:", error);
        throw error;
      }
    },
  };

  

async function sendAuthActions(actions:AnyAction[],  url:string, additional?:AdditionalType) {
    try {
      const boid_id = config.testerID.boid_id
      const key = PrivateKey.fromString(config.testerID.key_private)
      const keyIndex = 0
      const nonce = UInt8.from(0)
      const expirest_at = Date.now() / 1000 + 10
      const expires = UInt32.from(expirest_at)
      const signature = await signActions(key, actions, nonce, expires)
      const body = {
        actions: actions as any,
        boid_id,
        keyIndex,
        sig: signature.toString(),
        expires_utc_sec: expirest_at,
        additional
      }
      const trpcRelayerClient = new TRPCRelayerClient(url).getClient();
      const result = await trpcRelayerClient.pushActions.mutate(body)
      return result
    } catch (error:any) {
      console.error("Error from sendAuthActions: ", toObject(error))
      return error
    }
  }
  
export async function checkRelayerSendAuthActions() {
  const actions = [sysActions.buyInvites()] as Types.Action[];
  const additional: AdditionalType = {};
  let errors: any[] = []; // Renamed to reflect that we're only interested in errors

  for (const relayer of config.relayers) {
      console.log(`Sending actions to ${relayer.name}: ${relayer.url}`);
      try {
          const result = await sendAuthActions(actions, relayer.url, additional);
          
          // Check if the result indicates a 'TRPCClientError' or any other error condition
          if (result.name === 'TRPCClientError' ) {
              console.error(`${relayer.name} error:`, JSON.stringify(result, null, 2));
              errors.push({ name: relayer.name, url: relayer.url, error: "TRPCClientError" });
          } else {
              // Log success, but do not add to the errors array
              console.log(`${relayer.name} success:`, JSON.stringify(result, null, 2));
          }
      } catch (error: any) {
          console.error(`${relayer.name} error:`, error);
          errors.push({ name: relayer.name, url: relayer.url, error: error.message || "TRPCClientError" });
      }
  }

  // Return only the errors
  return errors;
} 
  
