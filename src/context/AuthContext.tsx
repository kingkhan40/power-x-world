'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';

interface User {
  userId: string;
  userName: string;
  userEmail: string;
  referralLink: string;
  token?: string;
  profilePic?: string | null;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  joinDate?: string;
  kycStatus?: string;
  accountType?: string;
  totalInvestment?: string;
  totalEarnings?: string;
  totalWithdrawals?: string;
  activePlans?: string;
  referralCode?: string;
  wallet?: number;
  usdtBalance?: number;
  selfBusiness?: number;
  directBusiness?: number;
  rewardBalance?: number;
  currentRewardLevel?: number;
  level?: number;
  totalTeam?: number;
  activeUsers?: number;
  investments?: Array<any>;
  totalCommission?: number;
  rewardPayment?: number;
}

interface AuthData {
  email: string;
  password: string;
  name?: string;
  confirmPassword?: string;
  referralCode?: string | null;
}

interface ContactData {
  name: string;
  email: string;
  message: string;
}

interface ChangePasswordData {
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword?: string;
}

interface ForgotPasswordData {
  email: string;
  otp?: string;
  newPassword?: string;
}

interface ReferrerData {
  name: string;
  sponsorId: string | null;
  profile: string | null;
}

interface ProfileData {
  user: User | null;
  referrerData: ReferrerData;
  loading: boolean;
  error: string;
  message: string;
  fetchProfile: () => Promise<void>;
  updateProfile: (formData: FormData) => Promise<void>;
  updateProfilePicture: (file: File) => Promise<void>;
}

interface PasswordCriteria {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
}

interface Message {
  type: "success" | "error" | "";
  text: string;
}

interface PasswordStrength {
  strength: string;
  color: string;
  width: string;
}

interface AuthContextType {
  // Auth States
  user: User | null;
  loading: boolean;
  error: string;
  message: string;
  
  // Contact States
  contactLoading: boolean;
  contactMessage: Message;

  // Forgot Password States
  forgotPasswordLoading: boolean;
  forgotPasswordMessage: Message;
  otpSent: boolean;
  resetPasswordSuccess: boolean;

  // Change Password States
  changePasswordLoading: boolean;
  changePasswordMessage: Message;
  passwordCriteria: PasswordCriteria;
  passwordStrength: PasswordStrength;

  // Profile States
  profileData: ProfileData;

  // Auth Functions
  login: (formData: AuthData) => Promise<void>;
  register: (formData: AuthData) => Promise<void>;
  verifyEmail: (email: string, code: string) => Promise<void>;
  logout: () => Promise<void>;

  // Contact Functions
  sendContactMessage: (contactData: ContactData) => Promise<void>;

  // Forgot Password Functions
  sendOtp: (email: string) => Promise<void>;
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<void>;
  clearForgotPasswordState: () => void;

  // Change Password Functions
  changePassword: (changePasswordData: ChangePasswordData) => Promise<void>;
  checkPasswordStrength: (password: string) => void;
  clearChangePasswordState: () => void;

  // Profile Functions
  fetchUserProfile: () => Promise<void>;
  updateUserProfile: (name?: string, profilePic?: string) => Promise<void>;

  // Common States
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  setMessage: (message: string) => void;

  // Check if user is authenticated
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [contactLoading, setContactLoading] = useState(false);
  const [contactMessage, setContactMessage] = useState<Message>({ type: "", text: "" });
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState<Message>({ type: "", text: "" });
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const [changePasswordMessage, setChangePasswordMessage] = useState<Message>({ type: "", text: "" });
  const [otpSent, setOtpSent] = useState(false);
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false);
  const [passwordCriteria, setPasswordCriteria] = useState<PasswordCriteria>({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    user: null,
    referrerData: { name: 'Admin', sponsorId: null, profile: null },
    loading: false,
    error: '',
    message: '',
    fetchProfile: async () => {},
    updateProfile: async () => {},
    updateProfilePicture: async () => {},
  });

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    const referralLink = localStorage.getItem('referralLink');
    const profilePic = localStorage.getItem('profilePic');

    if (token && userId) {
      const userData: User = {
        token,
        userId,
        userName: userName || '',
        userEmail: userEmail || '',
        referralLink: referralLink || '',
        profilePic: profilePic || null,
      };
      setUser(userData);
      setIsAuthenticated(true);

      // Auto fetch profile data
      fetchUserProfile();
    }
  }, []);

  // Login Function
  const login = async (formData: AuthData): Promise<void> => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Save user data
      const userData: User = {
        userId: data.userId,
        userName: data.userName,
        userEmail: data.userEmail,
        referralLink: data.referralLink,
        token: data.token,
        profilePic: data.profilePic || null,
      };

      setUser(userData);
      setIsAuthenticated(true);

      // Save to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('userName', data.userName);
      localStorage.setItem('userEmail', data.userEmail);
      localStorage.setItem('referralLink', data.referralLink);
      if (data.profilePic) {
        localStorage.setItem('profilePic', data.profilePic);
      }

      setMessage('Login successful!');
      router.push('/home');
    } catch (err: any) {
      setError(err.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Register Function
  const register = async (formData: AuthData): Promise<void> => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          referralCode: formData.referralCode,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setMessage('Verification code sent to your email!');
      return data;
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Verify Email Function
  const verifyEmail = async (email: string, code: string): Promise<void> => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Invalid or expired code');
      }

      setMessage('Email verified successfully! Account created.');
      router.push('/login');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Change Password Function
  const changePassword = async (changePasswordData: ChangePasswordData): Promise<void> => {
    setChangePasswordLoading(true);
    setChangePasswordMessage({ type: "", text: "" });

    try {
      // Validation
      if (!changePasswordData.email || !changePasswordData.currentPassword || !changePasswordData.newPassword) {
        throw new Error('Please fill in all fields');
      }

      if (changePasswordData.newPassword !== changePasswordData.confirmPassword) {
        throw new Error('New passwords do not match');
      }

      const res = await fetch("/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: changePasswordData.email,
          currentPassword: changePasswordData.currentPassword,
          newPassword: changePasswordData.newPassword
        }),
      });

      const data = await res.json();
      
      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error || "Password update failed");
      }

      setChangePasswordMessage({
        type: "success",
        text: "✅ Password changed successfully!",
      });

      // Clear form data after successful change
      setTimeout(() => {
        clearChangePasswordState();
      }, 3000);
      
    } catch (err: any) {
      setChangePasswordMessage({
        type: "error",
        text: err.message || "❌ Something went wrong. Try again later.",
      });
      throw err;
    } finally {
      setChangePasswordLoading(false);
    }
  };

  // Check Password Strength
  const checkPasswordStrength = (password: string): void => {
    setPasswordCriteria({
      length: password.length >= 6,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  };

  // Clear Change Password State
  const clearChangePasswordState = (): void => {
    setChangePasswordMessage({ type: "", text: "" });
    setPasswordCriteria({
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false,
    });
  };

  // Send OTP for Forgot Password
  const sendOtp = async (email: string): Promise<void> => {
    setForgotPasswordLoading(true);
    setForgotPasswordMessage({ type: "", text: "" });

    try {
      // Validation
      if (!email || !/\S+@\S+\.\S+/.test(email) ) {
        throw new Error('Please enter a valid email address');
      }

      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || data.message || "Failed to send OTP");
      }

      setForgotPasswordMessage({
        type: "success",
        text: "✅ OTP sent to your email (check spam if not found)",
      });
      setOtpSent(true);
    } catch (err: any) {
      setForgotPasswordMessage({
        type: "error",
        text: err.message || "Something went wrong!",
      });
      throw err;
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  // Reset Password with OTP
  const resetPassword = async (email: string, otp: string, newPassword: string): Promise<void> => {
    setForgotPasswordLoading(true);
    setForgotPasswordMessage({ type: "", text: "" });

    try {
      // Validation
      if (otp.length !== 6) {
        throw new Error('Please enter the complete 6-digit OTP');
      }

      if (!newPassword) {
        throw new Error('Please enter a new password');
      }

      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || data.message || "Failed to reset password");
      }

      setForgotPasswordMessage({
        type: "success",
        text: "🎉 Password reset successful!",
      });
      setResetPasswordSuccess(true);
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login');
      }, 2000);
      
    } catch (err: any) {
      setForgotPasswordMessage({
        type: "error",
        text: err.message || "Server error",
      });
      throw err;
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  // Clear Forgot Password State
  const clearForgotPasswordState = (): void => {
    setForgotPasswordMessage({ type: "", text: "" });
    setOtpSent(false);
    setResetPasswordSuccess(false);
    setForgotPasswordLoading(false);
  };

  // Send Contact Message Function
  const sendContactMessage = async (contactData: ContactData): Promise<void> => {
    setContactLoading(true);
    setContactMessage({ type: "", text: "" });

    try {
      // Validation
      if (!contactData.name || !contactData.email || !contactData.message) {
        throw new Error('Please fill in all fields');
      }

      if (!/\S+@\S+\.\S+/.test(contactData.email)) {
        throw new Error('Please enter a valid email address');
      }

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      });

      if (response.ok) {
        setContactMessage({
          type: "success",
          text: "Thank you! Your message has been sent successfully. We will get back to you soon.",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || "Failed to send the message. Please try again later.");
      }
    } catch (err: any) {
      setContactMessage({
        type: "error",
        text: err.message || "An error occurred. Please try again later.",
      });
      throw err;
    } finally {
      setContactLoading(false);
    }
  };

  // Fetch User Profile Function
  const fetchUserProfile = async (): Promise<void> => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!userId) return;

    setProfileData((prev) => ({ ...prev, loading: true, error: '' }));

    try {
      const headers: Record<string, string> = { 'x-user-id': userId };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      // Fetch profile data
      const [profileRes, depositRes, refRes] = await Promise.all([
        fetch('/api/user/profile', { headers }),
        fetch('/api/deposits', { headers }),
        fetch('/api/user/referrer', { headers }),
      ]);

      const profileResData = await profileRes.json();
      if (!profileRes.ok) {
        throw new Error(profileResData.message || 'Profile fetch failed');
      }
      const profileUser = profileResData.user ?? {};

      const depositResData = await depositRes.json();
      const deposits = depositRes.ok ? depositResData : [];

      const refResData = await refRes.json();
      const ref = refRes.ok ? refResData : {};

      const totalDeposits = deposits.reduce(
        (sum: number, d: any) => sum + (d.amount || 0),
        0
      );

      // Update user data with profile information
      const updatedUser: User = {
        ...user!,
        name: profileUser.name || user?.userName || '',
        email: profileUser.email || user?.userEmail || '',
        userEmail: profileUser.email || user?.userEmail || '',
        phone: profileUser.phone ?? undefined,
        address: profileUser.address ?? undefined,
        joinDate: profileUser.createdAt
          ? new Date(profileUser.createdAt).toISOString().split('T')[0]
          : 'N/A',
        kycStatus: 'verified',
        accountType: profileUser.role === 'Admin' ? 'Admin' : 'Premium',
        totalInvestment: `$${profileUser.selfBusiness?.toFixed(2) || '0.00'}`,
        totalEarnings: `$${profileUser.rewardBalance?.toFixed(2) || '0.00'}`,
        totalWithdrawals: `$${profileUser.totalCommission?.toFixed(2) || '0.00'}`,
        activePlans: (profileUser.investments?.length || 0).toString(),
        referralCode: profileUser.referralCode || 'N/A',
        profilePic: profileUser.profilePic || user?.profilePic,
        wallet: profileUser.wallet || 0,
        usdtBalance: totalDeposits || profileUser.usdtBalance || 0,
        selfBusiness: profileUser.selfBusiness || 0,
        directBusiness: profileUser.directBusiness || 0,
        rewardBalance: profileUser.rewardBalance || 0,
        currentRewardLevel: profileUser.currentRewardLevel || 1,
        level: profileUser.level || 1,
        totalTeam: profileUser.totalTeam || 0,
        activeUsers: profileUser.activeUsers || 0,
        investments: profileUser.investments || [],
        totalCommission: profileUser.totalCommission ?? 0,
        rewardPayment: profileUser.rewardPayment ?? 0,
      };

      setUser(updatedUser);

      // Update profile data state
      setProfileData((prev) => ({
        ...prev,
        user: updatedUser,
        referrerData: {
          name: ref.name || 'Admin',
          sponsorId: ref.sponsorId || null,
          profile: ref.profile || null,
        },
        loading: false,
      }));

      // Update localStorage with latest data
      if (profileUser.name) localStorage.setItem('userName', profileUser.name);
      if (profileUser.profilePic) {
        localStorage.setItem('profilePic', profileUser.profilePic);
      }
    } catch (err: any) {
      setProfileData((prev) => ({
        ...prev,
        error: err.message || 'Failed to load profile',
        loading: false,
      }));
    }
  };

  // Updated Update User Profile Function (integrated the suggested code)
  const updateUserProfile = async (name?: string, profilePic?: string): Promise<void> => {
    if (!user?.userId) return;
    setLoading(true);
    setError('');

    try {
      const userId = user.userId;

      const formData = new FormData();

      // Append name if provided
      if (name) formData.append("name", name);

      // Convert data URL to actual file before upload
      if (profilePic && profilePic.startsWith("data:image")) {
        const blob = await fetch(profilePic).then((r) => r.blob());
        formData.append("profilePic", blob, "profile.png");
      }

      const res = await fetch("/api/user/profile", {
        method: "POST",
        headers: {
          "x-user-id": userId,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "Failed to update");
      }

      const updatedUserData = data.user ?? {};

      // Update local user state
      setUser(updatedUserData);
      setProfileData((prev) => ({ ...prev, user: updatedUserData }));

      // Update localStorage
      localStorage.setItem('userName', updatedUserData.name || '');
      if (updatedUserData.profilePic) {
        localStorage.setItem('profilePic', updatedUserData.profilePic);
      }

      setMessage(data.message || 'Profile updated successfully!');
    } catch (err: any) {
      console.error("Profile update failed:", err);
      setError(err.message || "Error updating profile");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout Function
  const logout = async (): Promise<void> => {
    try {
      const token = localStorage.getItem("token");

      // Call backend logout API
      const res = await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const data = await res.json();
      console.log("Logout response:", data); // Dev terminal me dikhega

      // Clear client-side state
      setUser(null);
      setIsAuthenticated(false);
      setProfileData({
        user: null,
        referrerData: { name: "Admin", sponsorId: null, profile: null },
        loading: false,
        error: "",
        message: "",
        fetchProfile: async () => {},
        updateProfile: async () => {},
        updateProfilePicture: async () => {},
      });

      // Clear localStorage
      localStorage.clear();

      // Redirect to login page
      router.push("/login");
    } catch (err: any) {
      console.error("Logout failed:", err.message || err);

      // Ensure local logout even if API fails
      setUser(null);
      setIsAuthenticated(false);
      setProfileData({
        user: null,
        referrerData: { name: "Admin", sponsorId: null, profile: null },
        loading: false,
        error: "",
        message: "",
        fetchProfile: async () => {},
        updateProfile: async () => {},
        updateProfilePicture: async () => {},
      });
      localStorage.clear();
      router.push("/login");
    }
  };

  // Get Password Strength
  const getPasswordStrength = (): PasswordStrength => {
    const criteriaMet = Object.values(passwordCriteria).filter(Boolean).length;
    if (criteriaMet === 5)
      return {
        strength: "Strong",
        color: "from-green-500 to-emerald-500",
        width: "100%",
      };
    if (criteriaMet >= 3)
      return {
        strength: "Good",
        color: "from-blue-500 to-cyan-500",
        width: "75%",
      };
    if (criteriaMet >= 2)
      return {
        strength: "Fair",
        color: "from-yellow-500 to-orange-500",
        width: "50%",
      };
    return {
      strength: "Weak",
      color: "from-red-500 to-pink-500",
      width: "25%",
    };
  };

  const passwordStrength = getPasswordStrength();

  const value: AuthContextType = {
    user,
    loading,
    error,
    message,
    contactLoading,
    contactMessage,
    forgotPasswordLoading,
    forgotPasswordMessage,
    changePasswordLoading,
    changePasswordMessage,
    passwordCriteria,
    passwordStrength,
    otpSent,
    resetPasswordSuccess,
    profileData: {
      ...profileData,
      fetchProfile: fetchUserProfile,
      updateProfile: async (formData: FormData) => {
        const name = formData.get('name') as string;
        await updateUserProfile(name);
      },
      updateProfilePicture: async (file: File) => {
        const reader = new FileReader();
        reader.onload = async (ev) => {
          const dataUrl = ev.target?.result as string;
          await updateUserProfile(user?.userName || '', dataUrl);
        };
        reader.readAsDataURL(file);
      },
    },
    login,
    register,
    verifyEmail,
    sendContactMessage,
    sendOtp,
    resetPassword,
    changePassword,
    checkPasswordStrength,
    clearForgotPasswordState,
    clearChangePasswordState,
    logout,
    fetchUserProfile,
    updateUserProfile,
    setLoading,
    setError,
    setMessage,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom Hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};