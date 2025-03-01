"use client";

import { useState } from "react";
import { Alchemy, Network, Utils, SortingOrder, AssetTransfersCategory } from "alchemy-sdk";
import { parseUnits } from "ethers";

const alchemy = new Alchemy({
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
});

export default function Accounts() {
    const [address, setAddress] = useState<string>("");
    const [balance, setBalance] = useState<string | null>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchAccountData = async () => {
        if (!address) return;

        setLoading(true);
        try {
            // Fetch balance
            const rawBalance = await alchemy.core.getBalance(address);
            setBalance(Utils.formatEther(rawBalance) + " ETH");

            // Fetch recent transactions
            const txs = await alchemy.core.getAssetTransfers({
                fromBlock: "0x0",
                toAddress: address,
                category: [
                    AssetTransfersCategory.EXTERNAL, // External ETH transfers
                    AssetTransfersCategory.INTERNAL, // Internal contract transfers
                ],
                maxCount: 10,
                withMetadata: true,
                order: SortingOrder.DESCENDING, // Corrected order type
            });

            setTransactions(txs.transfers);
        } catch (error) {
            console.error("Error fetching account data:", error);
            setBalance("Invalid address or error fetching data.");
            setTransactions([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <h2 className="text-2xl font-semibold">Ethereum Account Details</h2>
            <div className="mt-4 w-full max-w-lg">
                <input
                    type="text"
                    placeholder="Enter Ethereum address..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="border p-2 rounded w-full"
                />
                <button
                    onClick={fetchAccountData}
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded w-full"
                >
                    {loading ? "Fetching..." : "Get Account Data"}
                </button>
            </div>

            {balance && (
                <div className="mt-4 p-4 bg-white shadow-md rounded w-full max-w-lg">
                    <p className="text-lg font-bold">Balance: {balance}</p>
                </div>
            )}

            {transactions.length > 0 && (
                <div className="mt-6 w-full max-w-lg">
                    <h3 className="text-xl font-semibold mb-2">Recent Transactions</h3>
                    <ul className="bg-white shadow-md rounded p-4">
                        {transactions.map((tx, index) => (
                            <li key={index} className="border-b py-2 text-sm">
                                <p>
                                    <strong>Tx Hash:</strong>{" "}
                                    <a
                                        href={`https://etherscan.io/tx/${tx.hash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500"
                                    >
                                        {tx.hash.slice(0, 10)}...
                                    </a>
                                </p>
                                <p>
                                    <strong>From:</strong> {tx.from.slice(0, 10)}...
                                </p>
                                <p>
                                    <strong>To:</strong> {tx.to ? tx.to.slice(0, 10) + "..." : "Contract Execution"}
                                </p>
                                <p>
  <strong>Value:</strong> {tx.value ? Utils.formatEther(parseUnits(tx.value.toString(), "ether")) : "0"} ETH
</p>

                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
