import { log } from 'console';
import multer from 'multer';
import path from 'path';

log('reached into multer')

const storage: multer.StorageEngine = multer.diskStorage({
  destination: (_req, _file, cb) => {
    log('multer is working ....!!')
    log(path.join(__dirname, '../../../images'), 'directory from path')
    cb(null, path.join(__dirname, '../../../images'));
  },
  filename: (_req, file, cb) => {
    const name = Date.now().toString() + '-' + file.originalname.split(' ').join('-');
    log(name, 'image name')
    cb(null, name);
  },
});

export const upload = multer({ storage });


