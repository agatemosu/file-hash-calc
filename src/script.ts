import HashWorker from "./hashWorker.ts?worker";

const fileInput = document.querySelector("#fileInput") as HTMLInputElement;
const resultsList = document.querySelector("#resultsList") as HTMLElement;

class FileResult extends HTMLElement {
	constructor(file: FileData, hashes: FileHashes) {
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
	if (e.dataTransfer?.files) {
		main(e.dataTransfer.files);
	}
});

fileInput.addEventListener("change", (e) => {
	const input = e.currentTarget as HTMLInputElement;
	if (input.files) {
		main(input.files);
	}
});

async function main(files: FileList) {
	for (const file of files) {
		const worker: Worker = new HashWorker();

		worker.postMessage({ file } satisfies WorkerParams);

		worker.onmessage = (e: MessageEvent<WorkerResult>) => {
			const { hashes } = e.data;

			const result = new FileResult(file, hashes);
			resultsList.insertBefore(result, resultsList.firstChild);

			worker.terminate();
		};
	}
}
