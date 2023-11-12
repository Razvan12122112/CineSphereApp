import firebaseui from "firebaseui";
import { auth } from "./firebaseConfig";

const uiConfig = {
    signInOptions: [
      'password' 
      // ... other config options
    ],
  };
  
  const ui = new firebaseui.auth.AuthUI(auth);

  ui.start('#firebaseui-auth-container', uiConfig);