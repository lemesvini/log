"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import IssueCard from "@/components/IssueCard";
import Drawer from "@/components/Drawer";
import NewIssueModal from "@/components/NewIssueModal";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth } from "../firebase";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  const [newIssueModalOpen, setNewIssueModalOpen] = useState(false);
  const [issues, setIssues] = useState<any[]>([]);
  const [selectedVault, setSelectedVault] = useState("Work"); // Store selected vault filter
  const user = auth.currentUser;
  const router = useRouter();

  if(!user) {
    router.push('/')
  }

  const openDrawer = (issueData: any) => {
    setSelectedIssue(issueData);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  // Fetch issues from Firestore based on selected vault
  const fetchIssues = async () => {
    try {
      const issuesRef = collection(db, "issues");
      const q = query(
        issuesRef,
        where("vault", "==", selectedVault),
        where("userId", "==", user?.uid)
      );
      const querySnapshot = await getDocs(q);
      const fetchedIssues: any[] = [];
      querySnapshot.forEach((doc) => {
        fetchedIssues.push({ id: doc.id, ...doc.data() });
      });
      setIssues(fetchedIssues); // Set filtered issues to state
    } catch (error) {
      console.error("Error fetching issues:", error);
    }
  };

  // Refetch issues whenever selectedVault changes
  useEffect(() => {
    fetchIssues();
  }, [selectedVault]);

  return (
    <>
      {newIssueModalOpen && (
        <NewIssueModal
          setNewIssueModalOpen={setNewIssueModalOpen}
          onIssueAdded={fetchIssues} // Trigger refetch when a new issue is added
        />
      )}
      <div className="h-screen w-full font-mono">
        <Header setNewIssueModalOpen={setNewIssueModalOpen} />
        <div className="w-full flex items-center justify-center mt-6">
          <div className="flex flex-row text-[#8098A1] w-[90%] max-w-[800px] justify-between">
            <span>Welcome, {user?.displayName}</span>
            <select
              className="h-full bg-[#0D1117] text-[#8098A1] text-center p-1"
              value={selectedVault}
              onChange={(e) => setSelectedVault(e.target.value)} // Update selected vault
            >
              <option value="Personal">Personal</option>
              <option value="Work">Work</option>
              <option value="Studies">Studies</option>
            </select>
          </div>
        </div>
        <div className="mt-6 pb-3 w-full flex flex-col space-y-4">
          {issues.length > 0 ? (
            issues.map((issue) => (
              <div
                key={issue.id}
                className="w-full flex justify-center"
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
      />
    </>
  );
}
