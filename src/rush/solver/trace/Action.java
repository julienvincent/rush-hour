package rush.solver.trace;

import rush.game.Board;

public class Action {
    /**
     * Meta that created the action.
     */
    private int x;
    private int y;
    private String direction;

    /**
     * Board state that this action is applying to
     */
    private Board board;

    public Action(int x, int y, String direction, Board board) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.board = board;
    }

    public int getX() {
        return x;
    }

    public int getY() {
        return y;
    }

    public String getDirection() {
        return direction;
    }

    public Board getBoard() {
        return board;
    }
}