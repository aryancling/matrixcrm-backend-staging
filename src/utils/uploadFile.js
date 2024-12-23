const s3 = require('../../config/aws-config');

module.exports = {
  uploadFile: async (
    uploadData,
    successCallback = () => {},
    failCallback = () => {}
  ) => {
    const uploadParams = {
      Bucket: uploadData?.bucketName || 'etmmam-image-videos',
      Key: uploadData.key,
      Body: uploadData.file,
      ContentType: uploadData.contentType,
    };

    try {
      const data = await s3.upload(uploadParams).promise();
      successCallback(data?.Location);
      return data;
    } catch (err) {
      failCallback(err);
    }
  },
};
