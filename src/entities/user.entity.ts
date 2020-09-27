import {
  Entity,
  MongoEntity,
  SerializedPrimaryKey,
  PrimaryKey,
  Property,
} from "mikro-orm";

import { ObjectId } from "mongodb";

@Entity()
export class User implements MongoEntity<User> {
  @PrimaryKey()
  _id!: ObjectId;

  @SerializedPrimaryKey()
  id!: string;

  @Property()
  firstName!: string;

  @Property()
  lastName!: string;

  @Property()
  email!: string;

  @Property()
  hash: string;

  @Property()
  salt: string;

  public constructor(init?: Partial<User>) {
    Object.assign(this, init);
  }
}
