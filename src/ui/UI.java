package ui;

import com.sun.webkit.WebPage;
import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebView;
import javafx.stage.Stage;
import javafx.stage.StageStyle;
import netscape.javascript.JSObject;

import java.lang.reflect.Field;

import utils.Args;
import bridge.Bridge;
import utils.Reader;
import utils.console;

/**
 * JavaFX UI interface
 */
public class UI extends Application {

    private int x;
    private int y;

    /**
     * JavaFX implementation method. Here a JavaFX WebView is applied to a stage.
     * The WebView's engine is setup and told to load from ./bundle/index.html
     * The stage is then shown.
     *
     * @param stage
     */
    public void start(Stage stage) {
        WebView webview = new WebView();
        WebEngine engine = webview.getEngine();

        Bridge bridge = new Bridge(stage);

        console.debug("<green>Enabling JavaScript");
        engine.setJavaScriptEnabled(true);

        console.debug("Injecting Java bridge into <g>WebView<blue>'s window");
        engine.getLoadWorker().stateProperty().addListener(
                (ov, oldState, newState) -> {
                    JSObject window = (JSObject) engine.executeScript("window");
                    window.setMember("java", bridge);
                    window.setMember("console", bridge);
                });

        console.debug("Loading local bundle into <g>WebView");
        engine.load(getClass().getResource("/ui/bundle/index.html").toExternalForm());

        Scene scene = new Scene(webview, 1000, 700);
        scene.setFill(null);

        stage.setTitle("Traversal");
        stage.setScene(scene);
        stage.initStyle(StageStyle.TRANSPARENT);

        webview.setOnMousePressed(event -> {
            x = (int) event.getX();
            y = (int) event.getY();
        });

        webview.setOnMouseDragged(event -> {
            stage.setX(stage.getX() - (x - event.getX()));
            stage.setY(stage.getY() - (y - event.getY()));
        });

        try {
            Field field = engine.getClass().getDeclaredField("page");
            field.setAccessible(true);
            WebPage page = (WebPage) field.get(engine);
            page.setBackgroundColor((new java.awt.Color(0, 0, 0, 1)).getRGB());
        } catch (Exception e) {
            console.error("Error while attempting to make webview page transparent");
            e.printStackTrace();
        }

        console.debug("Displaying JavaFX Scene");
        stage.show();
    }

    /**
     * Launch the JavaFX Application.
     */
    public void run() {
        console.debug("Launching UI stage");
        launch();
    }
}