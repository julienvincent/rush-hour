package rush;

import rush.game.Board;
import rush.solver.Solver;
import utils.Reader;
import utils.console;
import utils.Args;

import java.util.Arrays;

public class RushHour {

    public static Board game;

    public static void main(String raw[]) {
        Args.setup(raw);

        if (Args.option("d") != null || Args.option("debug") != null) {
            console.setLevel("INFO");
        }

        if (Args.length < 1) {
            console.log("<green>Please include a board setup file");
        } else {
            game = new Board(Args.get()[0]);
            if (game.boardIsValid()) {
                if (Args.length == 1) {
                    Solver solver = new Solver(game);
                    solver.solve();
                } else {
                    trySolution();
                }
            } else {
                console.error("Board configuration failed. Please provide a valid setup file");
            }
        }
    }

    private static void trySolution() {
        Reader solution = new Reader(Args.get()[1]);
        if (solution.exists()) {
            String[] lines = solution.getLines();

            int[] target = null;
            int i = 0;
            boolean completed = true;
            for (String line : lines) {
                if (completed) {
                    if (target == null) {
                        String[] splitLine = line.split("\\s+");
                        if (splitLine.length != 2) {
                            console.error("More than 1 set of numbers provided. Ignoring additional numbers");
                        }
                        try {
                            target = Arrays.stream(splitLine).mapToInt(Integer::parseInt).toArray();
                        } catch (NumberFormatException e) {
                            completed = false;
                            console.error("Expected characters [0-9 ]. Line should only contain Numbers ");
                        }
                    } else {
                        if (game.move(target, line, true)) {
                            target = null;
                        } else {
                            completed = false;
                            console.error("Move failed. Solutions file is not correct - please check line <green>" + (i + 1));
                        }
                    }
                }

                i++;
            }

            if (completed) {
                if (game.hasTargetBeenReached()) {
                    console.log("<b><green>Solutions file correct!");
                } else {
                    console.error("Solutions file did not result in a completed game");
                }
            }
        } else {
            console.error("Invalid solutions file. It does not exist");
            return;
        }
    }
}
