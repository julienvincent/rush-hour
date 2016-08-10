package rush.game;

import java.util.Arrays;

public class Piece {
    private int width;
    private int height;
    private String[] directions = {};

    public void setDimensions(int width, int height) {
        this.width = width;
        this.height = height;
    }

    public void setDirections(String[] directions) {
        this.directions = directions;
    }

    public int getWidth() {
        return width;
    }

    public int getHeight() {
        return height;
    }

    public boolean hasDirection(String direction) {
        return Arrays.asList(this.directions).contains(direction);
    }
}
