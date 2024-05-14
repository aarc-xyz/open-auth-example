import { useSendTransaction, useWalletClient, usePrepareTransactionRequest } from "wagmi";
import { useState } from 'react';
import axios from 'axios';


const useSafeCreate = () => {
    const [safeAddress, setSafeAddress] = useState<string>("");
    const [originChain, setOriginChain] = useState<string>("");
    const [deployedData, setDeployedData] = useState<`0x${string}`>("0x");

    let apiKeyMap = new Map<number, string[]>();
    const PROXY_FACTORY_ADDRESS = "0xa6b71e26c5e0845f74c812102ca7114b6a896ab2"; // SAME ACROSS ALL SUPPORTED CHAINS
    const getContractCreation = `module=contract&action=getcontractcreation&contractaddresses=${safeAddress}&apikey=`;
    // KEYS ARE PUBLIC & FREE, DON'T WORRY, WILL BE FIXED LATER - COMPLICATIONS WITH .ENV
    apiKeyMap.set(42161, ["https://api.arbiscan.io/api?", "XKDKAWYX2H8H93T6GGIS3QGYG7F9UQ389X"]);
    apiKeyMap.set(1, ["https://api.etherscan.io/api?", "CIMV43RYIQI61HRB6T8WR4K8XXQMWVQV28"]);
    apiKeyMap.set(56, ["https://api.bscscan.com/api?", "RY147JT1XJEIU75CJJV6WQQBIAUQJU7KA5"]);
    apiKeyMap.set(137, ["https://api.polygonscan.com/api?", "J6KQKW3866TPVYKSC2J1W65PVFS6FJ3GTG"]);
    apiKeyMap.set(100, ["https://api.gnosisscan.io/api?", "7SBSAKGDRF1DF647Q52FCWWK5H6SR9VG3R"]);

    async function getDeployData() {
        const selectedOrignChainId = 1; //sepolia
        const prefix = apiKeyMap.get(selectedOrignChainId)?.[0];
        const key = apiKeyMap.get(selectedOrignChainId)?.[1];
        const data = await axios.get(prefix + getContractCreation + key);
        const txHash = data.data.result[0].txHash;
        const getTxByHash = `module=proxy&action=eth_getTransactionByHash&txhash=${txHash}&apikey=`;
        const data2 = await axios.get(prefix + getTxByHash + key);
        const hexData: `0x${string}` = data2.data.result.input; // THATS SOME GOOD SHIT
        setDeployedData(hexData);

        return hexData;
    }

    // async function createNewSafe() {
    //     const config = {
    //         to: PROXY_FACTORY_ADDRESS,
    //         value: BigInt(0),
    //         data: deployedData
    //     };
    //     const {data, sendTransaction} = useSendTransaction(config);
    //     console.log(data);

    // }



}
export default useSafeCreate;