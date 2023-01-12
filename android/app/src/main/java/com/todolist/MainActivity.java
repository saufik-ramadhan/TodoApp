package com.todolist;

import com.facebook.react.ReactActivity;
import android.os.Bundle; // React Navigation

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "TodoList";
  }

  /**
   * React Navigation
   */
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(null);
  }
}
