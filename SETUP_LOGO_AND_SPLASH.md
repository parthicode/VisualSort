# Setting Up App Logo and Splash Screen

## Step 1: Generate App Icons

You need to create multiple sizes of your logo for Android. Use an online tool or follow these steps:

### Required Icon Sizes for Android:
- **mipmap-mdpi**: 48x48px
- **mipmap-hdpi**: 72x72px
- **mipmap-xhdpi**: 96x96px
- **mipmap-xxhdpi**: 144x144px
- **mipmap-xxxhdpi**: 192x192px

### Easy Way: Use Online Tool
1. Go to https://icon.kitchen/ or https://appicon.co/
2. Upload `VisualSort_logo.png`
3. Download the Android icon pack
4. Extract and copy folders to `VisualSort/android/app/src/main/res/`

### Manual Way:
Copy the logo to these locations (resize as needed):
```
android/app/src/main/res/mipmap-mdpi/ic_launcher.png (48x48)
android/app/src/main/res/mipmap-hdpi/ic_launcher.png (72x72)
android/app/src/main/res/mipmap-xhdpi/ic_launcher.png (96x96)
android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png (144x144)
android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png (192x192)
```

## Step 2: Set Up Splash Screen

### For Android:

1. **Copy logo to drawable folder:**
```bash
# Create drawable folder if it doesn't exist
mkdir -p android/app/src/main/res/drawable

# Copy logo (will be done in next step)
```

2. **Create splash screen layout** (already done below)

3. **Update MainActivity** (already done below)

4. **Update styles** (already done below)

## Automated Setup

I'll create all the necessary files for you. After that, you just need to:

1. Generate the icon sizes using an online tool
2. Copy them to the res/mipmap folders
3. Rebuild the app

## Files Created:
- ✅ Splash screen layout
- ✅ Splash screen background
- ✅ MainActivity updates
- ✅ Styles configuration
- ✅ SplashScreen component

## Next Steps:
1. Generate icons using https://icon.kitchen/
2. Copy icons to mipmap folders
3. Run: `npm run android`
