import { FaX } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { db } from "../app/firebase"; // Ensure this is correctly initialized
import { deleteDoc, doc, updateDoc } from "firebase/firestore"; // Firestore functions

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedIssue: any;
}

const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, selectedIssue }) => {
  const [log, setLog] = useState<string>(""); // State for the log

  // Load the log when the selected issue changes
  useEffect(() => {
    if (selectedIssue) {
      setLog(selectedIssue.log || ""); // Set initial log if available, otherwise empty string
    }
  }, [selectedIssue]);

  // Handle saving the updated log to Firestore
  const saveLog = async () => {
    if (selectedIssue) {
      try {
        const issueRef = doc(db, "issues", selectedIssue.id); // Reference to Firestore document
        await updateDoc(issueRef, {
          log: log, // Update the log field in Firestore
        });
        alert("Log saved successfully");
      } catch (error) {
        console.error("Error saving log:", error);
      }
    }
  };
  // Handle deleting the log
  const deleteIssue = async () => {
    if (selectedIssue) {
      try {
        const issueRef = doc(db, "issues", selectedIssue.id); // Reference to Firestore document
        await deleteDoc(issueRef); // Delete the entire issue document
        onClose(); // Close the drawer after deleting the issue
        console.log("Issue deleted successfully");
      } catch (error) {
        console.error("Error deleting issue:", error);
      }
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full font-mono ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 bg-black border-l border-black text-white w-3/5 p-6`}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-red-500 p-2 rounded-full"
      >
        <FaX />
      </button>

      <div className="flex flex-col gap-4 h-full">
        {/* Issue details */}
        {selectedIssue ? (
          <>
            <div className="flex justify-between">
              <h2 className="text-2xl font-bold">
                {selectedIssue.newIssueName}
              </h2>
              <div className="text-red-500 text-xl font-bold mr-12">
                Issue #{selectedIssue.issueNumber}
              </div>
            </div>
            <hr className="border border-gray-600" />
            <div className="h-full flex flex-col">
              <h3 className="text-lg font-semibold">Log:</h3>
              <textarea
                value={log}
                onChange={(e) => setLog(e.target.value)} // Update log state on change
                className="w-full grow bg-black text-white border border-gray-600 p-2 mt-2"
                style={{ resize: "none" }}
                placeholder="Enter your log here..."
              ></textarea>
            </div>
          </>
        ) : (
          <p>No issue selected.</p>
        )}

        {/* Save Log Button */}
        <div className="w-full flex gap-2">
          <button
            onClick={deleteIssue}
            className="mt-4 py-2 px-4 grow text-red-600 font-bold border border-red-600 hover:bg-red-500 hover:text-white"
          >
            Delete Log
          </button>
          <button
            onClick={saveLog}
            className="mt-4 py-2 px-4 grow-[10] text-green-600 font-bold border border-green-600 hover:bg-green-500 hover:text-white"
          >
            save Log
          </button>
        </div>
      </div>
    </div>
  );
};

export default Drawer;
