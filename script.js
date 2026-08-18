const uploadInput = document.getElementById('upload');
const canvas = document.getElementById('previewCanvas');
const ctx = canvas.getContext('2d');
const downloadBtn = document.getElementById('downloadBtn');
const zoomRange = document.getElementById('zoomRange');

const MOLDURA_URL = 'moldura.png';
const molduraImg = new Image();
molduraImg.src = MOLDURA_URL;

let userImage = null;
let imgX = 0;
let imgY = 0;
let imgScale = 1;
let isDragging = false;
let startX = 0;
let startY = 0;

molduraImg.onload = () => {
  drawCanvas();
};

uploadInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    userImage = new Image();
    userImage.onload = () => {
      const baseScale = Math.max(canvas.width / userImage.width, canvas.height / userImage.height);
      imgScale = baseScale;
      imgX = (canvas.width - userImage.width * imgScale) / 2;
      imgY = (canvas.height - userImage.height * imgScale) / 2;

      zoomRange.value = 1;
      zoomRange.disabled = false;
      downloadBtn.disabled = false;
      drawCanvas();
    };
    userImage.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

zoomRange.addEventListener('input', (e) => {
  if (!userImage) return;
  const factor = parseFloat(e.target.value);
  const baseScale = Math.max(canvas.width / userImage.width, canvas.height / userImage.height);
  
  const centerX = imgX + (userImage.width * imgScale) / 2;
  const centerY = imgY + (userImage.height * imgScale) / 2;
  
  imgScale = baseScale * factor;
  imgX = centerX - (userImage.width * imgScale) / 2;
  imgY = centerY - (userImage.height * imgScale) / 2;

  drawCanvas();
});

canvas.addEventListener('mousedown', (e) => {
  if (!userImage) return;
  isDragging = true;
  const rect = canvas.getBoundingClientRect();
  const scaleRatio = canvas.width / rect.width;
  startX = e.clientX * scaleRatio - imgX;
  startY = e.clientY * scaleRatio - imgY;
});

window.addEventListener('mousemove', (e) => {
  if (!isDragging || !userImage) return;
  const rect = canvas.getBoundingClientRect();
  const scaleRatio = canvas.width / rect.width;
  imgX = e.clientX * scaleRatio - startX;
  imgY = e.clientY * scaleRatio - startY;
  drawCanvas();
});

window.addEventListener('mouseup', () => {
  isDragging = false;
});

canvas.addEventListener('touchstart', (e) => {
  if (!userImage || e.touches.length !== 1) return;
  isDragging = true;
  const rect = canvas.getBoundingClientRect();
  const scaleRatio = canvas.width / rect.width;
  startX = e.touches[0].clientX * scaleRatio - imgX;
  startY = e.touches[0].clientY * scaleRatio - startY;
});

canvas.addEventListener('touchmove', (e) => {
  if (!isDragging || !userImage || e.touches.length !== 1) return;
  const rect = canvas.getBoundingClientRect();
  const scaleRatio = canvas.width / rect.width;
  imgX = e.touches[0].clientX * scaleRatio - startX;
  imgY = e.touches[0].clientY * scaleRatio - startY;
  drawCanvas();
});

canvas.addEventListener('touchend', () => {
  isDragging = false;
});

function drawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (userImage) {
    ctx.drawImage(userImage, imgX, imgY, userImage.width * imgScale, userImage.height * imgScale);
  } else {
    ctx.fillStyle = '#f0f4f8';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#888888';
    ctx.font = '32px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Sua foto aparecerá aqui', canvas.width / 2, canvas.height / 2);
  }

  if (molduraImg.complete) {
    ctx.drawImage(molduraImg, 0, 0, canvas.width, canvas.height);
  }
}

downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'foto-karina-paiva-1022.png';
  link.href = canvas.toDataURL('image/png', 1.0);
  link.click();
});
