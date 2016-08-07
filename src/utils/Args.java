package utils;

import java.util.ArrayList;

/**
 * DataType for flags
 */
class Data {
    String key;
    String value;

    Data(String key, String value) {
        this.key = key;
        this.value = value;
    }
}

/**
 * Util for parsing and requesting terminal arguments.
 */
public class Args {
    public static Integer length = 0;
    static ArrayList<Data> flags = new ArrayList<>();
    static ArrayList<String> arguments = new ArrayList<>();

    /**
     * Parses a String[] of arguments.
     * Bare arguments will be indexed in the order they were inputted, minus any flags in-between.
     *
     * Flags will be parsed as follows:
     * --option [true]
     * --option=value [value]
     * -f [true]
     * -abc [a: true, b: true, c: true]
     *
     * @param args
     */
    public static void setup(String[] args) {
        for (String arg : args) {
            if (arg.substring(0, 2).equals("--")) {
                Integer delimiter = arg.indexOf("=");
                String value = "true";
                if (delimiter != -1) {
                    value = arg.substring(delimiter + 1);
                }

                flags.add(new Data(arg.substring(2, (delimiter == -1 ? arg.length() : delimiter)), value));
            } else if (arg.substring(0, 1).equals("-")) {
                for (int i = 1; i < arg.length(); i++) {
                    flags.add(new Data(arg.substring(i, i + 1), "true"));
                }
            } else {
                arguments.add(arg);
            }
        }

        length = arguments.size();
    }

    /**
     * Ask for the value of a flag. Null if it was not entered.
     *
     * @param name
     * @return String
     */
    public static String option(String name) {
        Data found = null;
        for (Data flag : flags) {
            if (flag.key.equals(name)) {
                found = flag;
            }
        }

        if (found != null) {
            return found.value;
        }

        return null;
    }

    /**
     * Get all non-flag arguments.
     *
     * @return String[]
     */
    public static String[] get() {
        String[] args = new String[length];
        return arguments.toArray(args);
    }
}