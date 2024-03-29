export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  description: string;
}

export class UserDto {
  private id: string;
  private name: string;
  private email: string;
  private description: string;
  private password: string;

  constructor(props: IUser) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.password = props.password;
    this.description = props.description;
  }

  public getUserId = () => {
    return this.id;
  };

  public getUserName = () => {
    return this.name;
  };

  public getUserEmail = () => {
    return this.email;
  };

  public getUserDescription = () => {
    return this.description;
  };
  public getUserPassword = () => {
    return this.password;
  };
}
