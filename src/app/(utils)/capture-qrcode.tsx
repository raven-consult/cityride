import React from "react";
import { Pressable, Text, View, StyleSheet, StatusBar, ToastAndroid, Linking } from "react-native";

import { CameraPermissionStatus, Code } from "react-native-vision-camera";
import { Camera, useCameraDevice, useCameraFormat, useCodeScanner } from "react-native-vision-camera";


const CaptureQRCode = (): JSX.Element => {
  const [codes, setCodes] = React.useState<Code[]>([]);
  const [cameraPermissionStatus, setCameraPermissionStatus] = React.useState<CameraPermissionStatus>("not-determined");

  const device = useCameraDevice("back");

  const format = useCameraFormat(device, [
    { videoAspectRatio: 16 / 9 },
    { videoResolution: { width: 3048, height: 2160 } },
    { fps: 60 }
  ]);

  React.useEffect(() => {
    console.log(cameraPermissionStatus);
  }, []);

  const codeScanner = useCodeScanner({
    codeTypes: ["qr", "ean-13"],
    onCodeScanned: (codes) => {
      setCodes(codes);
      console.log(`Scanned ${codes.length} codes!`);
    }
  });

  const requestCameraPermission = React.useCallback(async () => {
    console.log("Requesting camera permission...");
    const permission = await Camera.requestCameraPermission();
    console.log(`Camera permission status: ${permission}`);

    if (permission === "denied") await Linking.openSettings();
    setCameraPermissionStatus(permission);
  }, []);

  React.useEffect(() => {
    (async () => {
      const getCurrentPermission = Camera.getCameraPermissionStatus();
      setCameraPermissionStatus(getCurrentPermission);
    })();
  }, []);

  React.useEffect(() => {
    if (codes.length > 0) {
      const code = codes[0];
      ToastAndroid.show(`Scanned ${code.value} codes!`, ToastAndroid.SHORT);
    }
  }, [codes]);

  if (cameraPermissionStatus !== "granted") {
    return (
      <RequestPermissions
        requestCameraPermission={requestCameraPermission}
      />
    );
  }

  if (device == null) return <NoCameraDeviceError />;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <Camera
        format={format}
        device={device}
        isActive={true}
        codeScanner={codeScanner}
        style={StyleSheet.absoluteFill}
      />

      <View style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <View style={{ width: 300, height: 300, borderWidth: 1, borderColor: "white" }}></View>
      </View>

      <View style={{
        position: "absolute",
        bottom: "10%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}>

        <View style={{
          borderRadius: 50,
          paddingVertical: 8,
          paddingHorizontal: 24,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}>
          <Text style={{ color: "white" }}>Position your camera at the QR code</Text>
        </View>
      </View>
    </View>
  );
};


interface RequestPermissionsProps {
  requestCameraPermission: () => void;
}

const RequestPermissions = ({ requestCameraPermission }: RequestPermissionsProps): JSX.Element => {
  return (
    <View>
      <Text>Permissions</Text>
      <Text>Allow the app to use the camera to scan QR codes.</Text>
      <Pressable onPress={requestCameraPermission}>
        <Text>Request Camera Permission</Text>
      </Pressable>
    </View>
  );
};

const NoCameraDeviceError = (): JSX.Element => {
  return (
    <View>
      <Text>No Camera Device</Text>
      <Text>There is no camera device available on this device.</Text>
    </View>
  );
};


export default CaptureQRCode;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  mainContainer: {
    bottom: 0,
    height: "35%",
    width: "100%",
    paddingVertical: 36,
    position: "absolute",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
})