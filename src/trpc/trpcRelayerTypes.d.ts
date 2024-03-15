declare const appRouter:import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
    ctx:object;
    meta:object;
    errorShape:import("@trpc/server").DefaultErrorShape;
    transformer:import("@trpc/server").DefaultDataTransformer;
}>, {
    claimInvite:import("@trpc/server").BuildProcedure<"mutation", {
        _config:import("@trpc/server").RootConfig<{
            ctx:object;
            meta:object;
            errorShape:import("@trpc/server").DefaultErrorShape;
            transformer:import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta:object;
        _ctx_out:object;
        _input_in:{
            invite_code:number;
            sponsor_boid_id:string;
            new_account:{
                keys:string[];
                boid_id:string;
                owners:string[];
            };
            sig:string;
        };
        _input_out:{
            invite_code:number;
            sponsor_boid_id:string;
            new_account:{
                keys:string[];
                boid_id:string;
                owners:string[];
            };
            sig:string;
        };
        _output_in:typeof import("@trpc/server").unsetMarker;
        _output_out:typeof import("@trpc/server").unsetMarker;
    }, import("../lib/eosio.js").DoActionResponse | null>;
    pushActions:import("@trpc/server").BuildProcedure<"mutation", {
        _config:import("@trpc/server").RootConfig<{
            ctx:object;
            meta:object;
            errorShape:import("@trpc/server").DefaultErrorShape;
            transformer:import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta:object;
        _ctx_out:object;
        _input_in:{
            additional?:{
                accountMeta?:{} | undefined;
                teamMeta?:{} | undefined;
            } | undefined;
            boid_id:string;
            actions:[{
                data?:any;
                account:string;
                name:string;
                authorization:any[];
            }, ...{
                data?:any;
                account:string;
                name:string;
                authorization:any[];
            }[]];
            sig:string;
            keyIndex:number;
            expires_utc_sec:number;
        };
        _input_out:{
            additional?:{
                accountMeta?:{} | undefined;
                teamMeta?:{} | undefined;
            } | undefined;
            boid_id:string;
            actions:[{
                data?:any;
                account:string;
                name:string;
                authorization:any[];
            }, ...{
                data?:any;
                account:string;
                name:string;
                authorization:any[];
            }[]];
            sig:string;
            keyIndex:number;
            expires_utc_sec:number;
        };
        _output_in:typeof import("@trpc/server").unsetMarker;
        _output_out:typeof import("@trpc/server").unsetMarker;
    }, {
        result:import("../lib/eosio.js").DoActionResponse | null;
        receipt:import("../lib/eosio.js").TransactionResponse | undefined;
    }>;
}>
export type AppRouter = typeof appRouter;
export {}
