"use client";

import { useState, useEffect } from "react";
import { FaRegCopy } from "react-icons/fa";

interface InvestmentInfoProps {
  userEmail: string;
}

const InvestmentInfo: React.FC<InvestmentInfoProps> = ({ userEmail }) => {
  const [referralLink, setReferralLink] = useState("https://powerxworld.uk/register"); // default
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReferral = async () => {
      try {
        const res = await fetch(`/api/user/${userEmail}`);
        if (res.status === 401) {
          setError("Please log in again to view your referral link.");
          setReferralLink("https://powerxworld.uk/register");
          return;
        }

        const data = await res.json();

        // ✅ Use backend's referralLink directly
        if (data.success && data.referralLink) {
          setReferralLink(data.referralLink);
        } else {
          setReferralLink("https://powerxworld.uk/register");
        }
      } catch (err) {
        console.error("Error fetching referral link:", err);
        setError("Failed to load referral link. Try refreshing the page.");
        setReferralLink("https://powerxworld.uk/register");
      } finally {
        setLoading(false);
      }
    };

    if (userEmail) fetchReferral();
  }, [userEmail]);

  const handleCopyLink = async () => {
    if (!referralLink || loading) return;
    try {
      await navigator.clipboard.writeText(referralLink);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = referralLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full space-y-4">
      {/* Referral Section */}
      <div className="w-full mt-3">
        <div className="lg:p-5 p-2 rounded-2xl relative overflow-hidden bg-gray-900/90 shadow-[inset_-5px_-5px_10px_#1f2937,inset_5px_5px_10px_#111827,0px_4px_8px_rgba(0,0,0,0.3)] border border-gray-800">
          {/* Gradient Border */}
          <div
            className="absolute -inset-2 rounded-2xl animate-spin"
            style={{
              background: "conic-gradient(from 0deg, #ff00ff, #00ffff, #ff00ff, #ffff00)",
              animationDuration: "9000ms",
              opacity: 0.4,
              filter: "blur(2px)",
              zIndex: 0,
            }}
          ></div>

          <div className="absolute inset-0.5 rounded-2xl bg-gray-900 z-1"></div>

          <div className="relative z-10">
            <h3 className="text-gray-200 lg:text-xl text-sm font-medium mb-2">
              Your Referral Link
            </h3>

            <div className="flex items-center gap-2 bg-gray-800 p-2 rounded-lg shadow-[inset_-2px_-2px_5px_#1f2937,inset_2px_2px_5px_#111827]">
              <span className="text-sm text-blue-100 flex-1 break-all">
                {loading ? "Loading..." : error ? "Error loading referral link" : referralLink}
              </span>

              <button
                onClick={handleCopyLink}
                disabled={loading}
                className={`flex items-center gap-1 px-3 py-2 rounded-md transition-all ${
                  copied ? "bg-green-500/40 text-white" : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                <FaRegCopy className="text-sm" />
                <span className="text-sm font-medium">{copied ? "Copied!" : "Copy"}</span>
              </button>
            </div>

            {copied && (
              <div className="text-green-500 text-sm font-medium mt-2 flex items-center gap-1">
                ✓ Link copied to clipboard!
              </div>
            )}
            {error && <div className="text-red-400 text-sm font-medium mt-2">{error}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentInfo;
