package rush.game;

import utils.Reader;
import utils.console;

import java.util.Arrays;

public class Board {
    private Piece[][] board;
    private int x = 0;
    private int y = 0;

    private boolean validBoard = false;

    public Board(String inputFile) {
        Reader file = new Reader(inputFile);
        if (file.exists()) {
            String[] lines = file.getLines();

            this.constructBoard(lines);
        } else {
            console.error("Board file doesn't exist");
        }
    }

    /**
     * Given a starting position and a direction, determine the
     * next location from that point.
     *
     * @param currentPosition
     * @param direction
     */
    private int[] getNextPosition(int[] currentPosition, String direction) {
        int[] nextPosition = currentPosition;

        switch (direction) {
            case "up":
                nextPosition[0] = currentPosition[0] - 1;
            case "down":
                nextPosition[0] = currentPosition[0] + 1;
            case "left":
                nextPosition[1] = currentPosition[1] - 1;
            case "right":
                nextPosition[1] = currentPosition[1] + 1;
        }

        return nextPosition;
    }

    /**
     * Attempt to move a piece to a new location on the board.
     * <p>
     * return true or false for whether or not the move was successful.
     *
     * @param target
     * @param direction
     */
    public boolean move(int[] target, String direction) {
        Piece piece = board[target[0]][target[1]];

        if (piece != null) {
            if (piece.hasDirection(direction)) {
                int[] location = this.getNextPosition(target, direction);
                int[] pieceDimensions = {piece.getWidth(), piece.getHeight()};
                if (this.checkIfValidPosition(location) && this.checkIfOverlap(location, pieceDimensions)) {
                    board[location[0]][location[1]] = piece;
                    board[target[0]][target[1]] = null;

                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    /**
     * Check if the player is currently touching the right
     * hand side of the game board. If true, this means that
     * the game is complete.
     */
    public boolean hasTargetBeenReached() {
        boolean gameComplete = false;

        for (Piece[] row : board) {
            int i = 0;
            for (Piece piece : row) {
                if (piece != null && piece instanceof Player) {
                    if (piece.getWidth() - 1 + i >= y) {
                        gameComplete = true;
                    }
                }
                i++;
            }
        }

        return gameComplete;
    }

    /**
     * Reformat the current board layout as a 2D array of strings.
     * This is used to pass values that the JavaScript UI can understand
     */
    public String[][] formatAsString() {
        String[][] stringBoard = new String[x][y];

        for (int i = 0; i < board.length; i++) {
            for (int j = 0; j < board[i].length; j++) {
                Piece piece = board[i][j];
                if (piece != null) {
                    stringBoard[i][j] = piece.getWidth() + ":" + piece.getHeight();
                }
            }
        }

        return stringBoard;
    }

    /**
     * Format a given string as a tuple of integers (int[] of length 2).
     * If the given line cannot be correctly formatted, log an error and
     * return null.
     *
     * @param line
     */
    private int[] getTuples(String line) {
        String[] splitLine = line.split("\\s+");
        if (splitLine.length != 2) {
            console.error("More than 1 set of numbers provided. Ignoring additional numbers");
        }
        try {
            return Arrays.stream(splitLine).mapToInt(Integer::parseInt).toArray();
        } catch (NumberFormatException e) {
            console.error("Expected characters [0-9 ]. Line should only contain Numbers ");
            return null;
        }
    }

    /**
     * Split a line into an array of it's separate pieces (delimited by space {" "}).
     *
     * @param line
     */
    private String[] splitLine(String line) {
        return line.split("\\s+");
    }

    /**
     * Given a piece described as 1) position(tuple) and 2) dimensions(tuple), determine
     * if the piece is placed in such a way that it is within the board boundaries and
     * does not overlap with any other existing pieces.
     *
     * @param position
     * @param dimensions
     */
    private boolean checkIfOverlap(int[] position, int[] dimensions) {
        boolean valid = true;

        if (position[0] + dimensions[1] - 1 > x || position[1] + dimensions[0] - 1 > y) {
            valid = false;
        }

        for (int i = 0; i < board.length; i++) {
            for (int j = 0; j < board[i].length; j++) {
                Piece piece = board[i][j];

                /**
                 * Check if there is currently a piece at this position.
                 *
                 * This works even after the piece being matched has been added
                 * to the board due to the fact that the new piece's dimensions
                 * are currently unset and so do not trigger the overlap algorithm.
                 */
                if (piece != null) {
                    int height = piece.getHeight();
                    int width = piece.getWidth();

                    /**
                     * Overlap check.
                     *
                     * Check which dimension(H) is greater
                     * Check if dimension(H) overlaps
                     *
                     * If dimension(H) overlaps,
                     * Check which dimension(W) is greater
                     * Check if dimension(W) overlaps
                     */
                    boolean HOverlap = false;
                    if (i < position[0]) {
                        if ((position[0] - i) + ((dimensions[1] - 1) * -1) <= 0) {
                            HOverlap = true;
                        }
                    } else if ((i - position[0]) + ((height - 1) * -1) <= 0) {
                        HOverlap = true;
                    }

                    if (HOverlap) {
                        if (j < position[1]) {
                            if (position[1] - j <= width - 1) {
                                valid = false;
                            }
                        } else if (j - position[1] <= dimensions[0] - 1) {
                            valid = false;
                        }
                    }
                }
            }
        }

        return valid;
    }

    /**
     * Check if a given position is within the board boundaries.
     *
     * @param position
     */
    private boolean checkIfValidPosition(int[] position) {
        if (position[0] < 0 || position[1] < 0) {
            return false;
        }
        if (position[0] > x - 1 || position[1] > y - 1) {
            return false;
        }
        return board[position[0]][position[1]] == null;
    }

    /**
     * Check if a given set of directions match the ENUM [up, down, left, right]
     *
     * @param directions
     */
    public boolean checkIfValidDirections(String[] directions) {
        boolean valid = true;
        String[] validDirections = {"up", "down", "left", "right"};

        for (String direction : directions) {
            if (!Arrays.asList(validDirections).contains(direction)) {
                valid = false;
            }
        }

        return valid;
    }

    /**
     * Check if a tuple is null or not. Log a common error if null.
     *
     * @param tuple
     * @param lineNumber
     * @param line
     */
    private boolean invalidTuple(int[] tuple, int lineNumber, String line) {
        if (tuple == null) {
            console.error("Invalid character set on line [" + lineNumber + "]. Expected integers in the form 'x1 x2' but found '" + line + "'");
            return true;
        }

        return false;
    }

    /**
     * Set the current board state to INVALID.
     */
    private void boardIsInvalid() {
        this.validBoard = false;
    }

    /**
     * Find out if the current board state is valid.
     */
    public boolean boardIsValid() {
        return this.validBoard;
    }

    /**
     * For some obscure reason, the implementation rules we are given
     * specify that the x coordinate referenced in input and solution
     * files is the inverse of real location. This function just swaps
     * the given fake x value to reference a real coordinate.
     * @param fake
     */
    private int swapCoordinateDirection(int fake) {
        return y - fake;
    }

    /**
     * Construct the board from a collection of lines
     * that describe all properties of the board to be.
     *
     * @param lines
     */
    private void constructBoard(String[] lines) {
        this.validBoard = true;

        /**
         * Input file must have board dimensions and the player piece
         * which takes a minimum of 3 lines.
         */
        if (lines.length >= 3) {
            /**
             * Set the board to the provided dimensions.
             */
            int[] boardDimensions = this.getTuples(lines[0]);
            if (this.invalidTuple(boardDimensions, 1, lines[0])) {
                this.boardIsInvalid();
                return;
            }
            this.x = boardDimensions[0];
            this.y = boardDimensions[1];
            board = new Piece[boardDimensions[0]][boardDimensions[1]];

            console.debug("Board dimensions: <green>[" + x + " " + y + "]");

            /**
             * Explicitly handle adding the Player to the board.
             */
            int[] playerPosition = this.getTuples(lines[1]);
            if (this.invalidTuple(playerPosition, 2, lines[1])) {
                this.boardIsInvalid();
                return;
            }
            playerPosition[0] = this.swapCoordinateDirection(playerPosition[0]);
            if (!this.checkIfValidPosition(playerPosition)) {
                this.boardIsInvalid();
                console.error("Invalid player position");
                return;
            }
            console.debug("Player position: <green>[" + playerPosition[0] + " " + playerPosition[1] + "]");
            int[] playerDimensions = this.getTuples(lines[2]);
            if (!this.checkIfOverlap(playerPosition, playerDimensions)) {
                this.boardIsInvalid();
                console.error("Invalid player dimensions");
                return;
            }
            console.debug("Player dimensions: <green>[w=" + playerDimensions[0] + " h=" + playerDimensions[1] + "]");
            if (this.invalidTuple(playerDimensions, 3, lines[2])) {
                this.boardIsInvalid();
                return;
            }

            board[playerPosition[0]][playerPosition[1]] = new Player();
            board[playerPosition[0]][playerPosition[1]].setDimensions(playerDimensions[0], playerDimensions[1]);
            if (lines.length >= 4) {
                String[] playerDirections = this.splitLine(lines[3]);
                if (playerDirections.length > 0) {
                    if (this.checkIfValidDirections(playerDirections)) {
                        board[playerPosition[0]][playerPosition[1]].setDirections(this.splitLine(lines[3]));
                    } else {
                        console.error("Invalid set of directions given. Valid directions are <green>[up down left right]");
                        this.boardIsInvalid();
                        return;
                    }
                }
            }

            /**
             * Add the rest of the obstacles to the board.
             *
             * position and dimensions are used as context when adding
             * obstacles.
             */
            int[] position = null;
            int[] dimensions = null;
            for (int i = 4; i < lines.length; i++) {
                String line = lines[i];
                String[] splitLine = this.splitLine(line);

                if (splitLine.length != 0) {
                    if (position == null) {
                        position = this.getTuples(line);
                        position[0] = this.swapCoordinateDirection(position[0]);
                        if (this.invalidTuple(position, i + 1, line)) {
                            this.boardIsInvalid();
                            return;
                        }
                        if (this.checkIfValidPosition(position)) {
                            board[position[0]][position[1]] = new Piece();
                        } else {
                            this.boardIsInvalid();
                            console.error("A piece already exists at point [" + position[0] + " " + position[1] + "] or the position is not on the board. " +
                                    "Check line <green>" + (i + 1));
                            break;
                        }
                    } else if (dimensions == null) {
                        dimensions = this.getTuples(line);
                        if (this.invalidTuple(dimensions, i + 1, line)) {
                            this.boardIsInvalid();
                            return;
                        }
                        if (this.checkIfOverlap(position, dimensions)) {
                            board[position[0]][position[1]].setDimensions(dimensions[0], dimensions[1]);
                        } else {
                            this.boardIsInvalid();
                            console.error("A piece overlaps or extends past the boards boundaries. Check line <green>" + (i + 1));
                            break;
                        }
                    } else {
                        if (this.checkIfValidDirections(splitLine)) {
                            board[position[0]][position[1]].setDirections(splitLine);
                        } else {
                            console.error("Invalid set of directions given. Valid directions are <green>[up down left right]");
                            this.boardIsInvalid();
                            break;
                        }
                        position = null;
                        dimensions = null;
                    }
                } else {
                    if ((position != null && dimensions == null) || position == null) {
                        this.boardIsInvalid();
                        console.error("Input file is incorrect. Please check line: " + (i + 1));
                        break;
                    }
                    position = null;
                    dimensions = null;
                }
            }
        } else {
            this.boardIsInvalid();
            console.error("Input file is incorrect. A valid input file must have at least 3 lines");
        }
    }
}
