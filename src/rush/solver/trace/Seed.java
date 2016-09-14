package rush.solver.trace;

import rush.game.Board;

public class Seed {

    private Action[] actions;
    private Board board;

    public Seed(Board board, Action[] previousActions) {
        this.board = board;
        this.actions = previousActions;
    }

    public void addAction(Action nextAction) {
        Action[] actions = new Action[this.actions.length + 1];

        if (this.actions.length > 0) {
            for (int i = 0; i < this.actions.length; i++) {
                actions[i] = this.actions[i];
            }
        }
        actions[this.actions.length] = nextAction;
        this.actions = actions;
    }

    public Board getBoard() {
        return board;
    }

    public Action[] getActions() {
        return actions;
    }
}
