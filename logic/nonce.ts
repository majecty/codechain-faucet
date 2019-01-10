import { Context } from "../context";

export async function getSeq(context: Context): Promise<number> {
    const sdk = context.codechainSDK;
    let seq = await sdk.rpc.chain.getSeq(context.config.faucetCodeChainAddress);

    const transactions = await sdk.rpc.chain.getPendingTransactions();
    for (const transaction of transactions) {
        if (
            context.config.faucetCodeChainAddress ===
            transaction
                .getSignerAddress({
                    networkId: context.config.networkId
                })
                .toString()
        ) {
            const pendingSeq = transaction.unsigned.seq()!;
            if (pendingSeq >= seq) {
                seq = pendingSeq + 1;
            }
        }
    }
    return seq;
}
