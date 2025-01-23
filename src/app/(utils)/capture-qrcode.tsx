import React from "react";
import { Pressable, Text, View, StyleSheet, StatusBar, ToastAndroid, Linking, ActivityIndicator } from "react-native";

import { DimensionValue } from "react-native";
import { CameraPermissionStatus, Code } from "react-native-vision-camera";
import BottomSheet, { BottomSheetView, BottomSheetBackgroundProps } from "@gorhom/bottom-sheet";
import { Camera, useCameraDevice, useCameraFormat, useCodeScanner } from "react-native-vision-camera";

import Octicons from "@expo/vector-icons/Octicons";

import { confirmRide } from "@/services/rides";
import { useAppContext } from "@/context/AppContext";

enum CaptureState {
  Scanning,
  Captured,
  Verifying,
  Failed,
}

const CaptureQRCode = (): JSX.Element => {
  const { pendingRide } = useAppContext();
  const snapPoints = React.useMemo(() => ["10%"], []);
  const bottomSheetRef = React.useRef<BottomSheet>(null);

  const [capturedCode, setCapturedCode] = React.useState<Code | null>(null);
  const [captureState, setCaptureState] = React.useState<CaptureState>(CaptureState.Scanning);
  const [cameraPermissionStatus, setCameraPermissionStatus] = React.useState<CameraPermissionStatus>("not-determined");

  const device = useCameraDevice("back");

  const format = useCameraFormat(device, [
    { videoAspectRatio: 16 / 9 },
    { videoResolution: { width: 3048, height: 2160 } },
    { fps: 60 }
  ]);

  const codeScanner = useCodeScanner({
    codeTypes: ["qr", "ean-13"],
    onCodeScanned: (codes) => {
      setCapturedCode(codes[0]);
      ToastAndroid.show(`Scanned: ${ codes[0].value }`, ToastAndroid.SHORT);
      console.log(`Scanned ${ codes.length } codes!`);
    },
  });

  const requestCameraPermission = React.useCallback(async () => {
    const permission = await Camera.requestCameraPermission();

    if (permission === "denied") await Linking.openSettings();
    setCameraPermissionStatus(permission);
  }, []);

  React.useEffect(() => {
    console.log("pendingRide", pendingRide);
    (async () => {
      if (
        capturedCode
        && capturedCode.value
        && pendingRide
      ) {
        setCaptureState(CaptureState.Verifying);
        console.log(`Captured code: ${ capturedCode.value }`);
        const res = await confirmRide(pendingRide.id, capturedCode.value);

        if (res == "success") {
          setCaptureState(CaptureState.Captured);
        } else if (res == "error") {
          setCaptureState(CaptureState.Failed);
        }

        setTimeout(() => {
          setCapturedCode(null);
          setCaptureState(CaptureState.Scanning);
        }, 3000);
      }
    })();
  }, [capturedCode]);

  React.useEffect(() => {
    (async () => {
      const getCurrentPermission = Camera.getCameraPermissionStatus();
      setCameraPermissionStatus(getCurrentPermission);
    })();
  }, []);

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
        width: "100%",
        height: "100%",
        alignItems: "center",
        position: "absolute",
        justifyContent: "center",
      }}>
        {marker("white", 240, "25%", 5.5, 20)}
      </View>

      <View style={{
        bottom: "10%",
        width: "100%",
        position: "absolute",
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

      <ConfirmedCustomer
        status={captureState}
      />
    </View>
  );
};

const BottomSheetBackground = ({ style }: BottomSheetBackgroundProps) => {
  return (
    <View style={[{ borderRadius: 12, backgroundColor: "white" }, style,]} />
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

interface ConfirmedCustomerProps {
  status: CaptureState;
}

const ConfirmedCustomer = ({ status }: ConfirmedCustomerProps): JSX.Element => {
  return (
    <View style={{
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      position: "absolute",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      display: status != CaptureState.Scanning ? "flex" : "none",
    }}>
      {status == CaptureState.Captured && (
        <Octicons name="check-circle-fill" size={120} color="white" />
      )}
      {status == CaptureState.Failed && (
        <Octicons name="x-circle-fill" size={120} color="white" />
      )}
      {status == CaptureState.Verifying && (
        <ActivityIndicator
          size={120}
          color="white"
        />
      )}
    </View>
  );
};


export default CaptureQRCode;

function marker(color: string, size: DimensionValue, borderLength: DimensionValue, thickness: number = 2, borderRadius: number = 0): JSX.Element {
  return <View style={{ height: size, width: size }}>
    <View style={{ position: 'absolute', height: borderLength, width: borderLength, top: 0, left: 0, borderColor: color, borderTopWidth: thickness, borderLeftWidth: thickness, borderTopLeftRadius: borderRadius }}></View>
    <View style={{ position: 'absolute', height: borderLength, width: borderLength, top: 0, right: 0, borderColor: color, borderTopWidth: thickness, borderRightWidth: thickness, borderTopRightRadius: borderRadius }}></View>
    <View style={{ position: 'absolute', height: borderLength, width: borderLength, bottom: 0, left: 0, borderColor: color, borderBottomWidth: thickness, borderLeftWidth: thickness, borderBottomLeftRadius: borderRadius }}></View>
    <View style={{ position: 'absolute', height: borderLength, width: borderLength, bottom: 0, right: 0, borderColor: color, borderBottomWidth: thickness, borderRightWidth: thickness, borderBottomRightRadius: borderRadius }}></View>
  </View>
}


const textStyles = StyleSheet.create({
  verifyQRCodeStatusText: {
    fontSize: 13,
    fontFamily: "DMSans-Regular",
  }
});


const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  verifyQRCodeStatusContainer: {
    gap: 4,
    width: "100%",
    height: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  verifyQRCodeStatusContainerLoading: {
    gap: 4,
    width: "100%",
    height: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  sheetContainer: {
    padding: 12,
    marginHorizontal: 12,
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
