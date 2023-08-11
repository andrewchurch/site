import { initializeApp } from 'firebase/app';
import { getFirestore, getDocs, collection } from 'firebase/firestore/lite';

let db = false;

function getDb() {
    if (!db) {
        const firebaseConfig = {
            apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
            authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
            projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
            storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
            appId: import.meta.env.VITE_FIREBASE_APP_ID,
        };

        const app = initializeApp(firebaseConfig);
        db = getFirestore(app);
    }

    return db;
}

export async function getAllProjects() {
    const collection_name = 'portfolio';
    const doc_refs = await getDocs(collection(getDb(), collection_name));
    let res = [];
    doc_refs.forEach(project => {
        res.push({
            id: project.id,
            ...project.data()
        });
    });
    return res;
}