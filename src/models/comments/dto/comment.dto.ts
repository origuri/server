export interface ICommentDtoPorps {
  id: string;
  content: string;
  parentCommentId: string | null;
  userId: string;
  postId: string;
  childComments: any[];
}

export class CommentDto {
  id;
  content;
  parentCommentId;
  userId;
  postId;
  childComment: any[];

  constructor(props: ICommentDtoPorps) {
    this.id = props.id;
    this.content = props.content;
    this.parentCommentId = props.parentCommentId;
    this.userId = props.userId;
    this.postId = props.postId;
    this.childComment = props.childComments || [];
  }
}
