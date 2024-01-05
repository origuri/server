export class CreateUserDto {
  private firstName: string;
  private lastName: string;
  private age: number;

  constructor(firstName: string, lastName: string, age: number) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
  }

  public getNewUser = () => {
    return {
      id: Date.now(),
      firstName: this.firstName,
      lastName: this.lastName,
      age: this.age,
    };
  };
}
