import { addDoc, collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Post as InterfacePost } from "./main"
import { auth, db } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";

interface Props {
    post: InterfacePost;
}

interface Like {
    userId: string;
    likeId: string;
}

export const Post = (props: Props) => {
    const {post} = props;
    const [user] = useAuthState(auth);

    const [likes, setLikes] = useState<Like[] | null>(null) 

    const likesRef = collection(db, "likes");
    const likesDoc = query(likesRef, where("pid", "==", post.id));

    const getLikes = async () => {
        const data = await getDocs(likesDoc);
        setLikes(data.docs.map((doc) => ({userId: doc.data().uid, likeId: doc.id})));
        // console.log(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
    }

    const addLike = async () => {
        try {
            const newDoc = await addDoc(likesRef, {
                uid: user?.uid,
                pid: post.id,
            });
            if (user) {
            setLikes((prev) => prev ? [...prev, {userId: user?.uid, likeId: newDoc.id}] : [{userId: user?.uid, likeId: newDoc.id}]);
            }
        } catch (e) {
            console.log(e);
        }
    }

    const removeLike = async () => {
        try {
            const liketoDeleteQuery = query(likesRef, where("pid", "==", post.id), where("uid", "==", user?.uid));
            const likeToDeleteData = await getDocs(liketoDeleteQuery);
            const likeToDelete = doc(db, "likes", likeToDeleteData.docs[0].id)
            const likeId = likeToDeleteData.docs[0].id;

            await deleteDoc(likeToDelete);

            if (user) {
                setLikes((prev) => prev && prev.filter((like) => like.likeId !== likeId));
                }

        } catch (e) {
            console.log(e);
        }
    }

    const hasUserLiked = likes?.find((like) => like.userId === user?.uid);

    useEffect(() => {
        getLikes();
    }, []);

    return (
    <div> 
        <div className="title">
            <h1>
                {post.title}
            </h1>
        </div>
        <div className = "body">
            <p>{post.description}</p>
        </div>
        <div className = "footer">
            <p>@{post.username}</p>
            {/* code for thumbs up emoji */}
            <button onClick = {hasUserLiked ? removeLike : addLike}> {hasUserLiked ? <>&#128078;</> : <>&#128077;</>} </button> 
            {likes && <p>Likes: {likes.length}</p>}

        </div>
    </div>
)}
