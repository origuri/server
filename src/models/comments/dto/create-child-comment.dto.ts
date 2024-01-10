interface ICreateChildCommentDtoProps {
  content: string;
  parentCommentId: string;
  userId: string;
}

export class CreateChildCommentDto {
  private content: string;
  private parentCommentId: string;
  private userId: string;

  // 부모 댓글에 postId가 있기 때문에 안넣어도 됨.
  constructor(props: ICreateChildCommentDtoProps) {
    this.content = props.content;
    this.parentCommentId = props.parentCommentId;
    this.userId = props.userId;
  }

  public getContnent = () => {
    return this.content;
  };

  public getParentCommentId = () => {
    return this.parentCommentId;
  };

  public getUserId = () => {
    return this.userId;
  };
}
