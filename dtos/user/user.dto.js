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

class UserDataDTO {
    constructor({ email, name, id }) {
        this.email = email?.toLowerCase().trim();
        this.id = id;
        this.userName = name?.trim();
    }
}

module.exports = { UserSignupDTO, UserLoginDTO, UserDataDTO };
