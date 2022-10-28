import { app } from "./setup.js";

const port = process.env.PORT || 5000;

app.listen(port, () => console.log("Server is running"));
