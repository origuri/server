import { IRegisterUser } from "../../auth/dto";
import { getConnection } from "../../dbPromiseConnection";
import {
  FieldPacket,
  Pool,
  ProcedureCallPacket,
  ResultSetHeader,
  RowDataPacket,
} from "mysql2/promise";
import { IUser } from "../dto";

export class UserService {
  // 5가지 서비스를 만들 것.
  // findById, findMany, create, update, delete

  // email 중복 체크
  public findUserByEmail = async (email: string) => {
    const db: Pool = await getConnection();
    try {
      // select는 rowDataPacket인듯?
      const user = await db.query<RowDataPacket[]>(
        "select * from user where email = ?",
        [email]
      );
      // 뭐든지 배열 첫번째 값을 가져와서 봐야됨.
      console.log("user.length", user[0].length);
      console.log({ user: user[0] });

      if (user[0].length > 0) {
        return true;
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
    const { name, age, password, email, phoneNumber } = props;
    console.log({ password });

    try {
      const newUser = await db.query<ResultSetHeader>(
        "insert into user(name, age, password, email, phoneNumber) values (?,?,?,?,?)",
        [name, age, password, email, phoneNumber]
      );

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

  public updateUser = async () => {};
  public deleteUser = async () => {};
}
