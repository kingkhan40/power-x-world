// app/admin/settings/page.tsx
"use client";

i
  email: boolean;
  push: boolean;
}

interface Settings {
  notifications?: NotificationSettings; // Optional to handle undefined case
  twoFactorAuth: boolean;
  profilePicture?: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Union type for notification keys
type NotificationType = keyof NotificationSettings;

const SettingsPage = () => {
  const { settings, profile, updateSettings, updateProfile, changePassword } = useAdmin();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [profileForm, setProfileForm] = useState<Profile>({
    name: profile.name || "",
    email: profile.email || "john.doe@example.com",
  });
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [isUploadLoading, setIsUploadLoading] = useState(false);

  // Sync profileForm with profile changes
  useEffect(() => {
    setProfileForm({
      name: profile.name || "",
      email: profile.email || "john.doe@example.com",
    });
  }, [profile.name, profile.email]);

  // Handle Escape key to close modals
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowEditProfileModal(false);
        setShowChangePasswordModal(false);
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setProfileForm({ name: profile.name || "", email: profile.email || "john.doe@example.com" });
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [profile.name, profile.email]);

  const toggleNotification = useCallback(
    async (type: NotificationType) => {
      if (!settings.notifications) {
        setError("Notification settings are not available");
        setTimeout(() => setError(""), 5000);
        return;
      }
      setIsProfileLoading(true);
      setError("");
      try {
        const updatedNotifications = {
          ...settings.notifications,
          [type]: !settings.notifications[type],
        };
        await updateSettings({ notifications: updatedNotifications });
        setSuccess(`${type.charAt(0).toUpperCase() + type.slice(1)} notifications updated!`);
        setTimeout(() => setSuccess(""), 5000);
      } catch (error: any) {
        console.error("Error updating notifications:", error);
        setError(error.message || "Failed to update notifications");
        setTimeout(() => setError(""), 5000);
      } finally {
        setIsProfileLoading(false);
      }
    },
    [settings.notifications, updateSettings]
  );

  const toggleTwoFactorAuth = useCallback(async () => {
    setIsProfileLoading(true);
    setError("");
    try {
      await updateSettings({ twoFactorAuth: !settings.twoFactorAuth });
      setSuccess("Two-factor authentication updated!");
      setTimeout(() => setSuccess(""), 5000);
    } catch (error: any) {
      console.error("Error updating 2FA:", error);
      setError(error.message || "Failed to update two-factor authentication");
      setTimeout(() => setError(""), 5000);
    } finally {
      setIsProfileLoading(false);
    }
  }, [settings.twoFactorAuth, updateSettings]);

  const handleProfilePicUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsUploadLoading(true);
      setError("");
      const formData = new FormData();
      formData.append("profilePicture", file);

      try {
        const res = await fetch("/api/upload-profile-pic", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.success) {
          await updateSettings({ profilePicture: data.profilePicture });
          setSuccess("Profile picture updated successfully!");
          setTimeout(() => setSuccess(""), 5000);
        } else {
          setError(data.error || "Failed to upload profile picture");
          setTimeout(() => setError(""), 5000);
        }
      } catch (error: any) {
        console.error("Error uploading profile picture:", error);
        setError(error.message || "Failed to upload profile picture");
        setTimeout(() => setError(""), 5000);
      } finally {
        setIsUploadLoading(false);
      }
    },
    [updateSettings]
  );

  const handleProfileSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsProfileLoading(true);
      setError("");
      try {
        await updateProfile({ name: profileForm.name, email: profileForm.email });
        setShowEditProfileModal(false);
        setSuccess("Profile updated successfully!");
        setTimeout(() => setSuccess(""), 5000);
      } catch (error: any) {
        console.error("Error updating profile:", error);
        setError(error.message || "Failed to update profile");
        setTimeout(() => setError(""), 5000);
      } finally {
        setIsProfileLoading(false);
      }
    },
    [profileForm, updateProfile]
  );

  const handlePasswordSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsPasswordLoading(true);
      setError("");

      // Password strength validation
      const isPasswordValid = (password: string) => {
        return (
          password.length >= 8 &&
          /[A-Z]/.test(password) &&
          /[a-z]/.test(password) &&
          /\d/.test(password) &&
          /[!@#$%^&*]/.test(password)
        );
      };

      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        setError("New passwords do not match");
        setTimeout(() => setError(""), 5000);
        setIsPasswordLoading(false);
        return;
      }

      if (!isPasswordValid(passwordForm.newPassword)) {
        setError(
          "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"
        );
        setTimeout(() => setError(""), 5000);
        setIsPasswordLoading(false);
        return;
      }

      try {
        const result = await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
        if (!result) {
          throw new Error("No response from server");
        }
        if (result.success) {
          setShowChangePasswordModal(false);
          setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
          setSuccess("Password changed successfully!");
          setTimeout(() => setSuccess(""), 5000);
        } else {
          const errorMessages: { [key: string]: string } = {
            "invalid-current-password": "Current password is incorrect",
            "password-too-weak": "New password is too weak",
            default: "Failed to change password",
          };
          // Fix: Check if result.error is a string before indexing
          setError(typeof result.error === "string" ? errorMessages[result.error] || errorMessages.default : errorMessages.default);
          setTimeout(() => setError(""), 5000);
        }
      } catch (error: any) {
        console.error("Password change error:", error);
        setError(error.message || "Failed to change password");
        setTimeout(() => setError(""), 5000);
      } finally {
        setIsPasswordLoading(false);
      }
    },
    [passwordForm, changePassword]
  );

  return (
    <div className="min-h-screen p-6 bg-gray-900">
      <div className="max-w-4xl mx-auto space-y-6">
        {error && <div className="bg-red-500 text-white p-3 rounded-lg">{error}</div>}
        {success && <div className="bg-green-500 text-white p-3 rounded-lg">{success}</div>}

        <motion.div
          className="bg-gray-800 bg-opacity-70 backdrop-blur-lg shadow-xl rounded-2xl p-8 border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
            <div className="relative">
              <img
                src={settings.profilePicture || "https://randomuser.me/api/portraits/men/3.jpg"}
                alt="Profile"
                className="rounded-full w-24 h-24 object-cover border-4 border-blue-500"
              />
              <button
                className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1 border-2 border-gray-800"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadLoading}
                aria-label="Edit profile picture"
              >
                <FaEdit className="w-4 h-4 text-white" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleProfilePicUpload}
              />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-2xl font-bold text-gray-100">{profile.name || "John Doe"}</h3>
              <p className="text-gray-400 text-lg">{profile.email}</p>
              <p className="text-gray-500 text-sm mt-1">Administrator</p>
            </div>
          </div>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2 w-full sm:w-auto"
            onClick={() => setShowEditProfileModal(true)}
            disabled={isProfileLoading}
            aria-label="Edit profile"
          >
            <FaEdit className="w-4 h-4" />
            Edit Profile
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            className="bg-gray-800 bg-opacity-70 backdrop-blur-lg shadow-xl rounded-2xl p-6 border border-gray-700"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center mb-6">
              <div className="bg-blue-500 p-2 rounded-lg">
                <FaBell className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-100 ml-3">Notifications</h2>
            </div>
            <div className="space-y-4">
              {settings.notifications ? (
                Object.entries(settings.notifications).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                  >
                    <span className="text-gray-300 capitalize">{key} Notifications</span>
                    <button
                      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
                        value ? "bg-blue-600" : "bg-gray-600"
                      }`}
                      onClick={() => toggleNotification(key as NotificationType)}
                      disabled={isProfileLoading}
                      aria-checked={value}
                      aria-label={`${key} notifications toggle`}
                    >
                      <span
                        className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${
                          value ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-gray-400">Notification settings are not available</div>
              )}
            </div>
          </motion.div>

          <motion.div
            className="bg-gray-800 bg-opacity-70 backdrop-blur-lg shadow-xl rounded-2xl p-6 border border-gray-700"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center mb-6">
              <div className="bg-green-500 p-2 rounded-lg">
                <FaShieldAlt className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-100 ml-3">Security</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-gray-700 transition-colors duration-200">
                <span className="text-gray-300">Two-Factor Authentication</span>
                <button
                  className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
                    settings.twoFactorAuth ? "bg-green-600" : "bg-gray-600"
                  }`}
                  onClick={toggleTwoFactorAuth}
                  disabled={isProfileLoading}
                  aria-checked={settings.twoFactorAuth}
                  aria-label="Two-factor authentication toggle"
                >
                  <span
                    className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${
                      settings.twoFactorAuth ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              <div className="pt-4">
                <button
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2 w-full"
                  onClick={() => setShowChangePasswordModal(true)}
                  disabled={isPasswordLoading}
                  aria-label="Change password"
                >
                  <FaKey className="w-4 h-4" />
                  Change Password
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {showEditProfileModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            role="dialog"
            aria-modal="true"
            aria-label="Edit profile modal"
          >
            <motion.div
              className="bg-gray-800 rounded-lg p-6 w-full max-w-md"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold text-gray-100 mb-4">Edit Profile</h2>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="text-gray-300">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full bg-gray-700 text-white rounded-lg p-2 mt-1"
                    placeholder="Enter your name"
                    disabled={isProfileLoading}
                    aria-required="true"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="text-gray-300">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full bg-gray-700 text-white rounded-lg p-2 mt-1"
                    placeholder="Enter your email"
                    disabled={isProfileLoading}
                    aria-required="true"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="bg-gray-600 text-white py-2 px-4 rounded-lg"
                    onClick={() => {
                      setShowEditProfileModal(false);
                      setProfileForm({ name: profile.name || "", email: profile.email || "john.doe@example.com" });
                    }}
                    disabled={isProfileLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center gap-2"
                    disabled={isProfileLoading}
                  >
                    {isProfileLoading && (
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      </svg>
                    )}
                    {isProfileLoading ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {showChangePasswordModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            role="dialog"
            aria-modal="true"
            aria-label="Change password modal"
          >
            <motion.div
              className="bg-gray-800 rounded-lg p-6 w-full max-w-md"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold text-gray-100 mb-4">Change Password</h2>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="text-gray-300">
                    Current Password
                  </label>
                  <input
                    id="currentPassword"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="w-full bg-gray-700 text-white rounded-lg p-2 mt-1"
                    placeholder="Enter current password"
                    disabled={isPasswordLoading}
                    aria-required="true"
                  />
                </div>
                <div>
                  <label htmlFor="newPassword" className="text-gray-300">
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full bg-gray-700 text-white rounded-lg p-2 mt-1"
                    placeholder="Enter new password"
                    disabled={isPasswordLoading}
                    aria-required="true"
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="text-gray-300">
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full bg-gray-700 text-white rounded-lg p-2 mt-1"
                    placeholder="Confirm new password"
                    disabled={isPasswordLoading}
                    aria-required="true"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="bg-gray-600 text-white py-2 px-4 rounded-lg"
                    onClick={() => {
                      setShowChangePasswordModal(false);
                      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                    }}
                    disabled={isPasswordLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center gap-2"
                    disabled={isPasswordLoading}
                  >
                    {isPasswordLoading && (
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      </svg>
                    )}
                    {isPasswordLoading ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;