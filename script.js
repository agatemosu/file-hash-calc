import CryptoJS from "https://cdn.jsdelivr.net/npm/crypto-js@4.2.0/+esm";

/** @type {HTMLInputElement} */
const fileInput = document.querySelector("#fileInput");
const resultsList = document.querySelector("#resultsList");

class FileResult extends HTMLElement {
	/**
	 * @param {File} file
	 * @param {FileHashes} hashes
	 */
	constructor(file, hashes) {
		super();
		this.innerHTML = /* HTML */ `
			<div>
				<p>
					<b>${file.name}</b> -
					<span>${file.size} bytes</span>
				</p>
			</div>
			<div>
				<p><b>MD5</b>: <span>${hashes.md5}</span></p>
				<p><b>SHA1</b>: <span>${hashes.sha1}</span></p>
				<p><b>SHA256</b>: <span>${hashes.sha256}</span></p>
				<p><b>SHA512</b>: <span>${hashes.sha512}</span></p>
			</div>
		`;
	}
}

customElements.define("file-result", FileResult);
fileInput.addEventListener("change", main);

async function main() {
	for (const file of fileInput.files) {
		const fileBuffer = await file.arrayBuffer();

		const wordArray = CryptoJS.lib.WordArray.create(fileBuffer);
		const md5 = CryptoJS.MD5(wordArray).toString();

		const sha1 = await hash("SHA-1", fileBuffer);
		const sha256 = await hash("SHA-256", fileBuffer);
		const sha512 = await hash("SHA-512", fileBuffer);

		const fileResult = new FileResult(file, { md5, sha1, sha256, sha512 });
		resultsList.insertBefore(fileResult, resultsList.firstChild);
	}
}

/**
 * @param {AlgorithmIdentifier} algorithm
 * @param {BufferSource} data
 */
async function hash(algorithm, data) {
	const hashBuffer = await crypto.subtle.digest(algorithm, data);
	const byteArray = new Uint8Array(hashBuffer);

	return Array.from(byteArray)
		.map((byte) => byte.toString(16).padStart(2, "0"))
		.join("");
}
