interface connProps {
    DataSource: string;
    Catalog: string;
    Uid: string;
    Pwd: string;
}

export function getServerConfig() {

  const config: connProps = {
      DataSource: `${process.env.DB_HOST},${process.env.DB_PORT}`,
      Catalog: process.env.DB_NAME || "",
      Uid: process.env.DB_USER || "",
      Pwd: process.env.DB_PSWD || "",
  };
  
  return config;
}
