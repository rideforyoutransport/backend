const logger = require('../../helpers/logger.js');
const utils = require('../../helpers/utils.js');
const router = require('express').Router();
const path = require('path');
const fs = require("fs");

const { pb } = require('../../pocketbase/pocketbase.js');
const multer = require('multer');

// Configure Multer Storage
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploaded_images/');
    },
    filename: (req, file, cb) => {
        let new_file_name = new Date().getTime() + '.' + file.originalname.split('.').pop();
        cb(null, new_file_name);
    },
    onError: (err, next) => {
        logger.error(err);
        next(err);
    }
});

// Check File Type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Only Images Allowed!');
    }
}

// Configure Multer Upload
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
});

// PATCH /upload Endpoint
router.patch('/upload/:obj/:id', upload.single('file'), async (req, res) => {
    console.log('Request received'); // Debug statement
    const params = Object.assign({}, req.params);

    const file = req.file;
    console.log('File:', file,params); // Debug statement

    if (!file) {
        console.log('No file uploaded or invalid file type'); // Debug statement
        return res.status(400).send({ error: 'No file uploaded or invalid file type' });
    }

    const details = {
        image_full_path: file.path,
        image: file.filename,
        image_content_type: file.mimetype
    };

    try {
      const formData = new FormData();

      formData.append(
        "avatar",
        new Blob([fs.readFileSync(file.path)]),
        file.filename
      );
      
      const record = await pb.collection(`${req.params.obj}`).update(params.id, formData);
      // const createdRecord = await pb.collection("images").create(formData);
      
      //Delete the image from localstore after s3 upload 
      fs.unlink(file.path, (err) => {
        if (err) {
          console.error(`Error removing file: ${err}`);
          return;
        }
      
        console.log(`File ${file.path} has been successfully removed.`);
      });

        return res.status(200).send({
            success: true,
            result: details,
            record:record
        });
    } catch (error) {
        console.log(error);
        logger.error(error);
        res.status(400).send({ error });
    }
});

module.exports = router;
