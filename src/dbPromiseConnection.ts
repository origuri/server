import mysql, { Connection } from "mysql2/promise";

const mysqlConfig = {
  host: "localhost",
  user: "root",
  password: "0414",
  database: "lecture",
  connectionLimit: 10, // createConnection을 사용하면 없애기
};

export const getConnection = async () => {
  return await mysql.createPool(mysqlConfig);
};

/* createConnection()은 단일 연결만 하기 때문에 pool을 사용하는 것이 좋음.
export const getConnection = async () => {
  return await mysql.createConnection(mysqlConfig);
}; */
