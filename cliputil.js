export const makeTransparentImageData = (w, h) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const imageData = ctx.createImageData(w, h);
  for (let i = 0; i < imageData.data.length; i += 4) {
    imageData.data[i + 0] = 0; // r
    imageData.data[i + 1] = 0; // g
    imageData.data[i + 2] = 0; // b
    imageData.data[i + 3] = 0; // a 0:full transparent, 255:no transparent
  }
  return imageData;
};
export const toCanvasFromImageData = (imgdata) => {
  const canvas = document.createElement("canvas");
  canvas.width = imgdata.width;
  canvas.height = imgdata.height;
  const g = canvas.getContext("2d");
  g.putImageData(imgdata, 0, 0);
  return canvas;
};
export const writeClipboardImage = async (blob) => {
  await navigator.clipboard.write([
    new ClipboardItem({
      [blob.type]: blob,
    }),
  ]);
};
export const getBlob = async (canvas) => {
  return new Promise((resolve) => {
    canvas.toBlob(resolve);
  });
};
export const readClipboardCanvas = async () => {
  const clipboardItems = await navigator.clipboard.read();
  for (const clipboardItem of clipboardItems) {
    for (const type of clipboardItem.types) {
      const blob = await clipboardItem.getType(type);
      const ctype = blob.type;
      if (ctype == "image/png") {
        const bin = new Uint8Array(await blob.arrayBuffer());
        const imgdata = decodePNG(bin);
        const canvas = toCanvasFromImageData(imgdata);
        return canvas;
      }
    }
  }
  return null;
};
//
export const writeClipboardCanvas = async (canvas) => {
  const blob = await getBlob(canvas);
  await writeClipboardImage(blob);
};
export const makeTransparentCanvas = (w, h) => {
  const imgd = makeTransparentImageData(w, h);
  const canvas = toCanvasFromImageData(imgd);
  return canvas;
};
