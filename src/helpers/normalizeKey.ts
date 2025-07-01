const normalizeKey = (key: string): "main" => {
  if (typeof key !== "string") return "main";

  switch (key.toLowerCase()) {
    case "main":
      return "main";
    default:
      return "main";
  }
};

export default normalizeKey;
 
