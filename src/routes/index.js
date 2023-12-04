import {createNativeStackNavigator} from "@react-navigation/native-stack";
import Home from "../pages/Home";
import SignIn from "../pages/Signin";
import Registry from "../pages/Registry";

const Stack = createNativeStackNavigator();

export default function Routes() {
    return(
        <Stack.Navigator>
            <Stack.Screen
                name='Home'
                component={Home}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name='SignIn'
                component={SignIn}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name='Registry'
                component={Registry}
                options={{headerShown: false}}
            />
        </Stack.Navigator>
    )
}