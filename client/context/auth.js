import Axios from "axios";
import {
    createContext,
    useContext,
    useEffect,
    useLayoutEffect,
    useReducer,
} from "react";
import { useRouter } from "next/router";

const DispatchContext = createContext(null);

const StateContext = createContext({
    user: null,
    authenticated: false,
    loading: true,
    isSidebarOpen: true,
});

const reducer = (state, { type, payload }) => {
    switch (type) {
        case "LOGIN":
            return {
                ...state,
                authenticated: true,
                user: payload,
            };
        case "LOGOUT":
            return {
                ...state,
                authenticated: false,
                user: null,
            };
        case "STOP_LOADING":
            return { ...state, loading: false };
        case "OPEN_SIDEBAR":
            return { ...state, isSidebarOpen: true };
        case "CLOSE_SIDEBAR":
            return { ...state, isSidebarOpen: false };
        default:
            throw new Error(`Unknown action type: ${type}`);
    }
};

export const AuthProvider = ({ children, userData }) => {
    const router = useRouter();
    const [state, defaultDispatch] = useReducer(reducer, {
        user: null,
        authenticated: false,
        loading: true,
        isSidebarOpen: true,
    });

    const dispatch = (type, payload) => {
        defaultDispatch({ type, payload });
    };

    useEffect(() => {
        async function loadUser() {
            try {
                const res = await Axios.get("http://localhost:3001/user/me");
                dispatch("LOGIN", res.data);
            } catch (err) {
                // console.log(err);
                // router.push("/login");
            } finally {
                dispatch("STOP_LOADING");
            }
        }
        loadUser();
    }, []);

    return (
        <DispatchContext.Provider value={dispatch}>
            <StateContext.Provider value={state}>
                {children}
            </StateContext.Provider>
        </DispatchContext.Provider>
    );
};

export const useAuthState = () => useContext(StateContext);
export const useAuthDispatch = () => useContext(DispatchContext);
