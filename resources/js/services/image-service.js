// resources/js/services/image-service.js
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth } from "../firebase";

const storage = getStorage();

export const imageService = {
    async uploadImage(file, path = "listings") {
        if (!auth.currentUser) throw new Error("User not authenticated");

        const fileRef = ref(
            storage,
            `${path}/${auth.currentUser.uid}/${Date.now()}_${file.name}`
        );

        // Compress and optimize image before upload
        const compressedFile = await this.compressImage(file);

        await uploadBytes(fileRef, compressedFile);
        return getDownloadURL(fileRef);
    },

    async compressImage(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const MAX_WIDTH = 1200;
                    const MAX_HEIGHT = 1200;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob(
                        (blob) => {
                            resolve(
                                new File([blob], file.name, {
                                    type: file.type,
                                    lastModified: Date.now(),
                                })
                            );
                        },
                        file.type,
                        0.7
                    ); // 70% quality
                };
            };
        });
    },
};
