import CryptoJS from "https://cdn.jsdelivr.net/npm/crypto-js@4.2.0/+esm";

const fileInput = document.querySelector("#fileInput");
const resultsList = document.querySelector("#resultsList");
const template = document.querySelector("template");

fileInput.addEventListener("change", async () => {
	for (const file of fileInput.files) {
		const fileBuffer = await file.arrayBuffer();

		const wordArray = CryptoJS.lib.WordArray.create(fileBuffer);
		const md5 = CryptoJS.MD5(wordArray).toString();

		const sha1 = await hash("SHA-1", fileBuffer);
		const sha256 = await hash("SHA-256", fileBuffer);
		const sha512 = await hash("SHA-512", fileBuffer);

		addRow(file, { md5, sha1, sha256, sha512 });
	}
});

function addRow({ name, size }, { md5, sha1, sha256, sha512 }) {
	const clonedTemplate = template.content.cloneNode(true);

	const items = [
		{ selector: ".name", value: name },
		{ selector: ".size", value: size },
		{ selector: ".md5", value: md5 },
		{ selector: ".sha1", value: sha1 },
		{ selector: ".sha256", value: sha256 },
		{ selector: ".sha512", value: sha512 },
	];

	for (const item of items) {
		clonedTemplate.querySelector(item.selector).textContent = item.value;
	}

	resultsList.insertBefore(clonedTemplate, resultsList.firstChild);
}

async function hash(algorithm, data) {
	const hashBuffer = await crypto.subtle.digest(algorithm, data);
	const byteArray = new Uint8Array(hashBuffer);

	return Array.from(byteArray)
		.map((byte) => byte.toString(16).padStart(2, "0"))
		.join("");
}
