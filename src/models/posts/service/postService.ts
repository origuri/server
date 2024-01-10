import { Pool, ResultSetHeader } from "mysql2/promise";
import { CreatePostDto } from "../dto";
import { getConnection } from "../../../dbPromiseConnection";
import { UserService } from "../../users/service/userService";
import { IUser } from "../../users/dto";
import { TagService } from "../../tags";

export class PostService {
  public userService;
  public tagService;

  constructor() {
    this.userService = new UserService();
    this.tagService = new TagService();
  }

  // props : createPostDto
  public createPost = async (props: CreatePostDto) => {
    const db: Pool = await getConnection();
    console.log({ props });

    try {
      // 유효한 유저인지 확인.
      const user = await this.userService.findById(props.getUserId());

      const newPost = await db.query<ResultSetHeader>(
        "insert post (title, content, userId) values(?,?,?)",
        /*  user 타입 정해서 as로 강제 캐스팅하기  */
        [props.getTitle(), props.getContent(), (user as IUser).id]
      );
      console.log("여기 나옴?");

      if (!newPost || newPost[0].affectedRows === 0) {
        throw { status: 400, message: "post 등록 실패" };
      }
      await this.tagService.insertTag(
        newPost[0].insertId + "",
        props.getTags()
      );

      return newPost[0].insertId;
    } catch (error) {
      console.error(error);
    } finally {
      db.end();
    }
  };
}
