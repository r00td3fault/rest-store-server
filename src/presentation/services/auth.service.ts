import { JwtAdapter, bcryptAdapter, envs } from "../../config";
import { UserModel } from "../../data";
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";
import { EmailService } from "./email.service";


export class AuthService {

    constructor(
        private emailService: EmailService
    ) { }

    public async registerUser(registerUserDto: RegisterUserDto) {

        const user = await UserModel.findOne({ email: registerUserDto.email });
        if (user) throw CustomError.badRequest('Email already exists');

        try {

            const user = new UserModel(registerUserDto);
            user.password = bcryptAdapter.hash(registerUserDto.password, 10);

            const newUser = await user.save();

            const token = await JwtAdapter.generateToken({ id: newUser.id });
            if (!token) throw CustomError.internalServer('Fail to generate token');

            await this.sendEmailValidationLink(user.email);
            const { password, ...rest } = UserEntity.fromObject(newUser);

            return {
                user: { ...rest, token }
            };

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }


    public async loginUser(loginUserDto: LoginUserDto) {

        const user = await UserModel.findOne({ email: loginUserDto.email });
        if (!user) throw CustomError.badRequest('Login data is not valid');

        const passwordMatch = bcryptAdapter.compare(loginUserDto.password, user.password);
        if (!passwordMatch) throw CustomError.badRequest('Login data is not valid');

        const { password, ...rest } = UserEntity.fromObject(user);

        const token = await JwtAdapter.generateToken({ id: user.id });
        if (!token) throw CustomError.internalServer('Fail to generate token');

        return {
            user: { ...rest },
            token
        };

    }

    private async sendEmailValidationLink(email: string): Promise<boolean> {

        const token = await JwtAdapter.generateToken({ email });
        if (!token) throw CustomError.internalServer('Fail to generate token');

        const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;
        const html = `
            <h1>Validate you email</h1>
            <p>Click on the followin linko to validate your email</p>
            <a href='${link}'>Validate your email </a>
        `;

        const options = {
            to: email,
            subject: 'validate your email',
            htmlBody: html
        };

        const isSent = await this.emailService.sendEmail(options);
        if (!isSent) throw CustomError.internalServer('Error sending email');

        return true;
    }

    public async validateEmail(token: string): Promise<boolean> {

        const payload = await JwtAdapter.validateToken(token);
        if (!payload) throw CustomError.unauthorized('invalid token');

        const { email } = payload as { email: string };
        if (!email) throw CustomError.internalServer('Email not n token');

        const user = await UserModel.findOne({ email });
        if (!user) throw CustomError.internalServer('Email not exists');

        user.emailValidated = true;
        await user.save();

        return true;
    }

}