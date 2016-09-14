package rush.solver;

import rush.game.Board;
import rush.game.Piece;
import rush.solver.trace.Action;
import rush.solver.trace.Seed;
import utils.console;

import java.util.ArrayList;
import java.util.LinkedList;

public class Solver {

    Board board;
    String[] directions = {"up", "down", "left", "right"};

    LinkedList<Seed> que = new LinkedList<>();
    ArrayList<String> hashes = new ArrayList<>();

    public Solver(Board board) {
        this.board = board;
    }

    public void solve() {

        que.add(new Seed(board, new Action[]{}));
        processQue();
    }

    private void processQue() {
        Seed nextInQue = que.get(0);
        Board boardFromSeed = nextInQue.getBoard();
        Piece[][] boardState = boardFromSeed.getBoard();

        /**
         * Check if the next board in the que is a solution.
         */
        if (boardFromSeed.hasTargetBeenReached()) {
            console.log("<green><b>Solution Found");
            printSeed(nextInQue);
            return;
        }

        /**
         * Find all possible moves from this board current state and
         * add them to the end of the que.
         */
        int i = 0;
        for (Piece[] row : boardState) {
            int j = 0;
            for (Piece piece : row) {
                if (piece != null) {
                    for (String direction : this.directions) {
                        // Can this piece move in a given direction
                        if (piece.hasDirection(direction)) {
                            Board clonedBoard = new Board(boardState);
                            // try move in a direction
                            if (clonedBoard.move(new int[]{j, i}, direction, false)) {
                                String boardHash = clonedBoard.formatAsString();

                                /**
                                 * Check if this board configuration has existed previously
                                 * in this seed. If it has, the seed will die
                                 */
                                if (!hashes.contains(boardHash)) {
                                    hashes.add(boardHash);
                                    Seed nextSeed = new Seed(clonedBoard, nextInQue.getActions());
                                    nextSeed.addAction(new Action(i, j, direction, clonedBoard));
                                    que.add(nextSeed);
                                }
                            }
                        }
                    }
                }
                j++;
            }
            i++;
        }

        que.remove(0);
        processQue();
    }

    private void printSeed(Seed seed) {
        Action[] actions = seed.getActions();

        console.log("Solution found after " + actions.length + " moves");
        console.log("The following moves were made:");

        /**
         * Print all actions that led to the solution being found
         */
        for (Action action : actions) {
            console.log("Piece at location [" + action.getX() + "," + action.getY() + "] moved " + action.getDirection());
        }
    }
}
