package bridge;

import javafx.stage.Stage;
import utils.console;

public class Bridge {

    private Stage stage;

    public Bridge(Stage stage) {
        this.stage = stage;
    }

    public void log(String message) {
        console.log(message);
    }

    public void debug(String message) {
        console.debug(message);
    }

    public void error(String message) {
        console.error(message);
    }
}
