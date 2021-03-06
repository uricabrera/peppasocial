import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import {Field, ObjectType, Int} from "type-graphql";



// Entity for Post
@ObjectType()
@Entity()
export class Post {
    @Field(() => Int)
    @PrimaryKey()
    id!: number;

    @Field(() => String)
    @Property({type: "date", default: "NOW()"})
    createdAt = new Date();

    @Field(() => String)
    @Property({type: "date",onUpdate: () => new Date()})
    updatedAt = new Date();

    @Field(() => String)
    @Property({type: "text"})
    title!: string;
}
