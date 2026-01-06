import type SignUpData from "@/types/SignUpData";
import type LoginData from "@/types/LoginData";
import type { User } from "firebase/auth";

export default interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (data: LoginData) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  logout: () => Promise<void>;
}
