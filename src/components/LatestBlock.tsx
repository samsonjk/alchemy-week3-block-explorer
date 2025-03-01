"use client";

import { useState, useEffect } from "react";
import { Alchemy, Network } from "alchemy-sdk";

const alchemy = new Alchemy({
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
});

const LatestBlock = () => {
  const [blockNumber, setBlockNumber] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBlockNumber = async () => {
      try {
        const latestBlock = await alchemy.core.getBlockNumber();
        setBlockNumber(latestBlock);
      } catch (error) {
        console.error("Error fetching block number:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlockNumber();
  }, []);

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white">
      <h2 className="text-lg font-semibold">Latest Ethereum Block</h2>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <p className="text-green-600 text-xl font-bold">#{blockNumber}</p>
      )}
    </div>
  );
};

export default LatestBlock;
