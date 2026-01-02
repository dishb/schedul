import type SignUpData from "@/types/SignUpData";
import type { User } from "firebase/auth";

export default interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  logout: () => Promise<void>;
}
