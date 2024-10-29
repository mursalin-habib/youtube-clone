'use client';

import { Fragment } from "react";
import styles from "./sign-in.module.css"
import { signInWithGoogle, signOut } from "../firebase/firebase";
import { User } from "firebase/auth";

interface SignInProps {
    user: User | null;
}

export default function SignIn({user}: SignInProps){
    return (
        <Fragment>
            { user ?
                (
                    <button className={styles.Signin} onClick={signOut}>
                        Sign Out
                    </button>
                ):(
                    <button className={styles.Signin} onClick={signInWithGoogle}>
                        Sign In
                    </button>
                )
            }
            
        </Fragment>
    )
}