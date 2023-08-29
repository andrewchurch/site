import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, orderBy, limit, getDocs, addDoc } from 'firebase/firestore/lite';

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
    const q = query(
        collection(getDb(), 'portfolio'),
        where('published', '==', true),
        orderBy('order')
    );
    const doc_refs = await getDocs(q);
    let res = [];
    doc_refs.forEach(project => {
        res.push({
            id: project.id,
            ...project.data()
        });
    });
    return res;
}

export async function getTopTenScores(game) {
    const q = query(
        collection(getDb(), 'flappyScores'),
        orderBy('score', 'desc'),
        limit(10)
    );
    const doc_refs = await getDocs(q);
    let res = [];
    doc_refs.forEach(score => {
        res.push({
            id: score.id,
            ...score.data()
        });
    });
    return res;
}

export async function addScore(score) {
    const res = await addDoc(collection(getDb(), 'flappyScores'), score);
    return res;
}