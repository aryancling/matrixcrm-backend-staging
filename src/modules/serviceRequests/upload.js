/* eslint-disable no-console */
const { uploadFile } = require('../../utils/uploadFile');

const uploadImage = async (req, res) => {
  try {
    const { base64String, fileType } = req.body;

    if (!base64String || typeof base64String !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Invalid base64 string provided.',
      });
    }

    if (!fileType || !['image', 'video'].includes(fileType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file type provided. Must be "image" or "video".',
      });
    }

    const base64Data = base64String.replace(/^data:([A-Za-z-+/]+);base64,/, '');
    const [, extMatch] = base64String.match(/\/([a-zA-Z]*);/) || [];
    const ext = extMatch || (fileType === 'image' ? 'jpeg' : 'mp4');

    const file = Buffer.from(base64Data, 'base64');

    const key = `uploads/${fileType === 'image' ? 'images' : 'videos'}/${Date.now()}.${ext}`;

    const uploadParams = {
      key,
      file,
      contentEncoding: 'base64',
      contentType: `${fileType}/${ext}`,
    };

    uploadFile(
      uploadParams,
      (url) =>
        res.status(200).send({
          status: 'success',
          message: 'File uploaded successfully',
          data: url,
        }),
      (err) =>
        res.status(500).send({
          status: 'failed',
          message: err?.message || 'Upload failed due to server error.',
        })
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = uploadImage;
