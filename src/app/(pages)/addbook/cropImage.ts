interface PixelCrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const getCroppedImg = (
  imageSrc: string,
  pixelCrop: PixelCrop,
  outputSize: { width: number, height: number }
) => {
  const canvas = document.createElement('canvas');
  canvas.width = outputSize.width;
  canvas.height = outputSize.height;
  const ctx = canvas.getContext('2d');

  const image = new Image();
  image.src = imageSrc;

  return new Promise<string>((resolve, reject) => {
    image.onload = () => {
      if (ctx) {
        ctx.drawImage(
          image,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          outputSize.width,
          outputSize.height
        );
        resolve(canvas.toDataURL('image/jpeg'));
      }
    };
    image.onerror = (error) => reject(error);
  });
};
