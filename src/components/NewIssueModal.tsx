"use client";

import { useState } from "react";
import { db } from "../app/firebase"; // Import the Firestore instance
import { collection, addDoc } from "firebase/firestore"; // Firestore functions to add data

export default function NewIssueModal({ setNewIssueModalOpen, onIssueAdded  }: any) {
  const [newIssueName, setNewIssueName] = useState("");
  const [description, setDescription] = useState("");
  const [issueNumber, setIssueNumber] = useState("");
  const [badge, setBadge] = useState("log");
  const [vault, setVault] = useState("Personal");
  const [log, setLog] = useState("");

  // Save data to Firestore
  const handleSaveNewLog = async () => {
    const issueData = {
      newIssueName,
      description,
      issueNumber,
      badge,
      vault,
      log,
      createdAt: new Date().toISOString(),
    };

    try {
      // Ensure that you pass the Firestore instance and the correct collection name
      await addDoc(collection(db, "issues"), issueData);
      console.log("Issue saved to Firestore");
      alert("item issued successfully!")
      setNewIssueModalOpen(false); // Close modal after saving
    } catch (error) {
      console.error("Error saving to Firestore", error);
    }
    onIssueAdded(); 
  };

  // Handle closing the modal when clicking outside the content
  const handleCloseModal = (e: any) => {
    if (e && e.target === e.currentTarget) {
      setNewIssueModalOpen(false);
    }
  };

  return (
    <div
      className="fixed top-0 left-0 h-full w-full bg-gray-800 bg-opacity-50 flex items-center justify-center"
      onClick={handleCloseModal} // Close modal when clicking the background
    >
      <div className="bg-black text-white w-[90%] max-w-[800px] h-[85%] p-8 flex flex-col font-mono">
        <div>
          <div className="flex flex-row justify-center w-full items-center h-12 p-2">
            <h2 className="text-xs md:text-xl font-bold text-green-600 w-[20%]">
              New Issue:
            </h2>
            <input
              type="text"
              name="newIssueName"
              id="newIssueName"
              maxLength={60}
              className="grow ml-3 h-full bg-[#0D1117]"
              onChange={(e) => setNewIssueName(e.target.value)}
              value={newIssueName}
            />
          </div>
          <div className="flex flex-row justify-center w-full items-center h-12 p-2">
            <h2 className="text-xs md:text-xl font-bold text-[#8098A1] w-[20%]">
              Description:
            </h2>
            <input
              type="text"
              name="description"
              id="description"
              maxLength={200}
              className="grow ml-3 h-full bg-[#0D1117]"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            />
          </div>

          <div className="w-full p-2 flex flex-row justify-around mt-3 h-12 border-2 border-[#0D1117]">
            <div className="flex flex-row grow-[1] items-center">
              <p className="text-red-500 text-xl">#</p>
              <input
                type="number"
                maxLength={5}
                className="grow mx-3 h-full bg-[#0D1117]"
                onChange={(e) => setIssueNumber(e.target.value)}
                value={issueNumber}
              />
            </div>
            <div className="flex flex-row grow-[5] items-center">
              <p className="text-[#8098A1]">Badge</p>
              <select
                className="grow mx-3 h-full bg-[#0D1117] text-white text-center"
                onChange={(e) => setBadge(e.target.value)}
                value={badge}
              >
                <option value="log">Log</option>
                <option value="feat">Feat</option>
                <option value="fix">Fix</option>
              </select>
            </div>
            <div className="flex flex-row grow-[5] items-center">
              <p className="text-[#8098A1]">Vault</p>
              <select
                className="grow ml-3 h-full bg-[#0D1117] text-white text-center"
                onChange={(e) => setVault(e.target.value)}
                value={vault}
              >
                <option value="Personal">Personal</option>
                <option value="Work">Work</option>
                <option value="Studies">Studies</option>
              </select>
            </div>
          </div>
        </div>
        <h2 className="mt-4">First Log:</h2>
        <textarea
          name="log"
          id="log"
          className="w-full grow bg-[#0D1117] p-2 mt-2"
          style={{ resize: "none" }}
          onChange={(e) => setLog(e.target.value)}
          value={log}
        ></textarea>
        <div className="w-full space-x-3 flex justify-end">
          <button
            onClick={handleCloseModal}
            className="mt-4 border border-red-500 py-2 px-4 text-red-500 hover:bg-red-500 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveNewLog}
            className="mt-4 border border-green-500 py-2 px-4 text-green-500 hover:bg-green-500 hover:text-white"
          >
            Save New Log
          </button>
        </div>
      </div>
    </div>
  );
}
