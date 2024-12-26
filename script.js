import CryptoJS from "https://cdn.jsdelivr.net/npm/crypto-js@4.2.0/+esm";

const fileInput = document.querySelector("#fileInput");
const resultsList = document.querySelector("#resultsList");
const template = document.querySelector("template");

fileInput.addEventListener("change", async () => {
	for (const file of fileInput.files) {
		const fileBuffer = await readFileAsArrayBuffer(file);
		const hashes = await calculateHashes(fileBuffer);

		addRow(file, hashes);
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

async function calculateHashes(buffer) {
	const wordArray = CryptoJS.lib.WordArray.create(buffer);
	const md5 = CryptoJS.MD5(wordArray);
	const sha1 = CryptoJS.SHA1(wordArray);
	const sha256 = CryptoJS.SHA256(wordArray);
	const sha512 = CryptoJS.SHA512(wordArray);

	return {
		md5: md5.toString(CryptoJS.enc.Hex),
		sha1: sha1.toString(CryptoJS.enc.Hex),
		sha256: sha256.toString(CryptoJS.enc.Hex),
		sha512: sha512.toString(CryptoJS.enc.Hex),
	};
}

async function readFileAsArrayBuffer(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = (event) => resolve(event.target.result);
		reader.onerror = (error) => reject(error);
		reader.readAsArrayBuffer(file);
	});
}
