import { IRegisterUser } from "../../auth/dto";
import { getConnection } from "../../../dbPromiseConnection";
import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";

import { UpdateUserDto } from "../dto/UpdateUserDto";

export class UserService {
  // 5가지 서비스를 만들 것.
  // findById, findMany, create, update, delete

  // findById
  public findById = async (id: string) => {
    const db: Pool = await getConnection();

    try {
      const user = await db.query<RowDataPacket[]>(
        "select * from user where id = ?",
        [id]
      );

      if (!user[0].length)
        throw { status: 404, message: "유저가 없습니다. findById" };

      return user[0][0];
    } catch (error) {
      console.error(error);
    } finally {
      db.end();
    }
  };

  // email 중복 체크
  public checkUserByEmail = async (email: string) => {
    const db: Pool = await getConnection();
    try {
      // select는 rowDataPacket인듯?
      const user = await db.query<RowDataPacket[]>(
        "select * from user where email = ?",
        [email]
      );
      // 뭐든지 배열 첫번째 값을 가져와서 봐야됨.
      console.log("user.length", user[0].length);
      console.log({ user: user[0][0].password });

      if (user[0].length > 0) {
        return user[0][0]; // jwt발급을 위해 객체를 리턴
      } else {
        return false;
      }
    } catch (error) {
      console.error(error);
    } finally {
      db.end();
    }
  };

  public findUserById = async (id: string) => {
    const db: Pool = await getConnection();
    try {
      const user = await db.query("select * from user where id = ?", id);
      if (!user) {
        throw { status: 404, message: "유저를 찾을 수 없습니다. " };
      }
      return user;
    } catch (error) {
      console.error(error);
    } finally {
      db.end();
    }
  };

  public findUsers = async () => {
    const db: Pool = await getConnection();
    const search = "제목";

    try {
      const users = await db.query("select * from user");

      if (!users) {
        throw { status: 404, message: "유저를 찾을 수 없습니다. " };
      }
      return users;
    } catch (error) {
      console.error(error);
    } finally {
      db.end();
    }
  };
  public createUser = async (props: IRegisterUser) => {
    const db: Pool = await getConnection();
    const { name, password, email, description } = props;
    console.log({ password });

    try {
      const newUser = await db.query<ResultSetHeader>(
        "insert into user(name, description, password, email) values (?,?,?,?)",
        [name, description, password, email]
      );
      console.log({ newUser });

      // newUser가 확실히 존재해야 insertId를 사용할 수 있음.
      // 첫번째 배열에 ResultSetHeader 객체가 들어있으므로 그것을 사용하기 위해 첫번째 배열 사용
      if (newUser) {
        const insertedId = newUser[0].insertId;
        console.log({ insertedId });
        return insertedId;
      }
    } catch (error) {
      console.error(error);
    } finally {
      db.end();
    }
  };

  public updateUser = async (id: string, props: UpdateUserDto) => {
    const db: Pool = await getConnection();

    try {
      const isExist = await db.query("select * from User where id = ?", [id]);
      if (!isExist) throw { status: 404, message: "유저가 없어요 " };

      if (props.getUserPassword() !== null && props.getUserPassword() !== "") {
        await props.updatePassword();
      }
      console.log("이것두-> ", props.getUserPassword());

      const updateResult = await db.query<ResultSetHeader>(
        "update User set email = ?, name = ?, description = ?, password = ? where id = ? ",
        [
          props.getUserEmail(),
          props.getUserName(),
          props.getUserDescription(),
          props.getUserPassword(),
          id,
        ]
      );
      console.log({ updateResult });

      // 업데이트 성공한 row의 수를 넘김.
      return updateResult[0].affectedRows;
    } catch (error) {
      console.error(error);
    } finally {
      db.end();
    }
  };
  public deleteUser = async () => {};
}
