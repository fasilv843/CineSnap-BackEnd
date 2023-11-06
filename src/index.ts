import { createServer } from "./infrastructure/config/app";
import { mongoConnect } from "./infrastructure/config/db";

const PORT = process.env.PORT || 3000

const app = createServer()
mongoConnect()
    .then(() => app?.listen(PORT, () => console.log(`listening to PORT ${PORT}`)))
    .catch((err) => console.log('error while connecting to database\n', err))

