import { md5 as hashMD5 } from "hash-wasm";

/**
 * @param {AlgorithmIdentifier} algorithm
 * @param {BufferSource} data
 */
async function digest(algorithm, buffer) {
	const hashBuffer = await crypto.subtle.digest(algorithm, buffer);
	const byteArray = new Uint8Array(hashBuffer);

	return Array.from(byteArray)
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
}

self.onmessage = async (e) => {
	/** @type {WorkerParams} */
	const { file } = e.data;

	const fileBuffer = new Uint8Array(await file.arrayBuffer());

	const md5 = await hashMD5(fileBuffer);

	const sha256 = await digest("SHA-256", fileBuffer);
	const sha512 = await digest("SHA-512", fileBuffer);

	self.postMessage({
		fileData: { name: file.name, size: file.size },
		hashes: { md5, sha256, sha512 },
	});
};
