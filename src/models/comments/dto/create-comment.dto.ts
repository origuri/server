interface ICreateCommentDtoProps {
  content: string;
  postId: string;
  userId: string;
}

export default class CreateCommentDto {
  private content: string;
  private postId: string;
  private userId: string;

  constructor(props: ICreateCommentDtoProps) {
    this.content = props.content;
    this.postId = props.postId;
    this.userId = props.userId;
  }

  public getContnent = () => {
    return this.content;
  };

  public getPostId = () => {
    return this.postId;
  };

  public getUserId = () => {
    return this.userId;
  };
}
