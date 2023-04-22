import {useForm} from "react-hook-form";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup"
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {useNavigate} from "react-router-dom";

interface CreateFormData {
    title: string;
    description: string;
}

export const CreateForm = () => {

    const [user] = useAuthState(auth);
    const navigate = useNavigate();

    const schema = yup.object().shape({
        title: yup.string().required("title required!"),
        description: yup.string().required("description required!"),

    })

    const {
        register, 
        handleSubmit, 
        formState: {errors},
    } = useForm<CreateFormData>({
        resolver: yupResolver(schema),
    })

    const postsRef = collection(db, "posts")

    const onCreatePost = async (data : CreateFormData) => {
        await addDoc(postsRef, {
            ...data,
            // title: data.title,
            // description: data.description,
            username: user?.displayName,
            uid: user?.uid,
        });

        navigate("/");
    }

    return (
        <form onSubmit={handleSubmit(onCreatePost)}>
            <input placeholder = "post title..." {...register("title")}/>
            <p className="error">{errors.title?.message}</p>
            <textarea placeholder = "post description..."{...register("description")}/>
            <p className="error">{errors.description?.message}</p>
            <input type="submit"/>
        </form>
    )
}