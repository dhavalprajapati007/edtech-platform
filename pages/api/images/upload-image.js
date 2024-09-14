import aws from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { apiError, successapi } from "../../../helpers/responseHelper";
import withMiddleware from "../middleware";

const { SUCCESS, SERVERERROR, NOTFOUND } = process.env;

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
          cb(null, file.originalname);
        }
    })
});

export const config = {
  api: {
    bodyParser: false // Disallow body parsing, consume as stream
  }
}

const uploadImage = async (req, res) => {
  try {
    upload.array('images')(req, res, async (err) => {
      if (err) {
        return apiError(res, err.message, SERVERERROR);
      }
      const imageUrls = req?.files.map(file => `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${file.originalname}`);

      return successapi(res, "Images uploaded successfully.", SUCCESS, imageUrls);
    });
  } catch (err) {
    return apiError(res, "Something went wrong, please try again later.", SERVERERROR);
  }
}

export default withMiddleware(uploadImage);