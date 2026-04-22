import { User } from "../entities/User";
import { UserRepository } from "../repository/userRepository";

export const createUser = async (userData: any) => {
    const user = new User();
    user.email = userData.email;
    user.password = userData.password;
    user.firstName = userData.firstName;
    user.lastName = userData.lastName;
    user.role = userData.role;  
    return await UserRepository.save(user);
};
export const findUserByID = async (id: number) => {
    return await UserRepository.findOneBy({ id });
};
export const findUserByEmail = async (email: string) => {
    return await UserRepository.findOneBy({ email });
};
export const findAllUsers = async () => {
    return await UserRepository.find();
};