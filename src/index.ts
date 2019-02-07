import App from "./app";
import { EXPRESSPORT } from "./enviroments/envoriment";

App.app.listen(EXPRESSPORT, () => {
    console.log(`Express server listening on port ${EXPRESSPORT}`);
});
