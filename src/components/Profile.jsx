import {useEffect, useState} from "react";
import {collection, query, where, getDocs} from "firebase/firestore";
import {db, auth} from "../lib/firebase";

function Profile({user, karma}) {
    const [myPosts, setMyPosts] = useState([]);

    useEffect(() => {
        if(!user) return;

        const fetchMyPosts = async() => {
            const q = query(
                collection(db, "requests"),
                where("userId", "==", user.uid)
            );
            const snapshot = await getDocs(q);
            const posts = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setMyPosts(posts);

        };
        fetchMyPosts();
    }, [user]);

    return(
        <div className="mt-8 p-4 border rounded bg-white shadow space-y-2">
            <h3 className="text-lg font-bold">👤 My Profile</h3>
            <p><strong>Name:</strong> {user.displayName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Karma:</strong> {karma}</p>
            <div className = "mt-4">
                <h4 className = "font-semibold mb-1">📄 My SkillSwap Posts</h4>
                {myPosts.length === 0 ? (
                    <p className = "text-sm text-gray-500">You haven't posted anything yet.</p>
                ) : (
                    <ul className="space-y-1 text-sm">
                        {myPosts.map((post) => (
                            <li key={post.id} className="border-b py-1">
                                <span className="font-medium">Need:</span> {post.need}<br />
                                <span className ="font-medium">Offer:</span> {post.offer}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default Profile;