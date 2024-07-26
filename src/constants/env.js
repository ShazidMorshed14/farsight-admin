export default (mode) => {
  switch (mode) {
    case "staging":
      return {
        baseUrl: "http://localhost:5000/api/v1",
        appName: "E-Commerce Dashboard",
        version: "1.0.0-beta",
      };
    case "production":
      return {
        baseUrl: "http://localhost:5000/api/v1",
        appName: "E-Commerce Dashboard",
        version: "1.0.0-beta",
      };
    default:
      return {
        baseUrl: "http://localhost:5000/api/v1",
        appName: "E-Commerce Dashboard",
        version: "1.0.0-beta",
      };
  }
};
