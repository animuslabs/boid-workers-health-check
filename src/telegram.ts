import { Telegraf } from 'telegraf';
import cron from 'node-cron';
import config from "../.env.json"
import {fetchHistoryActions, actions} from "./checks/checkHistory"
import {fetchGetDeltasBoidIDData} from "./checks/checkHistoryDeltas"
import { checkIPFSGatewaysForCID } from "./checks/checkIPFSgateways"
import { checkRelayerSendAuthActions } from "./checks/checkRelayer"
import { checkRPCEndpoints } from "./checks/checkRPCendpoints"

const bot = new Telegraf(config.bot_token);
const channelUsername = config.channel_username;

// Welcome message and invite to the channel
bot.start((ctx) => {
  ctx.reply('Welcome! Press the button below to subscribe to our Boid Workers Health updates.', {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Subscribe to Updates', url: `https://t.me/${channelUsername.substring(1)}` }]
      ]
    }
  });
});

// Start bot
bot.launch(() => {
  console.log('Boid Health Check Bot is running!');
});


// Function to format the message with the endpoints that are being checked
function formatEndpointsMessage(): string {
    let message = "I'm still running! There are no errors! Boid Workers health service is checking:\n";
  
    const addEndpoints = (title: string, endpoints: Array<{ name: string; url: string }>) => {
      const endpointStrings = endpoints.map(endpoint => `${endpoint.name}: ${endpoint.url}`);
      message += `- ${title} -\n  ${endpointStrings.join('\n  ')}\n`;
    };
  
    addEndpoints("Relayer Endpoints", config.relayers);
    addEndpoints("Boid History Endpoints", config.history);
    addEndpoints("Boid Charts Historical Data Endpoints", config.historyDeltas);
    addEndpoints("IPFS Gateway Endpoints", config.IPFSgateways);
    addEndpoints("Telos Mainnet API Endpoints", config.ChainRPCs);
  
    return message;
  }
  
  // Send the message to the channel every day at 15:00 UTC
cron.schedule('0 15 * * *', () => {
    const message = formatEndpointsMessage();
    bot.telegram.sendMessage(channelUsername, message);
  }, {
    scheduled: true,
    timezone: "UTC"
  });

// check endpoints every 15 minutes
cron.schedule('*/15 * * * *', async () => {
  // Sequentially process history actions
  for (const { name, url } of config.history) {
    try {
      await fetchHistoryActions(actions, url, name);
    } catch (error:any) {
      bot.telegram.sendMessage(channelUsername, error.message);
    }
  }
  // Sequentially process history deltas
  for (const { name, url } of config.historyDeltas) {
    try {
      const data = await fetchGetDeltasBoidIDData("seth.voice", `${url}/api/`, name);
      console.log(`${name} data:`, data);
    } catch (error:any) {
      bot.telegram.sendMessage(channelUsername, error.message);
    }
  }
  // Execute checkIPFSGatewaysForCID function
  try {
    await checkIPFSGatewaysForCID();
  } catch (error:any) {
    bot.telegram.sendMessage(channelUsername, error.message);
  }

  // Execute checkRelayerSendAuthActions function
  try {
    const errors = await checkRelayerSendAuthActions();
    if (errors && errors.length > 0) {
      const errorMessage = errors.map(error => `${error.name} (${error.url}): ${error.error}`).join('\n');
      bot.telegram.sendMessage(channelUsername, `Errors encountered: \n${errorMessage}`);
    }
  } catch (error:any) {
    bot.telegram.sendMessage(channelUsername, `An unexpected error occurred: ${error.toString()}`);
  }

  // Execute checkRPCEndpoints function
  try {
    await checkRPCEndpoints();
  } catch (error:any) {
    bot.telegram.sendMessage(channelUsername, error.message);
  }

}, {
  scheduled: true,
  timezone: "UTC"
});