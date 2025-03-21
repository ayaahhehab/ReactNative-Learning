import type { NativeStackScreenProps } from "@react-navigation/native-stack";

export type HomeStackNavigatorParamList = {
    Login : undefined;
    Profile : { username: string;};
    List : undefined;
    Splash : undefined;
}
export type HomeStackNavigationProp = NativeStackScreenProps<HomeStackNavigatorParamList , 
Login,
 Profile,
  List, Splash
>