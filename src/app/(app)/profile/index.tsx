import React from "react";
import { View, Text, StyleSheet, Pressable, ViewStyle, ImageSourcePropType } from "react-native";

import { Image } from "expo-image";
import { useRouter, useFocusEffect } from "expo-router";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

import HelpIcon from "@/assets/icons/help.svg";
import InfoIcon from "@/assets/icons/info.svg";
import UserIcon from "@/assets/icons/user.svg";
import EditIcon from "@/assets/icons/edit-alt.svg";
import WalletIcon from "@/assets/icons/wallet.svg";
import DriverIcon from "@/assets/icons/driver.svg";
import LogoutIcon from "@/assets/icons/log-out.svg";
import HistoryIcon from "@/assets/icons/history.svg";
import ChevronRight from "@/assets/icons/chevron.svg";


const Profile = (): JSX.Element => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = React.useState<FirebaseAuthTypes.User | null>(null);

  const updateUser = React.useCallback(() => {
    const subscriber = auth()
      .onAuthStateChanged((user) => {
        if (user) {
          setCurrentUser(user);
        }
      });
    return () => subscriber();
  }, [currentUser]);
  useFocusEffect(updateUser);

  const ProfileInfo = (
    <View style={styles.profileInfoContainer}>
      <View style={{
        width: 100,
        height: 100,
        padding: 20,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "hsl(0, 0%, 95%)",
      }}>
        {currentUser && currentUser.photoURL ? (
          <Image
            source={{ uri: currentUser.photoURL }}
            style={{ width: "100%", height: "100%" }}
          />
        ) : (
          <Image
            source={UserIcon}
            style={{ width: "100%", height: "100%" }}
          />
        )}
      </View>

      <View style={{
        alignItems: "center",
        justifyContent: "center",
      }}>
        <Text style={[textStyles.usernameText]}>{currentUser?.displayName}</Text>
        <Text style={textStyles.emailText}>{currentUser?.email}</Text>
      </View>

      <Pressable
        onPress={() => {
          router.push("/(profile)/edit-profile");
        }}
        style={styles.editProfileButton}>
        <Icon
          icon={EditIcon}
          style={{ width: 12, height: 12 }}
        />
        <Text style={textStyles.editButtonText}>Edit Profile</Text>
      </Pressable>
    </View>
  );

  interface SectionItemContainerProps {
    children: JSX.Element | JSX.Element[];
  }

  const SectionItemContainer = ({ children }: SectionItemContainerProps): JSX.Element => {
    return (
      <View style={{
        gap: 1,
        width: "85%",
        marginBottom: 12,
        borderWidth: 1.2,
        borderRadius: 16,
        overflow: "hidden",
        borderColor: "hsl(0, 0%, 90%)",
        backgroundColor: "hsl(0, 0%, 90%)",
      }}>
        {children}
      </View>
    )
  }

  interface SectionItemProps {
    title: string;
    onPress: () => void;
    showNextIcon?: boolean;
    icon: ImageSourcePropType;
  }

  const SectionItem = ({ title, onPress, icon, showNextIcon = true }: SectionItemProps): JSX.Element => {
    return (
      <Pressable
        onPress={onPress}
        style={{
          paddingVertical: 14,
          paddingHorizontal: 16,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: "hsl(0, 0%, 97%)",
        }}
      >
        <View style={{ alignItems: "center", flexDirection: "row", gap: 8 }}>
          <Icon
            icon={icon}
            style={{ width: 24, height: 24 }}
          />
          <Text style={textStyles.sectionItemText}>{title}</Text>
        </View>
        {showNextIcon && (
          <Icon
            icon={ChevronRight}
            style={{ width: 24, height: 24 }}
          />
        )}
      </Pressable>
    );
  };

  const SectionsContainer = (
    <View style={styles.sectionsContainer}>
      <SectionItemContainer>
        <SectionItem
          title="Driver Information"
          icon={DriverIcon}
          onPress={() => {
            router.push("/(profile)/driver-information");
          }}
        />
        <SectionItem
          title="Wallet"
          icon={WalletIcon}
          onPress={() => {
            router.push("/(profile)/wallet");
          }}
        />
        {/* <SectionItem
          title="Ride History"
          icon={HistoryIcon}
          onPress={() => {
            router.push("/(profile)/ride-history");
          }}
        /> */}
      </SectionItemContainer>
      <SectionItemContainer>
        <SectionItem
          title="FAQs"
          icon={HelpIcon}
          onPress={() => {
            router.push("/(profile)/faq");
          }}
        />
        <SectionItem
          title="Help"
          icon={InfoIcon}
          onPress={() => {
            router.push("/(profile)/help");
          }}
        />
        <SectionItem
          title="Logout"
          icon={LogoutIcon}
          onPress={() => { }}
          showNextIcon={false}
        />
      </SectionItemContainer>
    </View>
  );

  return (
    <View style={styles.container}>
      {ProfileInfo}
      {SectionsContainer}
    </View>
  );
};


export default Profile;

interface IconProps {
  style: ViewStyle,
  icon: ImageSourcePropType;
}

const Icon = ({ icon, style }: IconProps): JSX.Element => {
  return (
    <View style={[
      {
        width: 24,
        height: 24,
        alignItems: "center",
        justifyContent: "center",
      },
      style
    ]}>
      <Image
        source={icon}
        style={{ width: "100%", height: "100%" }}
      />
    </View>
  )
}


const textStyles = StyleSheet.create({
  usernameText: {
    fontSize: 20,
    fontFamily: "DMSans-Bold",
  },
  emailText: {
    fontSize: 14,
    color: "hsl(0, 0%, 50%)",
    fontFamily: "DMSans-Regular",
  },
  editButtonText: {
    color: "white",
    fontSize: 14,
    fontFamily: "DMSans-Regular",
  },
  sectionItemText: {
    fontSize: 15,
    fontFamily: "DMSans-Regular",
  }
})


const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    paddingTop: 38,
    backgroundColor: "#fff",
  },
  profileInfoContainer: {
    gap: 12,
    height: "37%",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  sectionsContainer: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
  },
  editProfileButton: {
    gap: 8,
    borderRadius: 16,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    backgroundColor: "black",
  }
});