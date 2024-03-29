import { CommentDto } from "../../comments/dto/comment.dto";
import { TagDto } from "../../tags";
import { IUser, UserDto } from "../../users/dto";

export interface ITag {
  tagId: string;
  tagName: string;
}

export interface IPostDtoProps {
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

export class PostDto {
  private id;
  private title;
  private content;
  private createAt;
  private user;
  private comments;
  private tags;

  constructor(
    props: IPostDtoProps,
    tagProps: ITag[],
    commentProps: CommentDto[]
  ) {
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
    this.comments = commentProps;
    this.tags = tagProps.map(
      (tag) =>
        new TagDto({
          id: tag.tagId,
          name: tag.tagName,
        })
    );
  }
}
