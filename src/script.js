import HashWorker from "./hashWorker.js??worker";

const fileInput = document.querySelector("#fileInput");
const resultsList = document.querySelector("#resultsList");

class FileResult extends HTMLElement {
	/**
	 * @param {FileData} file
	 * @param {FileHashes} hashes
	 */
	constructor(file, hashes) {
		super();
		this.innerHTML = /* HTML */ `
			<div>
				<b>${file.name}</b> -
				<span>${file.size} bytes</span>
			</div>
			<div>
				<p><b>MD5</b>: <span>${hashes.md5}</span></p>
				<p><b>SHA256</b>: <span>${hashes.sha256}</span></p>
				<p><b>SHA512</b>: <span>${hashes.sha512}</span></p>
			</div>
		`;
	}
}

customElements.define("file-result", FileResult);

document.addEventListener("dragover", (e) => {
	e.preventDefault();
});

document.addEventListener("drop", (e) => {
	e.preventDefault();
	main(e.dataTransfer.files);
});

fileInput.addEventListener("change", (e) => {
	const input = /** @type {HTMLInputElement} */ (e.target);
	main(input.files);
});

/**
 * @param {FileList} files
 */
async function main(files) {
	for (const file of files) {
		/** @type {Worker} */
		const worker = new HashWorker();

		worker.postMessage({ file });

		worker.onmessage = (e) => {
			/** @type {WorkerResult} */
			const { hashes } = e.data;

			const result = new FileResult(file, hashes);
			resultsList.insertBefore(result, resultsList.firstChild);

			worker.terminate();
		};
	}
}
