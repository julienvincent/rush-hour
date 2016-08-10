package rush;

import rush.game.Board;
import ui.UI;
import utils.console;

public class RushHour {

    public static void main(String args[]) {
        Board game = new Board("/Users/julienvincent/code/rushhour/build/a/board");

        if (game.boardIsValid()) {
            String[][] lines = game.formatAsString();

            for (String[] row : lines) {
                String grouped = "";
                for (String line : row) {
                    grouped += line + " ";
                }
                console.log(grouped);
            }
        }

//        UI ui = new UI();
//        ui.run();
    }
}
