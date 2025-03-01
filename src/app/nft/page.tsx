"use client";

import { useState } from "react";
import { Alchemy, Network } from "alchemy-sdk";

const alchemy = new Alchemy({
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY as string, // Ensure API key is set
  network: Network.ETH_MAINNET, // Use Ethereum Mainnet
});

export default function NFTPage() {
  const [contractAddress, setContractAddress] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [nftData, setNftData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNFTData = async () => {
    setLoading(true);
    setError(null);
    setNftData(null);

    try {
      // Fetch NFT Metadata
      const nftMetadata = await alchemy.nft.getNftMetadata(contractAddress, tokenId);

      setNftData(nftMetadata);
    } catch (err) {
      setError("Error fetching NFT data. Please check the contract address and token ID.");
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">NFT Lookup</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter Contract Address"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter Token ID"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <button
        onClick={fetchNFTData}
        className="bg-blue-500 text-white p-2 rounded"
        disabled={loading}
      >
        {loading ? "Fetching..." : "Get NFT Data"}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {nftData && (
        <div className="mt-6 border p-4 rounded">
          <h2 className="text-xl font-bold">{nftData.title || "No Name"}</h2>
          {nftData.media && nftData.media.length > 0 ? (
            <img
              src={nftData.media[0]?.gateway}
              alt="NFT"
              className="w-full h-64 object-cover rounded mt-2"
            />
          ) : (
            <p className="text-gray-500 mt-2">No image available for this NFT.</p>
          )}
          <p className="mt-2">{nftData.description || "No description available."}</p>
        </div>
      )}
    </div>
  );
}
