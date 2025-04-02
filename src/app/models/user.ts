export class User {
    constructor(
        public email: string,
        public firstName: string,
        public lastName: string,
        public login: string,
        public langKey: string,
        public displayName: string,
        public roles: string[],
        public username: string
    ) {}
}

export class Login {
    constructor(
        public username: string,
        public password: string,
        public rememberMe: boolean
    ) {}
}
