package rush.game;

import utils.Reader;
import utils.console;

import java.util.Arrays;

public class Board {
    private Piece[][] board;
    private int x = 0;
    private int y = 0;

    public Board(String inputFile) {
        Reader file = new Reader(inputFile);
        if (file.exists()) {
            String[] lines = file.getLines();

            this.constructBoard(lines);
        } else {
            console.error("Board file doesn't exist");
        }
    }

    public String[][] formatAsString() {
        String[][] stringBoard = new String[x][y];

        for (int i = 0; i < board.length; i++) {
            for (int j = 0; j < board[i].length; j++) {
                stringBoard[i][j] = board[i][j].getWidth() + ":" + board[i][j].getHeight();
            }
        }

        return stringBoard;
    }

    private int[] getTuples(String line) {
        String[] splitLine = line.split("\\s+");
        return Arrays.stream(splitLine).mapToInt(Integer::parseInt).toArray();
    }

    private boolean checkIfOverlap(int[] position, int[] dimensions) {

        return true;
    }

    private void constructBoard(String[] lines) {
        if (lines.length != 0) {
            int[] boardDimensions = this.getTuples(lines[0]);
            this.x = boardDimensions[0];
            this.y = boardDimensions[1];
            board = new Piece[boardDimensions[0]][boardDimensions[1]];

            int[] position = null;
            int[] dimensions = null;
            for (int i = 1; i < lines.length; i++) {
                String line = lines[i];
                String[] splitLine = line.split("\\s+");

                if (splitLine.length != 0) {
                    if (position == null) {
                        position = this.getTuples(line);
                        board[position[0]][position[1]] = new Piece();
                    } else if (dimensions == null) {
                        dimensions = this.getTuples(line);
                        if (this.checkIfOverlap(position, dimensions)) {
                            board[position[0]][position[1]].setDimensions(dimensions[0], dimensions[1]);
                        } else {
                            break;
                        }
                    } else {
                        board[position[0]][position[1]].setDirections(splitLine);
                        position = null;
                        dimensions = null;
                    }
                } else {
                    if (position != null) {
                        console.error("Input file is incorrect");
                        break;
                    }
                    position = null;
                    dimensions = null;
                }
            }
        } else {
            console.error("Input file is incorrect");
        }
    }
}
