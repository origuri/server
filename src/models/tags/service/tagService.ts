import { Pool, ResultSetHeader } from "mysql2/promise";
import { getConnection } from "../../../dbPromiseConnection";

export class TagService {
  public insertTag = async (postId: string, tags: string[]) => {
    const db: Pool = await getConnection();

    try {
      const insertPromise = tags.map(async (tag) => {
        const newTag = await db.query<ResultSetHeader>(
          "insert into tag(name, postId) values (?,?)",
          [tag, postId]
        );
        if (newTag) {
          return newTag[0].insertId;
        } else throw { status: 400, message: "태그 등록 실패" };
      });
      // map함수에 있는 동기, 비동기가 끝날 때 까지 대기.
      // map에 있는 async가 끝나기도 전에 db.end가 실행되는 것을 방지하기 위함.
      await Promise.all(insertPromise);
    } catch (err) {
      console.error(err);
    } finally {
      db.end();
    }
  };
}
