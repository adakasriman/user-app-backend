class UserSignupDTO {
    constructor({ userName, email, password }) {
        this.userName = userName?.trim();
        this.email = email?.toLowerCase().trim();
        this.password = password;
    }
}

class UserLoginDTO {
    constructor({ email, password }) {
        this.email = email?.toLowerCase().trim();
        this.password = password;
    }
}

module.exports = { UserSignupDTO, UserLoginDTO };
