import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

function HelpersList({ requestId }) {
  const [helpers, setHelpers] = useState([]);

  useEffect(() => {
    const fetchHelpers = async () => {
      const responsesRef = collection(db, "requests", requestId, "responses");
      const snapshot = await getDocs(responsesRef);

      const helperList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHelpers(helperList);
    };

    fetchHelpers();
  }, [requestId]);

  const approveHelper = async (helperId) => {
    const userRef = doc(db, "users", helperId);

    try {
      const userSnap = await getDoc(userRef);
      const currentKarma = userSnap.exists() ? userSnap.data().karma || 0 : 0;

      await updateDoc(userRef, {
        karma: currentKarma + 1,
      });

      alert("Approved! Karma +1 given.");
    } catch (err) {
      console.error("Karma update failed:", err);
      alert("Failed to give karma.");
    }
  };

  return (
    <div className="space-y-1 mt-2">
      {helpers.length === 0 && (
        <p className="text-sm text-gray-500">No offers yet.</p>
      )}
      {helpers.map((helper) => (
        <div
          key={helper.id}
          className="flex items-center justify-between text-sm"
        >
          <span>{helper.id}</span>
          <button
            onClick={() => approveHelper(helper.id)}
            className="text-green-600 hover:underline"
          >
            ✅ Approve
          </button>
        </div>
      ))}
    </div>
  );
}

export default HelpersList;
