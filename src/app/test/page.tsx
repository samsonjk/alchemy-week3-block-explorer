'use client'

// Setup: npm install alchemy-sdk
import { Alchemy, Network } from "alchemy-sdk";
import { useEffect, useState } from "react";

const config = {
    apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(config);

export default function Test() {

    const [blockNumber, setBlockNumber] = useState(Number);
    const [blockDetails, setBlockDetails] = useState();
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        // Example: Get Ethereum gas price using Alchemy SDK
        alchemy.core.getBlockNumber().then((response) => {
            setBlockNumber(response);
            setFetching(false);
        }).catch((error) => {
            console.error('Error fetching gas price:', error);
        });

        alchemy.core.getBlock(blockNumber).then((data: any) => {
            setBlockDetails(data);
        }).catch((error) => {
            console.error('Error fetching gas price:', error);
        })
    }, []);




    return (
        <div> <h1> Test Function</h1>
        
            <div> Block Number: {fetching? 'Fecthing....': blockNumber} </div>
            <br/>
            <hr>
            </hr>
            <h1> Block Details</h1>
            { blockDetails }
        </div>
    )
}