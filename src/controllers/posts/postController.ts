import { Request, Response, Router } from "express";
import { connection, format, getCreateMapper } from "../../dbConnection";
import MybatisMapper from "mybatis-mapper";
import { Field, ResultSetHeader } from "mysql2";

getCreateMapper();

class Postcontroller {
  private posts = [
    {
      id: 1,
      title: "제목 1",
      contents: "내용 1",
    },
    {
      id: 2,
      title: "제목 2",
      contents: "내용 2",
    },
  ];

  public router: Router;
  public path: string = "/posts";

  constructor() {
    this.router = Router();
    this.init();
  }

  private init() {
    this.router.get("/", this.getPosts);
    this.router.delete("/:id", this.deletePost);
    this.router.patch("/:id", this.patchPost);
  }

  private getPosts = (req: Request, res: Response) => {
    //MybatisMapper.createMapper(["./src/mybatis-mapper/PostMapper.xml"]);
    let query = MybatisMapper.getStatement("PostMapper", "getPosts", format);
    console.log("마이바티스 쿼리 -> ", query);

    //connection.connect();
    connection.query(
      query,
      (err: any, result: ResultSetHeader, fields: Field) => {
        if (err) {
          console.log("에러 발생-> ", err);
        }
        console.log("결과 -> ", result);
        res.status(200).json({ result });
      }
    );
    //connection.end();
    //res.status(200).json({ posts: this.posts });
  };

  private deletePost = (req: Request, res: Response) => {
    const { id } = req.params;
    const newPosts = this.posts.filter((post) => post.id !== Number(id));
    this.posts = newPosts;
    res.status(204).json({});
  };

  private patchPost = (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, contents } = req.body;
    const findPostIndex = this.posts.findIndex(
      (post) => post.id === Number(id)
    );

    this.posts[findPostIndex] = {
      id: Date.now(),
      title: title ?? this.posts[findPostIndex].title,
      contents: contents ?? this.posts[findPostIndex].contents,
    };
    res.status(204).json({});
  };
}

const postcontroller = new Postcontroller();

export default postcontroller;
