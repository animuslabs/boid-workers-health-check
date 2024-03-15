import { createTRPCProxyClient, CreateTRPCClientOptions, httpLink, TRPCLink } from "@trpc/client"
import { AnyRouter } from '@trpc/server'
import HRouter from "./trpcHistoryDeltasTypes"
import { AppRouter as HistoryRouter } from "./trpcHistoryTypes"
import { AppRouter as RelayerAppRouter } from "./trpcRelayerTypes"

abstract class BaseTRPCClient<AppRouterType extends AnyRouter> {
  protected client;

  constructor(baseUrl: string) {
    // Define the link explicitly
    const link: TRPCLink<AppRouterType> = httpLink<AppRouterType>({ url: baseUrl });
    
    // Define options with explicit type annotation
    const opts: CreateTRPCClientOptions<AnyRouter> = {
      links: [link], // Use the explicitly defined link here
    };

    this.client = createTRPCProxyClient<AnyRouter>(opts);
  }

  getClient() {
    return this.client;
  }
}

export class TRPCRelayerClient extends BaseTRPCClient<RelayerAppRouter> {
  constructor(baseUrl: string) {
    super(baseUrl);
  }
}
export class TRPCHistoryDeltasClient extends BaseTRPCClient<HRouter.AppRouter> {
  constructor(baseUrl: string) {
    super(baseUrl);
  }
}

export class TRPCHistoryClient extends BaseTRPCClient<HistoryRouter> {
  constructor(baseUrl: string) {
    super(baseUrl);
  }
}