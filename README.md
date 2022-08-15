# react-native-icure-crypto

## Getting started

`$ npm install react-native-icure-crypto --save`

### Mostly automatic installation

`$ react-native link react-native-icure-crypto`

### Manual installation

#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-icure-crypto` and add `RNIcureCrypto.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNIcureCrypto.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`

- Add `import com.reactlibrary.RNIcureCryptoPackage;` to the imports at the top of the file
- Add `new RNIcureCryptoPackage()` to the list returned by the `getPackages()` method

2. Append the following lines to `android/settings.gradle`:
   ```
   include ':react-native-icure-crypto'
   project(':react-native-icure-crypto').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-icure-crypto/android')
   ```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
   ```
     compile project(':react-native-icure-crypto')
   ```

## Usage

```javascript
import RNIcureCrypto from "react-native-icure-crypto";

// TODO: What to do with the module?
RNIcureCrypto;
```

## Useful references

```
https://medium.com/wix-engineering/creating-a-native-module-in-react-native-93bab0123e46#360a
```

```
https://medium.com/@alielmajdaoui/linking-local-packages-in-react-native-the-right-way-2ac6587dcfa2
```

```
https://teabreak.e-spres-oh.com/swift-in-react-native-the-ultimate-guide-part-1-modules-9bb8d054db03§
```
