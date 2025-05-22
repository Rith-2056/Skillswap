import { useEffect, useState } from "react";
import { collectionGroup, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

function MyContributions({ user }) {
  const [contributions, setContributions] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchContributions = async () => {
      const allResponses = await getDocs(collectionGroup(db, "responses"));
      const userResponses = allResponses.docs.filter(
        (doc) => doc.id === user.uid
      );

      const resolved = await Promise.all(
        userResponses.map(async (response) => {
          const requestPath = response.ref.parent.parent;
          const requestDoc = await getDoc(requestPath);
          return requestDoc.exists() ? requestDoc.data() : null;
        })
      );

      setContributions(resolved.filter(Boolean));
    };

    fetchContributions();
  }, [user]);

  return (
    <div className="mt-8 p-4 border rounded bg-white shadow space-y-2">
      <h3 className="text-lg font-bold">🙌 My Contributions</h3>
      {contributions.length === 0 ? (
        <p className="text-sm text-gray-500">You haven't helped anyone yet.</p>
      ) : (
        <ul className="text-sm list-disc list-inside space-y-1">
          {contributions.map((contrib, idx) => (
            <li key={idx}>
              Helped with: <strong>{contrib.need}</strong> (offered: {contrib.offer})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyContributions;
