import { FaX } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { db } from "../app/firebase";
import { deleteDoc, doc, updateDoc, Timestamp, onSnapshot } from "firebase/firestore";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedIssue: any;
  onIssueUpdated?: () => void;
}

interface LogEntry {
  text: string;
  timestamp: Date;
}

const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, selectedIssue, onIssueUpdated }) => {
  const [newLog, setNewLog] = useState<string>("");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [newEntry, setNewEntry] = useState(false);

  const toggleNewEntry = () => {
    setNewEntry((prev) => !prev);
  };

  // Set up real-time listener for logs
  useEffect(() => {
    if (selectedIssue?.id) {
      const issueRef = doc(db, "issues", selectedIssue.id);
      
      const unsubscribe = onSnapshot(issueRef, (doc) => {
        if (doc.exists()) {
          const issueData = doc.data();
          const existingLogs = issueData.logs || [];
          
          // Convert Firestore timestamps to Date objects
          const convertedLogs = existingLogs.map((log: any) => ({
            text: log.text,
            timestamp: log.timestamp?.toDate() || new Date()
          }));
          
          setLogs(convertedLogs);
        }
      });

      // Cleanup subscription
      return () => unsubscribe();
    }
  }, [selectedIssue?.id]);

  const saveLog = async () => {
    if (selectedIssue && newLog.trim()) {
      try {
        const issueRef = doc(db, "issues", selectedIssue.id);
        const newLogEntry = {
          text: newLog.trim(),
          timestamp: Timestamp.now()
        };

        // Get current logs or initialize empty array
        const currentLogs = logs || [];
        
        // Update with new logs array
        await updateDoc(issueRef, {
          logs: [...currentLogs, newLogEntry]
        });

        setNewLog(""); // Clear input
        if (onIssueUpdated) {
          onIssueUpdated(); // Trigger parent refresh
        }
        
        console.log("Log saved successfully");
      } catch (error) {
        console.error("Error saving log:", error);
      }
    }
  };

  const deleteIssue = async () => {
    if (selectedIssue) {
      try {
        const issueRef = doc(db, "issues", selectedIssue.id);
        await deleteDoc(issueRef);
        onClose();
        if (onIssueUpdated) {
          onIssueUpdated(); // Trigger parent refresh
        }
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
      } transition-transform duration-300 bg-black border-l border-black text-white w-3/5 min-w-[400px] p-6`}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-red-500 p-2 rounded-full"
      >
        <FaX />
      </button>

      <div className="flex flex-col gap-4 h-full">
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
            <div  className="cursor-pointer margin-[2px]">
              <hr className="border-t border-gray-600 cursor-pointer hover:border-green-600 py-1" onClick={toggleNewEntry}/>
              <hr className="border border-black cursor-pointer"/>
            </div>           
            {/* New Log Input */}
            {newEntry && (
              <div className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold">Add New Log:</h3>
              <textarea
                value={newLog}
                onChange={(e) => setNewLog(e.target.value)}
                className="w-full h-24 bg-black text-white border border-gray-600 p-2"
                style={{ resize: "none" }}
                placeholder="Enter your log here..."
                spellCheck
              />
              <button
                onClick={saveLog}
                className="py-2 px-4 text-green-600 font-bold border border-green-600 hover:bg-green-500 hover:text-white"
              >
                Add Log Entry
              </button>
            </div>
            )}
            

            {/* Log History */}
            <div className="flex-1 overflow-y-auto mt-4">
              <h3 className="text-lg font-semibold mb-2">Log History:</h3>
              <div className="flex flex-col gap-4">
                {logs && logs.slice().reverse().map((log, index) => (
                  <div 
                    key={index} 
                    className="border-l border-green-600 bg-[#0D1117] p-4"
                  >
                    <div className="text-sm text-green-600 mb-2">
                      {log.timestamp.toLocaleString()}
                    </div>
                    <div className="whitespace-pre-wrap">{log.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <p>No issue selected.</p>
        )}

        {/* Delete Button */}
        <button
          onClick={deleteIssue}
          className="mt-4 py-2 px-4 text-red-600 font-bold border border-red-600 hover:bg-red-500 hover:text-white"
        >
          Delete Issue
        </button>
      </div>
    </div>
  );
};

export default Drawer;