"use client";

import { useState, useEffect } from "react";
import { Alchemy, Network, Utils } from "alchemy-sdk";

const alchemy = new Alchemy({
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
});

export default function Home() {
  const [blockNumber, setBlockNumber] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [inputBlock, setInputBlock] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [transactionsPerPage, setTransactionsPerPage] = useState<number>(10);

  useEffect(() => {
    const fetchLatestBlock = async () => {
      try {
        const latestBlockNumber = await alchemy.core.getBlockNumber();
        setBlockNumber(latestBlockNumber);
        fetchTransactions(latestBlockNumber);
      } catch (error) {
        console.error("Error fetching latest block:", error);
      }
    };

    fetchLatestBlock();
  }, []);

  const fetchTransactions = async (blockNum: number) => {
    setLoading(true);
    setCurrentPage(1); // Reset pagination on new block search
    try {
      const block = await alchemy.core.getBlockWithTransactions(blockNum);
      setTransactions(block.transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const blockNum = parseInt(inputBlock);
    if (!isNaN(blockNum)) {
      setBlockNumber(blockNum);
      fetchTransactions(blockNum);
    }
  };

  // Pagination logic
  const totalTransactions = transactions.length;
  const totalPages = Math.ceil(totalTransactions / transactionsPerPage);
  const currentTransactions = transactions.slice(
    (currentPage - 1) * transactionsPerPage,
    currentPage * transactionsPerPage
  );

  return (
    <main className="flex flex-col items-center min-h-screen p-6 bg-gray-100">
      {/* Latest Block Display */}
      <div className="p-4 border rounded-lg shadow-md bg-white w-full max-w-2xl">
        <h2 className="text-lg font-semibold">Latest Ethereum Block</h2>
        {blockNumber ? (
          <p className="text-green-600 text-xl font-bold">#{blockNumber}</p>
        ) : (
          <p className="text-gray-500">Loading...</p>
        )}
      </div>

      {/* Search Block Transactions */}
      <div className="mt-6 p-4 border rounded-lg shadow-md bg-white w-full max-w-2xl">
        <h2 className="text-lg font-semibold">Search Transactions by Block</h2>
        <div className="flex mt-2 space-x-2">
          <input
            type="text"
            placeholder="Enter block number..."
            value={inputBlock}
            onChange={(e) => setInputBlock(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Search
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="mt-6 p-4 border rounded-lg shadow-md bg-white w-full max-w-2xl">
        <h2 className="text-lg font-semibold">Transactions</h2>

        {/* Transactions Per Page Selector */}
        <div className="mb-4">
          <label className="text-sm font-semibold">Transactions per page: </label>
          <select
            value={transactionsPerPage}
            onChange={(e) => {
              setTransactionsPerPage(parseInt(e.target.value));
              setCurrentPage(1); // Reset pagination when changing limit
            }}
            className="ml-2 p-2 border rounded"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading transactions...</p>
        ) : transactions.length > 0 ? (
          <>
            <ul className="mt-2 space-y-2">
              {currentTransactions.map((tx) => (
                <li
                  key={tx.hash}
                  onClick={() => setSelectedTransaction(tx)}
                  className="border p-2 rounded text-sm break-all cursor-pointer hover:bg-gray-200"
                >
                  <strong>Tx Hash:</strong> {tx.hash} <br />
                  <strong>From:</strong> {tx.from} <br />
                  <strong>To:</strong> {tx.to || "Contract Creation"} <br />
                  <strong>Value:</strong> {Utils.formatEther(tx.value)} ETH
                </li>
              ))}
            </ul>

            {/* Pagination Controls */}
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded ${
                  currentPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white"
                }`}
              >
                Previous
              </button>

              <span className="px-4 py-2">Page {currentPage} of {totalPages}</span>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded ${
                  currentPage === totalPages ? "bg-gray-300" : "bg-blue-500 text-white"
                }`}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-500">No transactions found.</p>
        )}
      </div>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-lg font-semibold">Transaction Details</h2>
            <p><strong>Hash:</strong> {selectedTransaction.hash}</p>
            <p><strong>From:</strong> {selectedTransaction.from}</p>
            <p><strong>To:</strong> {selectedTransaction.to || "Contract Creation"}</p>
            <p><strong>Value:</strong> {Utils.formatEther(selectedTransaction.value)} ETH</p>
            <p><strong>Gas Used:</strong> {selectedTransaction.gasLimit.toString()}</p>
            <p><strong>Gas Price:</strong> {Utils.formatUnits(selectedTransaction.gasPrice, "gwei")} Gwei</p>
            <button
              onClick={() => setSelectedTransaction(null)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
