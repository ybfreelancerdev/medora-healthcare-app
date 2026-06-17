import storage from "@react-native-firebase/storage";
import { launchImageLibrary } from "react-native-image-picker";
import * as DocumentPicker from "@react-native-documents/picker";

/**
 * =========================
 * Types
 * =========================
 */
type FileItem = {
    uri: string;
    type?: string;
    name?: string;
    size?: number;
    base64?: string;
};

type Config = {
    maxSizeMB: number;
};

const DEFAULT_CONFIG: Config = {
    maxSizeMB: 10,
};

const toMB = (bytes: number) => bytes / (1024 * 1024);

/**
 * =========================
 * Service Class
 * =========================
 */
class FileUploadService {
    private config: Config;

    constructor(config: Partial<Config> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
    }

    /**
     * 🔒 Validate file size
     */
    private validate(file: FileItem) {
        if (!file) return { valid: false, error: "No file selected" };

        const sizeMB = toMB(file.size || 0);

        if (sizeMB > this.config.maxSizeMB) {
            return {
                valid: false,
                error: `File must be less than ${this.config.maxSizeMB}MB`,
            };
        }

        return { valid: true };
    }

    /**
     * 📸 Pick Images (multiple)
     */
    async pickImages(multiple: boolean = true): Promise<FileItem[] | null> {
        return new Promise((resolve, reject) => {
            launchImageLibrary(
                {
                    mediaType: "photo",
                    selectionLimit: multiple ? 10 : 1,
                    includeBase64: true
                },
                (res) => {
                    if (res.didCancel) return resolve(null);

                    const files: FileItem[] =
                        res.assets?.map((a) => ({
                            uri: a.uri!,
                            type: a.type,
                            name: a.fileName,
                            size: a.fileSize,
                            base64: a.base64 ? `data:${a.type};base64,${a.base64}` : undefined,
                        })) || [];

                    const invalid = files.find((f) => !this.validate(f).valid);
                    if (invalid) return reject("One or more files exceed size limit");

                    resolve(files);
                }
            );
        });
    }

    /**
     * 🎥 Pick Videos (multiple)
     */
    async pickVideos(): Promise<FileItem[] | null> {
        return new Promise((resolve, reject) => {
            launchImageLibrary(
                {
                    mediaType: "video",
                    selectionLimit: 10,
                },
                (res) => {
                    if (res.didCancel) return resolve(null);

                    const files: FileItem[] =
                        res.assets?.map((a) => ({
                            uri: a.uri!,
                            type: a.type,
                            name: a.fileName,
                            size: a.fileSize,
                        })) || [];

                    const invalid = files.find((f) => !this.validate(f).valid);
                    if (invalid) return reject("One or more files exceed size limit");

                    resolve(files);
                }
            );
        });
    }

    /**
     * 📄 Pick Documents (multiple PDF)
     */
    async pickDocuments(): Promise<FileItem[] | null> {
        try {
            const res: any = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf],
                allowMultiSelection: true,
            });

            const files: FileItem[] =
                res.assets?.map((a: any) => ({
                    uri: a.uri!,
                    type: a.type ?? undefined,
                    name: a.fileName ?? undefined,
                    size: a.fileSize ?? undefined,
                })) || [];

            const invalid = files.find((f) => !this.validate(f).valid);
            if (invalid) throw "One or more files exceed size limit";

            return files;
        } catch (err: any) {
            if ((err as any)?.code === "DOCUMENT_PICKER_CANCELED") return null;
            throw err;
        }
    }

    /**
     * ☁️ Upload SINGLE file to Firebase
     */
    async uploadFileToFirebase(file: FileItem, folder = "uploads") {
        try {
            if (!file?.uri) throw new Error("Invalid file");

            const fileName = `${Date.now()}_${file.name}`;
            const path = `${folder}/${fileName}`;

            const reference = storage().ref(path);

            await reference.putFile(file.uri);

            const url = await reference.getDownloadURL();

            return {
                url,
                path,
                name: fileName,
            };
        } catch (err) {
            console.log("UPLOAD ERROR:", err);
            throw err;
        }
    }

    /**
     * ☁️ Upload MULTIPLE files (parallel)
     */
    async uploadMultipleToFirebase(
        files: FileItem[],
        folder = "uploads"
    ) {
        if (!files?.length) return [];

        const uploads = files.map((file) =>
            this.uploadFileToFirebase(file, folder)
        );

        return Promise.all(uploads);
    }

    /**
     * 🔁 Pick + Upload (single or multiple)
     */
    async pickAndUpload(
        type: "image" | "video" | "document",
        folder = "uploads",
        multiple = true
    ) {
        let files: FileItem[] | null = null;

        if (type === "image") files = await this.pickImages();
        if (type === "video") files = await this.pickVideos();
        if (type === "document") files = await this.pickDocuments();

        if (!files) return null;

        if (multiple) {
            return await this.uploadMultipleToFirebase(files, folder);
        }

        return await this.uploadFileToFirebase(files[0], folder);
    }
}

/**
 * =========================
 * Export Singleton
 * =========================
 */
export default new FileUploadService();