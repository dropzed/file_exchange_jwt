import File from '../models-postgres/File.js';
import logService from "../services/logService.js";
import User from "../models-postgres/User.js";

class ActionsWithFiles {
    static async upload(req, res) {
        try {
            const file = req.file;
            const { email } = req.user
            if (!file) {
                return res.status(400).send('No file uploaded');
            }

            const newFile = new File({
                name: req.file.filename,
                originalName: file.originalname,
                size: file.size,
                path: file.path,
                isPrivate: req.body.isPrivate === 'true',
                userId: req.user.id,
            });

            await newFile.save();

            const user = await User.findOne({where: {email} })
            // запись действия в журнал
            await logService.logAction(user.id, user.email, 'user_upload_file', 'User was uploaded file');


            res.status(201).send('Successfully uploaded file');
        } catch (e) {
            console.error(e);
            res.status(500).send('Server error uploading file');
        }
    }

    static async downloadFile(req, res) {
        try {
            const file = await File.findOne({ where: { name: req.params.filename } });
            if (!file) {
                return res.status(404).send('File not found');
            }

            // проверяем, является ли файл приватным
            if (file.isPrivate) {
                // если файл приватный, проверяем авторизацию
                if (!req.user) {
                    return res.status(403).send('Access denied.');
                }

                // проверяем, принадлежит ли файл текущему пользователю
                if (file.userId !== req.user.id) {
                    return res.status(403).send('Access denied.');
                }
            }

            // отправляем файл для скачивания
            res.download(file.path, file.originalName, async (err) => {
                if (err) {
                    console.error('Error sending file:', err);
                    return res.status(500).send('Server error.');
                }

                // запись действия в журнал
                try {
                    const userId = req.user ? req.user.id : null; // Используем ID пользователя, если он авторизован
                    const username = req.user ? req.user.email : 'unregistered_user'; // Используем email, если пользователь авторизован

                    await logService.logAction(
                        userId,
                        username,
                        'file_downloaded',
                        `File: ${file.originalName}`
                    );
                    console.log(`Действие будет не записано в базу данных, если пользователь не зарегистрирован => Действия незарегистрированных пользователей не сохраняются: ${username}`);
                } catch (logError) {
                    console.error('Ошибка записи лога:', logError.message);
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Server error.');
        }
    }
}

export default ActionsWithFiles;