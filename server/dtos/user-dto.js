export class UserDto {
    email;
    id;
    isActivated;
    role;

    constructor(model) {
        if (!model) throw new Error('Model is required');
        this.email = model.email || '';
        this.id = model.id || null;
        this.isActivated = model.isActivated ?? false;
        this.role = model.role || 'user';
    }
}