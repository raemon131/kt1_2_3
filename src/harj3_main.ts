export interface Entity {
  readonly id: string;
}

export interface User extends Entity {
  name: string;
  age: number;
}

export abstract class BaseRepository<T extends Entity> {
  private items: Map<string, T> = new Map();
 
  protected log(action: string, entityId: string): void {
    console.log(`[${action}] ${entityId}`);
  }
 
  public add(item: T): void {
    this.items.set(item.id, item);
    this.log("ADD", item.id);
  }
 
  public getById(id: string): T | undefined {
    return this.items.get(id);
  }
 
  public getAll(): readonly T[] {
    return Array.from(this.items.values());
  }
 
  public abstract validate(item: T): boolean;
}

export class UserRepository extends BaseRepository<User> {
  public validate(item: User): boolean {
    return item.age >= 18 && item.name.length > 0;
  }
 
  public override add(item: User): void {
    if (!this.validate(item)) {
      throw new Error(`Invalid user: ${item.id}`);
    }
    super.add(item);
  }
}
