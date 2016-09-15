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

        /**
         * Add the root node to the que and being
         * processing it.
         */
        que.add(new Seed(board, new Action[]{}));
        processQue();
    }

    private void processQue() {

        /**
         * All nodes have been checked without a solution being found.
         * Stop further processing.
         */
        if (que.size() == 0) {
            console.log("<red>No Solution");
            return;
        }

        /**
         * Get the next node in the que (represented as a seed) and
         * pull the game board from the stack.
         */
        Seed nextInQue = que.get(0);
        Board boardFromSeed = nextInQue.getBoard();
        Piece[][] boardState = boardFromSeed.getBoard();

        /**
         * Check if the game board is in a solved state and break the
         * process que accordingly.
         */
        if (boardFromSeed.hasTargetBeenReached()) {
            console.log("<green><b>Solution Found");
            printSeed(nextInQue);
            return;
        }

        /**
         * Find all possible nodes from the boards current state and
         * add them to the end of the que.
         */
        int i = 0;
        for (Piece[] row : boardState) {
            int j = 0;
            for (Piece piece : row) {
                if (piece != null) {
                    // try all directions on the piece
                    for (String direction : this.directions) {
                        if (piece.hasDirection(direction)) {
                            // clone the board before making any mutations
                            Board clonedBoard = new Board(boardState);
                            if (clonedBoard.move(new int[]{j, i}, direction, false)) {
                                // create a hash from the board state after move
                                String boardHash = clonedBoard.formatAsString();
                                // only continue if this board configuration is unique
                                if (!hashes.contains(boardHash)) {
                                    hashes.add(boardHash);

                                    // update the seeds' board and actions and add it to the end of the que
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

        // remove this node from the que and start processing the next node
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
