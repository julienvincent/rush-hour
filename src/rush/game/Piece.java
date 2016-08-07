package rush.game;

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
}
