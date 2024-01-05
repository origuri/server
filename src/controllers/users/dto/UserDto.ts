export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
}

export class UserDto {
  private id: number;
  private firstName: string;
  private lastName: string;
  private age: number;

  constructor(user: IUser) {
    this.id = user.id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.age = user.age;
  }

  // user의 fullname을 가져오는 함수

  public getFullName = () => {
    return `${this.firstName} ${this.lastName}`;
  };
}
