declare const appRouter:import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
    ctx:object;
    meta:object;
    errorShape:import("@trpc/server").DefaultErrorShape;
    transformer:import("@trpc/server").DefaultDataTransformer;
}>, {
    actions:import("@trpc/server").BuildProcedure<"query", {
        _config:import("@trpc/server").RootConfig<{
            ctx:object;
            meta:object;
            errorShape:import("@trpc/server").DefaultErrorShape;
            transformer:import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta:object;
        _ctx_out:object;
        _input_in:{
            skip?:number | undefined;
            sort?:string | undefined;
            filter?:{
                boid_id:string;
            } | undefined;
            start?:string | undefined;
            end?:string | undefined;
            limit?:number | undefined;
            actions:[string, ...string[]];
        };
        _input_out:{
            skip?:number | undefined;
            sort?:string | undefined;
            filter?:{
                boid_id:string;
            } | undefined;
            start?:string | undefined;
            end?:string | undefined;
            limit?:number | undefined;
            actions:[string, ...string[]];
        };
        _output_in:typeof import("@trpc/server").unsetMarker;
        _output_out:typeof import("@trpc/server").unsetMarker;
    }, any>;
}>
export type AppRouter = typeof appRouter;
export {}
