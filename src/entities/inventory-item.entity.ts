import {
    Entity,
    MongoEntity,
    SerializedPrimaryKey,
    PrimaryKey,
    Property,
  } from "mikro-orm";
  import { ObjectId } from "mongodb";
  
  @Entity()
  export class InventoryItem implements MongoEntity<InventoryItem> {
    @PrimaryKey()
    _id!: ObjectId;
  
    @SerializedPrimaryKey()
    id!: string;
  
    @Property()
    name: string;
  
    @Property()
    description: string;
  
    @Property()
    user: string;
  
    @Property()
    location: string;
  
    @Property()
    inventoryNumber: number;
  
    @Property()
    createdAt: Date;
  
    @Property()
    modifiedAt: Date;
  
    @Property()
    active: boolean;
  
    public constructor(init?: Partial<InventoryItem>) {
      this.createdAt = new Date();
      Object.assign(this, init);
    }
  }
  