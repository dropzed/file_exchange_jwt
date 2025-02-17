import ActionLog from "../models-postgres/ActionLog.js";


class LogService {
    static async logAction(userId, username, action, details= '') {
        try {
            // если username не предоставлены, используем "unregistered_user"
            const sanitizedUsername = username || 'unregistered_user';

            await ActionLog.create({
                userId,
                username,
                action,
                details,
            });
            console.log(`Action: ${action} was created for user^ ${sanitizedUsername}`);
        } catch (e) {
            console.error('Error creating log action', e.message);
        }
    }
}

export default LogService;