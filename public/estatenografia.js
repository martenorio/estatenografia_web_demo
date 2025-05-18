const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

document.getElementById('imageInput').addEventListener('change', function (e) {
    const reader = new FileReader();
    reader.onload = function (event) {
        const img = new Image();
        img.onload = function () {
            calculateMaxMessageSize(img);
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(e.target.files[0]);
});

function textToBinary(text) {
    return [...text].map(c =>
        c.charCodeAt(0).toString(2).padStart(8, '0')
    ).join('');
}

function binaryToText(bin) {
    let text = '';
    for (let i = 0; i < bin.length; i += 8) {
        text += String.fromCharCode(parseInt(bin.slice(i, i + 8), 2));
    }
    return text;
}

function intToLittleEndianBits(n) {
    const buffer = new ArrayBuffer(4);
    new DataView(buffer).setUint32(0, n, true); // little endian
    return [...new Uint8Array(buffer)]
        .map(byte => byte.toString(2).padStart(8, '0'))
        .join('');
}

function littleEndianBitsToInt(bits) {
    const bytes = [];
    for (let i = 0; i < 32; i += 8) {
        bytes.push(parseInt(bits.slice(i, i + 8), 2));
    }
    const buffer = new Uint8Array(bytes).buffer;
    return new DataView(buffer).getUint32(0, true); // little endian
}

function hideMessage() {
    const message = document.getElementById('messageInput').value;
    const encoder = new TextEncoder();
    const msgBytes = encoder.encode(message); // igual que Encoding.UTF8
    let msgBin = [...msgBytes].map(b => b.toString(2).padStart(8, '0')).join('');
    const lengthBin = intToLittleEndianBits(msgBytes.length);
    const fullBin = lengthBin + msgBin;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const usableChannels = ['r', 'g', 'b'];
    let bitIndex = 0;

    for (let i = 0; i < data.length && bitIndex < fullBin.length; i += 4) {
        for (let j = 0; j < 3 && bitIndex < fullBin.length; j++) {
            data[i + j] = (data[i + j] & 0xFE) | parseInt(fullBin[bitIndex]);
            bitIndex++;
        }
    }

    ctx.putImageData(imageData, 0, 0);
    alert("✅ Mensaje ocultado en la imagen.");
}

function extractMessage() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let bits = '';
    for (let i = 0; i < data.length; i += 4) {
        bits += (data[i] & 1).toString();     // R
        bits += (data[i + 1] & 1).toString(); // G
        bits += (data[i + 2] & 1).toString(); // B
    }

    const lengthBits = bits.slice(0, 32);
    const msgLength = littleEndianBitsToInt(lengthBits);

    if (msgLength > bits.length - 32) {
        alert("❌ Tamaño de mensaje inválido o imagen no contiene mensaje.");
        return;
    }

    const messageBits = bits.slice(32, 32 + (msgLength * 8));
    const messageBytes = [];

    for (let i = 0; i < messageBits.length; i += 8) {
        messageBytes.push(parseInt(messageBits.slice(i, i + 8), 2));
    }

    const decoder = new TextDecoder();
    const message = decoder.decode(new Uint8Array(messageBytes));
    alert("💬 Mensaje extraído: " + message);
}

function downloadImage() {
    const link = document.createElement('a');
    link.download = 'imagen_con_mensaje.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}
// VALIDACIONES

let maxBytesAllowed = 0;

function calculateMaxMessageSize(img) {
  const width = img.width;
  const height = img.height;
  const maxBits = width * height * 3;
  const maxBytes = Math.floor(maxBits / 8) - 4;
  maxBytesAllowed = maxBytes;

  document.getElementById('maxSize').textContent =
    `Tamaño máximo permitido: ${maxBytes.toLocaleString()} bytes (~${Math.floor(maxBytes / 1024)} KB)`;

  updateMessageInfo(); // actualizar al momento de cargar imagen
}
const messageInput = document.getElementById('messageInput');
const messageInfo = document.getElementById('messageInfo');

messageInput.addEventListener('input', updateMessageInfo);

function updateMessageInfo() {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(messageInput.value);
  const byteLength = bytes.length;

  messageInfo.textContent = `Bytes escritos: ${byteLength} / ${maxBytesAllowed}`;

  if (byteLength > maxBytesAllowed) {
    messageInfo.style.color = 'red';
  } else {
    messageInfo.style.color = 'green';
  }
}