import {Resolver, Query, Mutation, Arg, InputType, Ctx, Field, ObjectType} from "type-graphql";
import {MyContext} from "../types";
import argon2 from "argon2";
import {User} from "../entities/User";

//UserResolver


@InputType()
class UsernamePasswordInput{
    @Field()
    username: string
    @Field()
    password: string
}

@ObjectType()
class FieldError {
    @Field()
    field: string;
    @Field()
    message: string;
}

@ObjectType()

class UserResponse{
    @Field(() => [FieldError] , {nullable: true})
    errors?: FieldError[];
    @Field(() => User, {nullable: true})
    user?: User;
}


@Resolver()
export class UserResolver {
    @Mutation(() => User)
    async register(
        @Arg("options") options: UsernamePasswordInput,
        @Ctx() {em}: MyContext
    ): Promise<UserResponse>{
        const hashedPasssword = await argon2.hash(options.password);
        const user = em.create(User,{username: options.username,
        password: hashedPasssword});
        await em.persistAndFlush(user);
        return {user};
    }
    @Mutation(() => UserResponse)
    async login(
        @Arg("options") options: UsernamePasswordInput,
        @Ctx() {em}: MyContext
    ): Promise<UserResponse> {
        const user = await em.findOne(User,{username: options.username});
        if(!user){
            return{
                errors: [{
                    field: "username",
                    message: "username does not exist"
                }]
            };
        }
        const valid = await argon2.verify(user.password,options.password);
        if(!valid){
            return{
                errors: [
                    {
                        field: "password",
                        message: "Password is not correct"
                    }
                ]
            }
        }


        return {
            user
        };
    }
}