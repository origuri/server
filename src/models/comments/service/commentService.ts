import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import CreateCommentDto from "../dto/create-comment.dto";
import { getConnection } from "../../../dbPromiseConnection";
import { CreateChildCommentDto } from "../dto/create-child-comment.dto";
import { UserService } from "../../users/service/userService";

export class CommentService {
  public userService;

  constructor() {
    this.userService = new UserService();
  }
  //props : createCommentDto, 부모 댓글
  public createComment = async (props: CreateCommentDto) => {
    const db: Pool = await getConnection();

    try {
      // 유저 인증 부터
      const user = await this.userService.findById(props.getUserId());

      if (!user)
        throw { status: 404, message: "댓글 서비스 : 없는 유저입니다." };

      const post = await db.query<RowDataPacket[]>(
        "select * from post where id = ? ",
        [props.getPostId()]
      );

      if (post[0].length === 0)
        throw { status: 404, message: "댓글 서비스 : 없는 포스트입니다. " };

      const newComment = await db.query<ResultSetHeader>(
        "insert into comment(content, userId, postId) values(?,?,?)",
        [props.getContnent(), user.id, post[0][0].id]
      );
      console.log("이거 확인 -> ", newComment[0].insertId);

      return newComment[0].insertId;
    } catch (error) {
      console.error(error);
    } finally {
      db.end();
    }
  };

  // 대댓글
  public createChildComment = async (props: CreateChildCommentDto) => {
    const db: Pool = await getConnection();
    try {
      // 유저 확인
      const user = await this.userService.findById(props.getUserId());
      if (!user) throw { status: 404, message: "자식 댓글 : 유저 없음" };

      const parentComment = await db.query<RowDataPacket[]>(
        "select * from comment where id = ?",
        [props.getParentCommentId()]
      );
      console.log(
        props.getContnent(),
        parentComment[0][0].id,
        user.id,
        parentComment[0][0].postId
      );

      if (parentComment[0].length === 0) {
        throw { status: 404, message: "자식 댓글 : 부모 댓글이 없습니다." };
      }

      const childcommentId = await db.query<ResultSetHeader>(
        "insert into comment(content, parentCommentId, userId, postId) values(?,?,?,?)",
        [
          props.getContnent(),
          parentComment[0][0].id,
          user.id,
          parentComment[0][0].postId,
        ]
      );

      return childcommentId[0].insertId;
    } catch (err) {
      console.log(err);
    } finally {
      db.end();
    }
  };
}
