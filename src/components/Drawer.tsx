import { FaX, FaCode, FaFont } from "react-icons/fa6";
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
  isCode: boolean;
  language?: string;
  filePath?: string;
}

const LANGUAGE_OPTIONS = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'css', label: 'CSS' },
  { value: 'html', label: 'HTML' },
];

const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, selectedIssue, onIssueUpdated }) => {
  const [newLog, setNewLog] = useState<string>("");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [newEntry, setNewEntry] = useState(false);
  const [isCodeMode, setIsCodeMode] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [filePath, setFilePath] = useState<string>("");

  const toggleNewEntry = () => setNewEntry((prev) => !prev);
  const toggleCodeMode = () => {
    setIsCodeMode((prev) => !prev);
    setFilePath("");
  };

  useEffect(() => {
    if (selectedIssue?.id) {
      const issueRef = doc(db, "issues", selectedIssue.id);
      
      const unsubscribe = onSnapshot(issueRef, (doc) => {
        if (doc.exists()) {
          const issueData = doc.data();
          const existingLogs = issueData.logs || [];
          
          const convertedLogs = existingLogs.map((log: any) => ({
            text: log.text,
            timestamp: log.timestamp?.toDate() || new Date(),
            isCode: log.isCode || false,
            language: log.language || 'javascript',
            filePath: log.filePath || ''
          }));
          
          setLogs(convertedLogs);
        }
      });

      return () => unsubscribe();
    }
  }, [selectedIssue?.id]);

  const saveLog = async () => {
    if (selectedIssue && newLog.trim()) {
      try {
        const issueRef = doc(db, "issues", selectedIssue.id);
        const newLogEntry = {
          text: newLog.trim(),
          timestamp: Timestamp.now(),
          isCode: isCodeMode,
          ...(isCodeMode && { 
            language: selectedLanguage,
            filePath: filePath.trim() || null 
          })
        };
  
        const currentLogs = logs || [];
        await updateDoc(issueRef, {
          logs: [...currentLogs, newLogEntry]
        });
  
        setNewLog("");
        setFilePath("");
        onIssueUpdated?.();
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
          onIssueUpdated();
        }
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
            <div className="cursor-pointer margin-[2px]">
              <hr className="border-t border-gray-600 cursor-pointer hover:border-green-600 py-1" onClick={toggleNewEntry}/>
              <hr className="border border-black cursor-pointer"/>
            </div>           
            {newEntry && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">Add New Log:</h3>
                  <button
                    onClick={toggleCodeMode}
                    className={`p-2 rounded ${
                      isCodeMode ? 'text-green-500' : 'text-gray-500'
                    }`}
                    title={isCodeMode ? "Switch to text mode" : "Switch to code mode"}
                  >
                    {isCodeMode ? <FaFont /> : <FaCode />}
                  </button>
                  {isCodeMode && (
                    <div className="flex items-center gap-2">
                      <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="bg-[#0D1117] border border-gray-600 rounded p-1 text-sm"
                      >
                        {LANGUAGE_OPTIONS.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <input 
                        type="text"
                        value={filePath}
                        onChange={(e) => setFilePath(e.target.value)}
                        placeholder="File path (optional)"
                        className="bg-[#0D1117] border border-gray-600 rounded p-1 text-sm w-64"
                      />
                    </div>
                  )}
                </div>
                <textarea
                  value={newLog}
                  onChange={(e) => setNewLog(e.target.value)}
                  className={`w-full min-h-24 resize-y bg-black text-white border border-gray-600 p-2 font-${
                    isCodeMode ? 'mono' : 'sans'
                  }`}
                  placeholder={isCodeMode ? "Enter your code here..." : "Enter your log here..."}
                  spellCheck={!isCodeMode}
                />
                <button
                  onClick={saveLog}
                  className="py-2 px-4 text-green-600 font-bold border border-green-600 hover:bg-green-500 hover:text-white"
                >
                  Add Log Entry
                </button>
              </div>
            )}

            <div className="flex-1 overflow-y-auto mt-4">
              <h3 className="text-lg font-semibold mb-2">Log History:</h3>
              <div className="flex flex-col gap-4">
                {logs && logs.slice().reverse().map((log, index) => (
                  <div 
                    key={index} 
                    className={`border-l p-4  bg-[#0D1117] ${
                      log.isCode 
                        ? 'border-blue-600' 
                        : 'border-green-600'
                    }`}
                  >
                    <div className={`text-sm  mb-2 flex items-center gap-2 ${
                      log.isCode 
                        ? 'text-blue-400' 
                        : 'text-green-600'
                    }`}>
                      <span>{log.timestamp.toLocaleString()}</span>
                      {log.isCode && (
                        <>
                          <FaCode className="inline" />
                          <span className="text-xs">
                            {LANGUAGE_OPTIONS.find(opt => opt.value === log.language)?.label}
                          </span>
                          {log.filePath && (
                            <span className="text-xs text-gray-400 ml-2">
                              {log.filePath}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                    <div className={`whitespace-pre-wrap font-${log.isCode ? 'mono' : 'sans'}`}>
                      {log.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <p>No issue selected.</p>
        )}

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