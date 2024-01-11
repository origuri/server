import { TagDto } from "../../tags";
import { IUser, UserDto } from "../../users/dto";

export interface IPostsDtoProps {
  postId: string;
  title: string;
  content: string;
  createAt: Date;
  userId: string;
  email: string;
  name: string;
  description: string;
  password: string;
}

export class PostsDto {
  private id;
  private title;
  private content;
  private createAt;
  private user;

  constructor(props: IPostsDtoProps) {
    this.id = props.postId;
    this.title = props.title;
    this.content = props.content;
    this.createAt = props.createAt;
    this.user = new UserDto({
      id: props.userId,
      email: props.email,
      password: props.password,
      description: props.description,
      name: props.name,
    });
  }
}
