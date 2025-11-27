package com.visualsort

import android.os.Bundle
import android.os.Handler
import android.os.Looper
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  private var contentReady = false

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "VisualSort"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  /**
   * Set the splash screen theme and keep it visible
   */
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    
    // Force hide splash after 2 seconds maximum
    Handler(Looper.getMainLooper()).postDelayed({
      if (!contentReady) {
        setTheme(R.style.AppTheme)
        contentReady = true
      }
    }, 2000)
  }

  /**
   * Called when React Native content view is available
   * This is when we switch from splash to app theme
   */
  override fun onContentChanged() {
    super.onContentChanged()
    // Switch to app theme when content is ready (but respect 2s minimum)
    if (!contentReady) {
      Handler(Looper.getMainLooper()).postDelayed({
        setTheme(R.style.AppTheme)
        contentReady = true
      }, 100) // Small delay to ensure smooth transition
    }
  }
}
