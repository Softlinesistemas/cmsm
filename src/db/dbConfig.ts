import { getServerConfig } from "@/db/getServerConfig";

interface Connection {
  host: string;
  user: string;
  password: string;
  database: string;
  port: number;
}

const dbConfig = () => {
    const serverConfig = getServerConfig();

    const dbConfig: Connection = {
      host: serverConfig.DataSource.split(",")[0],
      user: serverConfig.Uid,
      password: serverConfig.Pwd,
      database: serverConfig.Catalog,
      port: Number(serverConfig.DataSource?.split(",")[1]),
    };

    return dbConfig
}

export default dbConfig;
 
