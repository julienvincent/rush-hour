package utils;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.PrintWriter;
import java.util.Scanner;

/**
 * Util for reading and writing to files.
 */
public class Reader {
    File file;

    /**
     * Accepts the location of a file and constructs a File object from that location.
     *
     * @param file
     */
    public Reader(String file) {
        this.file = new File(file);
    }

    /**
     * Attempt to get the contents of the file.
     * Returns a single string.
     *
     * @return String
     */
    public String getContents() {
        if (exists()) {
            try {
                console.debug("Reading from file: <green>[" + file.getAbsolutePath() + "]");
                return new Scanner(file).useDelimiter("\\Z").next();
            } catch (FileNotFoundException e) {
                console.error("Couldn't read file <b>[" + file.getAbsolutePath() + "]</>");
                e.printStackTrace();
            }
        }

        return null;
    }

    public String[] getLines() {
        String contents = this.getContents();

        if (contents != null) {
            return contents.split(System.getProperty("line.separator"));
        } else {
            return new String[0];
        }
    }

    /**
     * Attempt to write some text to a file.
     *
     * @param contents
     */
    public void writeContents(String contents) {
        try {
            PrintWriter writer = new PrintWriter(file);

            writer.print(contents);
            writer.close();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
    }

    /**
     * Determine if the location exists and if it is a valid file.
     *
     * @return Boolean
     */
    public Boolean exists() {
        return file.exists() && !file.isDirectory();
    }
}