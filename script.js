const fileInput = document.getElementById("fileInput");
const resultsList = document.getElementById("resultsList");

fileInput.addEventListener("change", async () => {
  if (fileInput.files.length > 0) {
    for (const file of fileInput.files) {
      const fileBuffer = await readFileAsArrayBuffer(file);

      const { md5, sha1, sha256, sha512 } = await calculateHashes(fileBuffer);

      const fileInfoRow = document.createElement("tr");
      fileInfoRow.innerHTML = `<b class="table-padding">${file.name}</b> - ${file.size} bytes`;

      const hashInfoRow = document.createElement("tr");
      hashInfoRow.innerHTML = `
        <b class="table-padding">MD5</b>: ${md5}<br>
        <b class="table-padding">SHA1</b>: ${sha1}<br>
        <b class="table-padding">SHA256</b>: ${sha256}<br>
        <b class="table-padding">SHA512</b>: ${sha512}
      `;

      resultsList.insertBefore(hashInfoRow, resultsList.firstChild);
      resultsList.insertBefore(fileInfoRow, resultsList.firstChild);
    }
  }
});

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
