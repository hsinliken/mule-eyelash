import React, { createContext, useContext, useEffect, useState } from 'react';
import { db, storage } from '../firebase';
import { collection, onSnapshot, addDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export interface GalleryImage {
    id: string;
    url: string;
    name: string;
    createdAt: any;
}

interface GalleryContextType {
    images: GalleryImage[];
    uploadImage: (file: File) => Promise<string>;
    deleteImage: (id: string, url: string) => Promise<void>;
    isLoading: boolean;
}

const GalleryContext = createContext<GalleryContextType>({
    images: [],
    uploadImage: async () => '',
    deleteImage: async () => { },
    isLoading: false,
});

export const useGallery = () => useContext(GalleryContext);

export const GalleryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const imgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as GalleryImage));
            setImages(imgs);
        });
        return () => unsubscribe();
    }, []);

    const uploadImage = async (file: File): Promise<string> => {
        setIsLoading(true);
        try {
            // 1. Upload to Storage
            // Create a unique filename: timestamp_filename
            const filename = `${Date.now()}_${file.name}`;
            const storageRef = ref(storage, `gallery/${filename}`);

            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);

            // 2. Save metadata to Firestore
            await addDoc(collection(db, 'gallery'), {
                url: downloadURL,
                name: filename, // Storing internal filename for reference
                createdAt: serverTimestamp()
            });

            return downloadURL;
        } catch (error) {
            console.error("Upload failed:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const deleteImage = async (id: string, url: string) => {
        if (!window.confirm('確定要刪除這張圖片嗎？這不會影響已經使用此連結的商品，但連結將會失效。')) return;

        setIsLoading(true);
        try {
            // 1. Delete from Firestore
            await deleteDoc(doc(db, 'gallery', id));

            // 2. Delete from Storage
            // Extract path from URL or use stored name if available. 
            // Since we didn't store full path, we try to reconstruct or parse.
            // Easiest is to create a ref from the URL directly.
            const fileRef = ref(storage, url);
            await deleteObject(fileRef);

        } catch (error) {
            console.error("Delete failed:", error);
            alert("刪除失敗，可能是權限問題或檔案不存在");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <GalleryContext.Provider value={{ images, uploadImage, deleteImage, isLoading }}>
            {children}
        </GalleryContext.Provider>
    );
};
