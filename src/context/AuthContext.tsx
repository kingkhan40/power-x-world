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

interface ProfileData {
    user: User | null;
    referrerData: {
        name: string;
        sponsorId: string | null;
        profile: string | null;
    };
    loading: boolean;
    error: string;
    message: string;
    fetchProfile: () => Promise<void>;
    updateProfile: (formData: FormData) => Promise<void>;
    updateProfilePicture: (file: File) => Promise<void>;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string;
    message: string;
    contactLoading: boolean;
    contactMessage: Message;
    forgotPasswordLoading: boolean;
    forgotPasswordMessage: Message;
    changePasswordLoading: boolean;
    changePasswordMessage: Message;
    passwordCriteria: PasswordCriteria;
    passwordStrength: PasswordStrength;
    otpSent: boolean;
    resetPasswordSuccess: boolean;
    profileData: ProfileData;
    login: (formData: AuthData) => Promise<void>;
    register: (formData: AuthData) => Promise<void>;
    verifyEmail: (email: string, code: string) => Promise<void>;
    logout: () => Promise<void>;
    sendContactMessage: (contactData: ContactData) => Promise<void>;
    sendOtp: (email: string) => Promise<void>;
    resetPassword: (email: string, otp: string, newPassword: string) => Promise<void>;
    changePassword: (data: ChangePasswordData) => Promise<void>;
    checkPasswordStrength: (password: string) => void;
    clearForgotPasswordState: () => void;
    clearChangePasswordState: () => void;
    fetchUserProfile: () => Promise<void>;
    updateUserProfile: (name?: string, profilePic?: string) => Promise<void>;
    setLoading: (loading: boolean) => void;
    setError: (error: string) => void;
    setMessage: (message: string) => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const router = useRouter();

    // ---- States ----
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

    // ---- Functions ----

    const fetchUserProfile = async (): Promise<void> => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        if (!userId) return;

        setProfileData((prev) => ({ ...prev, loading: true, error: '' }));

        try {
            const headers: Record<string, string> = { 'x-user-id': userId };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const [profileRes, depositRes, refRes] = await Promise.all([
                fetch('/api/user/profile', { headers }),
                fetch('/api/deposits', { headers }),
                fetch('/api/user/referrer', { headers }),
            ]);

            const profileUser = (await profileRes.json()).user ?? {};
            const deposits = depositRes.ok ? await depositRes.json() : [];
            const ref = refRes.ok ? await refRes.json() : {};

            const totalDeposits = deposits.reduce((sum: number, d: any) => sum + (d.amount || 0), 0);

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

            // Update localStorage
            if (profileUser.name) localStorage.setItem('userName', profileUser.name);
            if (profileUser.profilePic) localStorage.setItem('profilePic', profileUser.profilePic);
        } catch (err: any) {
            setProfileData((prev) => ({ ...prev, error: err.message || 'Failed to load profile', loading: false }));
        }
    };

    const updateUserProfile = async (name?: string, profilePic?: string): Promise<void> => {
        if (!user?.userId) return;
        setLoading(true);
        setError('');

        try {
            const userId = user.userId;
            const formData = new FormData();

            if (name) formData.append("name", name);

            if (profilePic && profilePic.startsWith("data:image")) {
                const blob = await fetch(profilePic).then((r) => r.blob());
                formData.append("profilePic", blob, "profile.png");
            }

            const res = await fetch("/api/user/profile", {
                method: "POST",
                headers: { "x-user-id": userId },
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || data.error || "Failed to update");

            setUser(data.user);
            setProfileData((prev) => ({ ...prev, user: data.user }));
            localStorage.setItem('userName', data.user.name || '');
            if (data.user.profilePic) localStorage.setItem('profilePic', data.user.profilePic);

            setMessage(data.message || 'Profile updated successfully!');
        } catch (err: any) {
            setError(err.message || "Error updating profile");
        } finally {
            setLoading(false);
        }
    };

    const checkPasswordStrength = (password: string) => {
        setPasswordCriteria({
            length: password.length >= 6,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        });
    };

    const passwordStrength = (() => {
        const criteriaMet = Object.values(passwordCriteria).filter(Boolean).length;
        if (criteriaMet === 5) return { strength: "Strong", color: "from-green-500 to-emerald-500", width: "100%" };
        if (criteriaMet >= 3) return { strength: "Good", color: "from-blue-500 to-cyan-500", width: "75%" };
        if (criteriaMet >= 2) return { strength: "Fair", color: "from-yellow-500 to-orange-500", width: "50%" };
        return { strength: "Weak", color: "from-red-500 to-pink-500", width: "25%" };
    })();

    // ---- Auto login on mount ----
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
            fetchUserProfile();
        }
    }, []);

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
        login: async () => {},
        register: async () => {},
        verifyEmail: async () => {},
        logout: async () => {},
        sendContactMessage: async () => {},
        sendOtp: async () => {},
        resetPassword: async () => {},
        changePassword: async () => {},
        checkPasswordStrength,
        clearForgotPasswordState: () => {},
        clearChangePasswordState: () => {},
        fetchUserProfile,
        updateUserProfile,
        setLoading,
        setError,
        setMessage,
        isAuthenticated,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
