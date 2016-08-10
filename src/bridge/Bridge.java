package bridge;

import javafx.stage.Stage;
import rush.game.Board;
import utils.console;

public class Bridge {

    private Stage stage;
    private Board game;

    public Bridge(Stage stage, Board game) {
        this.stage = stage;
        this.game = game;
    }

    public Board getBoard() {
        return game;
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
