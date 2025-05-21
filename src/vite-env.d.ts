/// <reference types="vite/client" />

interface FileData {
	name: string;
	size: number;
}

interface FileHashes {
	md5: string;
	sha256: string;
	sha512: string;
}

interface WorkerParams {
	file: File;
}

interface WorkerResult {
	fileData: FileData;
	hashes: FileHashes;
}
