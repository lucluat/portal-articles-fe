export const convertFileToBase64 = (fileConvert) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.onload = () => {
      const base64String = fileReader.result.split(",")[1];
      resolve(base64String);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };

    fileReader.readAsDataURL(fileConvert);
  });
};

export const convertFileToBase64Only = (fileConvert) => {
  return convertFileToBase64(fileConvert);
};
