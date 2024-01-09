export interface IUser {
  id: number;
  name: string;
  email: string;

  description: string;
}

export class UserDto {
  private id: number;
  private name: string;
  private email: string;
  private description: string;

  constructor(props: IUser) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;

    this.description = props.description;
  }
}
