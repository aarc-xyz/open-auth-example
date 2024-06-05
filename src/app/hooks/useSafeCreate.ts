import { AarcEthersSigner } from '@aarc-dev/ethers-v6-signer';
import { EthersAdapter, SafeAccountConfig, SafeFactory } from '@safe-global/protocol-kit';
import axios from 'axios';
import { ethers } from 'ethers';


const useSafeCreate = () => {

    let apiKeyMap = new Map<number, string[]>();
    const PROXY_FACTORY_ADDRESS = "0xa6b71e26c5e0845f74c812102ca7114b6a896ab2"; // SAME ACROSS ALL SUPPORTED CHAINS

    apiKeyMap.set(42161, ["https://api.arbiscan.io/api?", process.env.ARBI_API_KEY]);
    apiKeyMap.set(137, ["https://api.polygonscan.com/api?", process.env.POLYGON_API_KEY]);
    apiKeyMap.set(80002, ["https://api-amoy.polygonscan.com/api?", process.env.POLYGON_API_KEY]);
    apiKeyMap.set(1, ["https://api.etherscan.io/api?", process.env.ETHEREUM_API_KEY]);
    apiKeyMap.set(11155111, ["https://api-sepolia.etherscan.io/api?", process.env.ETHEREUM_API_KEY]);

    async function getDeployData(originChain: number, prevSafeAddress?: string) {
        const getContractCreation = `module=contract&action=getcontractcreation&contractaddresses=${prevSafeAddress}&apikey=`;
        const selectedOrignChainId = originChain;
        const prefix = apiKeyMap.get(selectedOrignChainId)?.[0];
        const key = apiKeyMap.get(selectedOrignChainId)?.[1];
        const data = await axios.get(prefix + getContractCreation + key);
        const txHash = data.data.result[0].txHash;
        const getTxByHash = `module=proxy&action=eth_getTransactionByHash&txhash=${txHash}&apikey=`;
        const data2 = await axios.get(prefix + getTxByHash + key);
        const hexData: `0x${string}` = data2.data.result.input;
        return hexData;
    }

    async function regenerateSafe(signer: AarcEthersSigner, originChain: number, destChain: number, prevSafeAddress: string) {
        const deployedData = await getDeployData(originChain, prevSafeAddress);
        console.log("deployed hex data ", deployedData);
        const config = {
            to: PROXY_FACTORY_ADDRESS,
            from: await signer.getAddress(),
            value: BigInt(0),
            data: deployedData,
            chainId: BigInt(destChain)
        };
        const transactionData = await signer.sendTransaction(config);
        await transactionData.wait();
        console.log("transactionData ", transactionData);
        return transactionData;
    }

    async function createNewSafe(signer: AarcEthersSigner, chainId: number, threshold: number) {
        try {
            const ethAdapterOwner = new EthersAdapter({
                ethers,
                signerOrProvider: signer
            });
            const safeFactory = await SafeFactory.create({ ethAdapter: ethAdapterOwner });
            console.log("safeFactory ", await safeFactory.getAddress());
            const safeAccountConfig: SafeAccountConfig = {
                owners: [
                    await signer.getAddress()
                ],
                threshold: threshold
            };
            const protocolKitOwner1 = await safeFactory.deploySafe({ safeAccountConfig, saltNonce: Date.now().toString() })

            const safeAddress = await protocolKitOwner1.getAddress();

            console.log(`Your Safe has been deployed for chainId ${chainId} with address ${safeAddress}`);
        } catch (error) {
            console.log(error);
            throw new Error(JSON.stringify(error));
        }
    }

    return {
        createNewSafe,
        regenerateSafe
    }
}
export default useSafeCreate;