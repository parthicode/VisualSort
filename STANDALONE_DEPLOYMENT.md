# Running VisualSort Standalone (Without Computer Connection)

## Option 1: Build Release APK (Best for Production)

### Step 1: Build the Release APK
```bash
cd VisualSort/android
gradlew assembleRelease
```

This will create an APK at:
```
VisualSort/android/app/build/outputs/apk/release/app-release.apk
```

### Step 2: Transfer APK to Your Tablet
1. Copy the APK file to your tablet via:
   - USB cable (copy to Downloads folder)
   - Email it to yourself
   - Upload to Google Drive/Dropbox and download on tablet
   - Use `adb install` command

### Step 3: Install on Tablet
1. On your tablet, go to **Settings → Security**
2. Enable **"Install from Unknown Sources"** or **"Install Unknown Apps"**
3. Open the APK file from your file manager
4. Tap **Install**
5. The app will run completely standalone!

### Using ADB to Install:
```bash
adb install VisualSort/android/app/build/outputs/apk/release/app-release.apk
```

---

## Option 2: Wireless Debugging (For Development)

### Step 1: Connect via USB First
```bash
adb devices
```

### Step 2: Enable Wireless Debugging
```bash
adb tcpip 5555
```

### Step 3: Find Your Tablet's IP Address
On your tablet:
1. Go to **Settings → About Tablet → Status**
2. Note the **IP Address** (e.g., 192.168.1.100)

### Step 4: Connect Wirelessly
```bash
adb connect 192.168.1.100:5555
```

### Step 5: Disconnect USB Cable
You can now unplug the USB cable!

### Step 6: Run the App
```bash
cd VisualSort
npm run android
```

The app will install and run wirelessly!

### To Reconnect Later:
```bash
adb connect 192.168.1.100:5555
npm run android
```

---

## Option 3: Quick Test Build (Unsigned APK)

If you just want to test quickly:

```bash
cd VisualSort/android
gradlew assembleDebug
```

APK location:
```
VisualSort/android/app/build/outputs/apk/debug/app-debug.apk
```

Install it:
```bash
adb install VisualSort/android/app/build/outputs/apk/debug/app-debug.apk
```

---

## Troubleshooting

### Build Takes Too Long
The first build can take 5-10 minutes. Subsequent builds are faster.

### "Install from Unknown Sources" Not Available
On newer Android versions:
1. Try to install the APK
2. Android will prompt you to allow installation
3. Tap **Settings** → Enable for that app

### Wireless Connection Drops
```bash
# Reconnect
adb connect YOUR_TABLET_IP:5555

# If that doesn't work, reconnect via USB and repeat steps
```

### App Crashes on Startup
The release APK needs to be signed properly. For now, use the debug APK or wireless debugging.

---

## Current Build Status

The release build is currently running in the background. It may take 5-10 minutes to complete.

Once done, you'll find the APK at:
```
C:\prj\apps\VisualSort\VisualSort\android\app\build\outputs\apk\release\app-release.apk
```

---

## Recommended Approach

**For Testing**: Use Option 2 (Wireless Debugging)
- Quick to set up
- Easy to update
- Good for development

**For Production**: Use Option 1 (Release APK)
- Completely standalone
- No computer needed
- Can share with others
- Professional deployment

---

## Next Steps

1. **Wait for the build to complete** (check the android/app/build/outputs/apk folder)
2. **Or use wireless debugging** for immediate testing
3. **Install the APK** on your tablet
4. **Enjoy your standalone app!**
