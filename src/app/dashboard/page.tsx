"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import IssueCard from "@/components/IssueCard";
import Drawer from "@/components/Drawer";
import NewIssueModal from "@/components/NewIssueModal";
import { db } from "../firebase";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import { auth } from "../firebase";
import { useRouter } from "next/navigation";

interface Issue {
  id: string;
  newIssueName: string;
  description: string;
  issueNumber: number;
  createdAt: string;
  vault: string;
  badge: string;
  timestamp: string;
  userId: string;
  logs?: Array<{
    text: string;
    timestamp: Timestamp;
    isCode?: boolean;
    language?: string;
  }>;
}

export default function Dashboard() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [newIssueModalOpen, setNewIssueModalOpen] = useState(false);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [selectedVault, setSelectedVault] = useState("Work");
  const [sortByTimestamp, setSortByTimestamp] = useState(true);
  const user = auth.currentUser;
  const router = useRouter();

  const openDrawer = (issueData: Issue) => {
    setSelectedIssue(issueData);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  const sortIssues = (issuesToSort: Issue[]) => {
    return [...issuesToSort].sort((a, b) => {
      if (sortByTimestamp) {
        const getTimestamp = (timestamp: any) => {
          if (timestamp?.toDate) {
            return timestamp.toDate();
          } else if (typeof timestamp === 'string') {
            return new Date(timestamp);
          } else if (timestamp instanceof Date) {
            return timestamp;
          }
          return new Date();
        };

        const timeA = getTimestamp(a.timestamp || a.createdAt);
        const timeB = getTimestamp(b.timestamp || b.createdAt);
        
        return timeB.getTime() - timeA.getTime();
      } else {
        return a.issueNumber - b.issueNumber;
      }
    });
  };

  const toggleSort = () => {
    setSortByTimestamp((prev) => {
      const newSortByTimestamp = !prev;
      setIssues((currentIssues) => sortIssues([...currentIssues]));
      return newSortByTimestamp;
    });
  };

  const fetchIssues = async () => {
    if (!user?.uid) return;
    
    try {
      const issuesRef = collection(db, "issues");
      const q = query(
        issuesRef,
        where("vault", "==", selectedVault),
        where("userId", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      const fetchedIssues: Issue[] = [];
      querySnapshot.forEach((doc) => {
        fetchedIssues.push({ id: doc.id, ...doc.data() } as Issue);
      });
      setIssues(sortIssues(fetchedIssues));
    } catch (error) {
      console.error("Error fetching issues:", error);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [selectedVault, user?.uid]);

  return (
    <>
      {newIssueModalOpen && (
        <NewIssueModal
          setNewIssueModalOpen={setNewIssueModalOpen}
          onIssueAdded={fetchIssues}
        />
      )}
      <div className="h-screen w-full font-mono">
        <Header setNewIssueModalOpen={setNewIssueModalOpen} />
        <div className="w-full flex items-center justify-center mt-6">
          <div className="flex flex-row text-[#8098A1] w-[90%] max-w-[800px] justify-between items-center">
            <span>Welcome, {user?.displayName}</span>
            <div className="flex items-center gap-4">
              <select
                className="h-full bg-[#0D1117] text-[#8098A1] text-center p-1"
                value={selectedVault}
                onChange={(e) => setSelectedVault(e.target.value)}
              >
                <option value="Personal">Personal</option>
                <option value="Work">Work</option>
                <option value="Studies">Studies</option>
              </select>
              <button
                onClick={toggleSort}
                className="px-4 py-1 bg-[#0D1117] border border-[#8098A1] hover:bg-[#1A2027] transition-colors rounded"
              >
                Sort by: {sortByTimestamp ? "Time" : "Issue #"}
              </button>
            </div>
          </div>
        </div>
        <div className="mt-6 pb-3 w-full flex flex-col space-y-4">
          {issues.length > 0 ? (
            issues.map((issue) => (
              <div
                key={issue.id}
                className="w-full flex justify-center cursor-pointer"
                onClick={() => openDrawer(issue)}
              >
                <IssueCard issue={issue} />
              </div>
            ))
          ) : (
            <div className="text-center text-white">No issues found</div>
          )}
        </div>
      </div>

      <Drawer
        isOpen={drawerOpen}
        onClose={closeDrawer}
        selectedIssue={selectedIssue}
        onIssueUpdated={fetchIssues}
      />
    </>
  );
}