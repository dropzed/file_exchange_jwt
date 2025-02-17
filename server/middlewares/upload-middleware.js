import multer from "multer";
import * as path from "path";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';

// Определение __dirname так как ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Настройка Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) { // вроде надо, но нигде не используется
        const uploadDir = join(__dirname, '../public/uploads');
        if (!uploadDir) {
            console.error('Upload directory is undefined!');
            return cb(new Error('Upload directory is not defined'), null);
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = uuidv4();
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});


const upload = multer({storage: storage});

export default upload;