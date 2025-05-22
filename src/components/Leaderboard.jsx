import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../lib/firebase";

function Leaderboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchTopUsers = async () => {
      const q = query(collection(db, "users"), orderBy("karma", "desc"), limit(5));
      const snapshot = await getDocs(q);
      const userList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(userList);
    };

    fetchTopUsers();
  }, []);

  return (
    <div className="mt-8 p-4 border rounded bg-white shadow space-y-2">
      <h3 className="text-lg font-bold">🏆 Top Helpers</h3>
      <ul className="text-sm space-y-1">
        {users.map((user, index) => (
          <li key={user.id}>
            #{index + 1} – {user.name || user.email || "Anonymous"} ({user.karma} karma)
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Leaderboard;
