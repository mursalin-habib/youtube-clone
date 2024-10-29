'use client';

import Image from "next/image";
import Link from "next/link";
import styles from "./navbar.module.css";
import SignIn from "./sign-in";
import Upload from "./upload";
import { onAuthStateChangedHelper } from "../firebase/firebase";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";

//useState hook is way to manage state in function component.
//javaScript closure -  maintaining state within function. State inside function is still maintained after the functoin has been executed.


export default function Navbar(){

    const [user, setUser] = useState <User | null>(null);

    useEffect(() =>{
        const unsubscribe = onAuthStateChangedHelper((user) => {
            setUser(user);
        });
        return () => unsubscribe();
    });



    return (
        <nav className={styles.nav}>
            <Link href="/">
                <Image width={90} height={20} className={styles.logo} src="/youtube-logo.svg" alt="Youtube Logo"/>

            </Link>
            {
                user && <Upload />
            }
            
            <SignIn user = {user}/>
        </nav>
    );
}