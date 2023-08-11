import { getDocs, collection } from "firebase/firestore/lite"; 
import { getDb } from "./db.mjs"

const collection_name = 'portfolio'

export async function getAllProjects() {
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