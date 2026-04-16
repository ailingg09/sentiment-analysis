import { useState, useRef, useEffect } from "react";

const ISSUE_TYPES = [
  { key: "connection",   label: "Connection",         color: "#3b82f6" },
  { key: "performance",  label: "Performance",         color: "#f97316" },
  { key: "payment",      label: "Payment",             color: "#a855f7" },
  { key: "subscription", label: "Subscription",        color: "#6366f1" },
  { key: "feature",      label: "Feature",             color: "#14b8a6" },
  { key: "referral",     label: "Referral/Redemption", color: "#eab308" },
  { key: "political",    label: "Political Sensitive",  color: "#f59e0b" },
  { key: "violence",     label: "Violence",             color: "#ef4444" },
  { key: "adult",        label: "Pornography",          color: "#ec4899" },
  { key: "general",      label: "General",              color: "#94a3b8" },
];

const SENTIMENT_OPTIONS = ["POSITIVE", "NEUTRAL", "NEGATIVE"];
const STATUS_OPTIONS = ["All", "AI Replied", "AI Unreplied", "Replied", "Unreplied", "Closed", "Cancelled"];

const SENTIMENT_COLORS = {
  POSITIVE: { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500" },
  NEUTRAL:  { bg: "bg-gray-100",  text: "text-gray-600",  dot: "bg-gray-400"  },
  NEGATIVE: { bg: "bg-red-100",   text: "text-red-600",   dot: "bg-red-500"   },
};

const ISSUE_TAG_COLORS = {
  connection:   "bg-blue-100 text-blue-700",
  performance:  "bg-orange-100 text-orange-700",
  payment:      "bg-purple-100 text-purple-700",
  subscription: "bg-indigo-100 text-indigo-700",
  feature:      "bg-teal-100 text-teal-700",
  referral:     "bg-yellow-100 text-yellow-700",
  political:    "bg-amber-100 text-amber-700",
  violence:     "bg-red-100 text-red-700",
  adult:        "bg-pink-100 text-pink-700",
  general:      "bg-gray-100 text-gray-600",
};

const ALL_TICKETS = [
  // 2026-02-01
  { title: "VPN drops connection every 10 minutes",          status: "Unreplied",    role: "FREE",  device: "PC",     os: "Windows", contact: "User_3011", issue: "connection",   sentiment: "NEGATIVE", time: "2026-02-01 08:12:00", date: "2026-02-01" },
  { title: "Charged twice for same subscription",            status: "Replied",      role: "VIP",   device: "Mobile", os: "iOS",     contact: "User_4422", issue: "payment",      sentiment: "NEGATIVE", time: "2026-02-01 09:30:00", date: "2026-02-01" },
  { title: "How do I cancel my plan?",                       status: "Replied",      role: "FREE",  device: "PC",     os: "MacOS",   contact: "User_5503", issue: "subscription", sentiment: "NEUTRAL",  time: "2026-02-01 11:15:00", date: "2026-02-01" },
  { title: "Split tunneling crashes the app",                status: "Unreplied",    role: "VIP",   device: "Mobile", os: "Android", contact: "User_6614", issue: "feature",      sentiment: "NEGATIVE", time: "2026-02-01 13:20:00", date: "2026-02-01" },
  { title: "Really happy with service so far!",              status: "Closed",       role: "SVIP",  device: "PC",     os: "MacOS",   contact: "User_7721", issue: "general",      sentiment: "POSITIVE", time: "2026-02-01 15:00:00", date: "2026-02-01" },

  // 2026-02-02
  { title: "Cannot access US Netflix via US server",         status: "Unreplied",    role: "FREE",  device: "PC",     os: "Windows", contact: "User_8831", issue: "connection",   sentiment: "NEGATIVE", time: "2026-02-02 09:00:00", date: "2026-02-02" },
  { title: "App performance is blazing fast now",            status: "AI Replied",   role: "VIP",   device: "Mobile", os: "iOS",     contact: "User_9941", issue: "performance",  sentiment: "POSITIVE", time: "2026-02-02 10:45:00", date: "2026-02-02" },
  { title: "My referral bonus was not credited",             status: "Replied",      role: "FREE",  device: "Mobile", os: "Android", contact: "User_1102", issue: "referral",     sentiment: "NEGATIVE", time: "2026-02-02 12:30:00", date: "2026-02-02" },
  { title: "What devices can I use simultaneously?",         status: "Replied",      role: "FREE",  device: "PC",     os: "MacOS",   contact: "User_2213", issue: "subscription", sentiment: "NEUTRAL",  time: "2026-02-02 14:10:00", date: "2026-02-02" },
  { title: "Ad block not working on Chrome",                 status: "Unreplied",    role: "VIP",   device: "PC",     os: "Windows", contact: "User_3324", issue: "feature",      sentiment: "NEGATIVE", time: "2026-02-02 16:00:00", date: "2026-02-02" },
  { title: "Threatening message to support",                 status: "Cancelled",    role: "FREE",  device: "Mobile", os: "Android", contact: "User_4435", issue: "violence",     sentiment: "NEGATIVE", time: "2026-02-02 17:20:00", date: "2026-02-02" },

  // 2026-02-03
  { title: "Server list is not loading",                     status: "Unreplied",    role: "FREE",  device: "Mobile", os: "iOS",     contact: "User_5546", issue: "connection",   sentiment: "NEGATIVE", time: "2026-02-03 08:40:00", date: "2026-02-03" },
  { title: "Download speeds are excellent",                  status: "AI Replied",   role: "SVIP",  device: "PC",     os: "MacOS",   contact: "User_6657", issue: "performance",  sentiment: "POSITIVE", time: "2026-02-03 10:00:00", date: "2026-02-03" },
  { title: "Payment page gives 404 error",                   status: "Unreplied",    role: "FREE",  device: "PC",     os: "Windows", contact: "User_7768", issue: "payment",      sentiment: "NEGATIVE", time: "2026-02-03 12:20:00", date: "2026-02-03" },
  { title: "VPN blocks my banking app",                      status: "Replied",      role: "VIP",   device: "Mobile", os: "iOS",     contact: "User_8879", issue: "feature",      sentiment: "NEGATIVE", time: "2026-02-03 14:45:00", date: "2026-02-03" },
  { title: "How do I set up on Linux?",                      status: "Replied",      role: "FREE",  device: "PC",     os: "Linux",   contact: "User_9980", issue: "general",      sentiment: "NEUTRAL",  time: "2026-02-03 16:00:00", date: "2026-02-03" },

  // 2026-02-04
  { title: "Auto-connect not triggering on startup",         status: "Unreplied",    role: "VIP",   device: "PC",     os: "Windows", contact: "User_1011", issue: "feature",      sentiment: "NEGATIVE", time: "2026-02-04 09:10:00", date: "2026-02-04" },
  { title: "Subscription upgraded but still shows FREE",     status: "Unreplied",    role: "FREE",  device: "Mobile", os: "Android", contact: "User_2122", issue: "subscription", sentiment: "NEGATIVE", time: "2026-02-04 11:00:00", date: "2026-02-04" },
  { title: "Great speeds on JP server!",                     status: "Closed",       role: "SVIP",  device: "PC",     os: "MacOS",   contact: "User_3233", issue: "performance",  sentiment: "POSITIVE", time: "2026-02-04 13:30:00", date: "2026-02-04" },
  { title: "Referral code expired before I used it",         status: "Replied",      role: "FREE",  device: "Mobile", os: "iOS",     contact: "User_4344", issue: "referral",     sentiment: "NEGATIVE", time: "2026-02-04 15:00:00", date: "2026-02-04" },

  // 2026-02-05
  { title: "Connection timeout on SG server",                status: "Unreplied",    role: "FREE",  device: "PC",     os: "Windows", contact: "User_5455", issue: "connection",   sentiment: "NEGATIVE", time: "2026-02-05 08:55:00", date: "2026-02-05" },
  { title: "Kill switch not working on Mac",                 status: "Unreplied",    role: "VIP",   device: "PC",     os: "MacOS",   contact: "User_6566", issue: "feature",      sentiment: "NEGATIVE", time: "2026-02-05 10:40:00", date: "2026-02-05" },
  { title: "Invoice not sent after payment",                 status: "Replied",      role: "FREE",  device: "Mobile", os: "Android", contact: "User_7677", issue: "payment",      sentiment: "NEUTRAL",  time: "2026-02-05 12:30:00", date: "2026-02-05" },
  { title: "I love how easy the UI is",                      status: "AI Replied",   role: "FREE",  device: "Mobile", os: "iOS",     contact: "User_8788", issue: "general",      sentiment: "POSITIVE", time: "2026-02-05 14:20:00", date: "2026-02-05" },
  { title: "How to access geo-blocked content?",             status: "Replied",      role: "FREE",  device: "PC",     os: "Windows", contact: "User_9899", issue: "political",    sentiment: "NEUTRAL",  time: "2026-02-05 16:10:00", date: "2026-02-05" },
  { title: "Violent complaint about support team",           status: "Cancelled",    role: "FREE",  device: "Mobile", os: "Android", contact: "User_1000", issue: "violence",     sentiment: "NEGATIVE", time: "2026-02-05 17:50:00", date: "2026-02-05" },

  // 2026-02-06
  { title: "UK server extremely slow",                       status: "Unreplied",    role: "FREE",  device: "PC",     os: "Windows", contact: "User_1110", issue: "performance",  sentiment: "NEGATIVE", time: "2026-02-06 09:00:00", date: "2026-02-06" },
  { title: "Discount code not working at checkout",          status: "Replied",      role: "FREE",  device: "Mobile", os: "iOS",     contact: "User_2221", issue: "payment",      sentiment: "NEGATIVE", time: "2026-02-06 11:10:00", date: "2026-02-06" },
  { title: "When will Linux client be updated?",             status: "AI Unreplied", role: "FREE",  device: "PC",     os: "Linux",   contact: "User_3332", issue: "general",      sentiment: "NEUTRAL",  time: "2026-02-06 13:20:00", date: "2026-02-06" },
  { title: "Can you bypass government censorship?",          status: "Replied",      role: "FREE",  device: "Mobile", os: "Android", contact: "User_4443", issue: "political",    sentiment: "NEUTRAL",  time: "2026-02-06 15:00:00", date: "2026-02-06" },

  // 2026-02-07
  { title: "App crashes on startup after update",            status: "Unreplied",    role: "FREE",  device: "Mobile", os: "Android", contact: "User_5554", issue: "connection",   sentiment: "NEGATIVE", time: "2026-02-07 08:30:00", date: "2026-02-07" },
  { title: "Speed is fantastic on SVIP plan",               status: "Replied",      role: "SVIP",  device: "PC",     os: "MacOS",   contact: "User_6665", issue: "performance",  sentiment: "POSITIVE", time: "2026-02-07 10:00:00", date: "2026-02-07" },
  { title: "Upgrade to VIP not reflecting",                  status: "Unreplied",    role: "FREE",  device: "PC",     os: "Windows", contact: "User_7776", issue: "subscription", sentiment: "NEGATIVE", time: "2026-02-07 12:40:00", date: "2026-02-07" },
  { title: "My friend's referral code says already used",    status: "Replied",      role: "FREE",  device: "Mobile", os: "iOS",     contact: "User_8887", issue: "referral",     sentiment: "NEGATIVE", time: "2026-02-07 14:50:00", date: "2026-02-07" },

  // 2026-02-08
  { title: "VPN disconnects when switching WiFi",            status: "Unreplied",    role: "VIP",   device: "Mobile", os: "iOS",     contact: "User_9998", issue: "connection",   sentiment: "NEGATIVE", time: "2026-02-08 09:20:00", date: "2026-02-08" },
  { title: "Streaming 4K without buffering — love it!",      status: "AI Replied",   role: "SVIP",  device: "PC",     os: "MacOS",   contact: "User_1113", issue: "performance",  sentiment: "POSITIVE", time: "2026-02-08 11:00:00", date: "2026-02-08" },
  { title: "Accidentally subscribed to wrong plan",          status: "Replied",      role: "FREE",  device: "Mobile", os: "Android", contact: "User_2224", issue: "subscription", sentiment: "NEGATIVE", time: "2026-02-08 13:30:00", date: "2026-02-08" },
  { title: "Dark web monitoring feature request",            status: "AI Unreplied", role: "FREE",  device: "PC",     os: "Windows", contact: "User_3335", issue: "feature",      sentiment: "NEUTRAL",  time: "2026-02-08 15:00:00", date: "2026-02-08" },
  { title: "Payment declined after 3 attempts",              status: "Unreplied",    role: "FREE",  device: "Mobile", os: "iOS",     contact: "User_4446", issue: "payment",      sentiment: "NEGATIVE", time: "2026-02-08 17:00:00", date: "2026-02-08" },

  // 2026-02-09
  { title: "DNS leak detected on server",                    status: "Unreplied",    role: "VIP",   device: "PC",     os: "Windows", contact: "User_5557", issue: "feature",      sentiment: "NEGATIVE", time: "2026-02-09 08:10:00", date: "2026-02-09" },
  { title: "Pricing page does not load on mobile",           status: "Replied",      role: "FREE",  device: "Mobile", os: "Android", contact: "User_6668", issue: "subscription", sentiment: "NEUTRAL",  time: "2026-02-09 10:30:00", date: "2026-02-09" },
  { title: "Very supportive customer team!",                 status: "Closed",       role: "SVIP",  device: "PC",     os: "MacOS",   contact: "User_7779", issue: "general",      sentiment: "POSITIVE", time: "2026-02-09 12:00:00", date: "2026-02-09" },
  { title: "Asking for access to adult sites",               status: "Cancelled",    role: "FREE",  device: "Mobile", os: "iOS",     contact: "User_8880", issue: "adult",        sentiment: "NEUTRAL",  time: "2026-02-09 14:10:00", date: "2026-02-09" },

  // 2026-02-10
  { title: "Connection hangs on EU servers",                 status: "Unreplied",    role: "FREE",  device: "PC",     os: "Windows", contact: "User_9991", issue: "connection",   sentiment: "NEGATIVE", time: "2026-02-10 08:50:00", date: "2026-02-10" },
  { title: "Upload speed is very poor",                      status: "Replied",      role: "VIP",   device: "Mobile", os: "Android", contact: "User_1114", issue: "performance",  sentiment: "NEGATIVE", time: "2026-02-10 10:40:00", date: "2026-02-10" },
  { title: "How to get refund for unused months?",           status: "Replied",      role: "FREE",  device: "PC",     os: "MacOS",   contact: "User_2225", issue: "payment",      sentiment: "NEUTRAL",  time: "2026-02-10 13:00:00", date: "2026-02-10" },
  { title: "Team plan features question",                    status: "AI Unreplied", role: "VIP",   device: "PC",     os: "Windows", contact: "User_3336", issue: "subscription", sentiment: "NEUTRAL",  time: "2026-02-10 15:30:00", date: "2026-02-10" },
  { title: "Threatening message sent to agent",              status: "Cancelled",    role: "FREE",  device: "Mobile", os: "iOS",     contact: "User_4447", issue: "violence",     sentiment: "NEGATIVE", time: "2026-02-10 17:20:00", date: "2026-02-10" },

  // 2026-02-11
  { title: "Cannot reconnect after sleep mode",             status: "Unreplied",    role: "FREE",  device: "PC",     os: "MacOS",   contact: "User_5558", issue: "connection",   sentiment: "NEGATIVE", time: "2026-02-11 09:00:00", date: "2026-02-11" },
  { title: "SVIP plan worth every penny",                    status: "Closed",       role: "SVIP",  device: "PC",     os: "Windows", contact: "User_6669", issue: "general",      sentiment: "POSITIVE", time: "2026-02-11 11:20:00", date: "2026-02-11" },
  { title: "Promo code applied but no discount shown",       status: "Replied",      role: "FREE",  device: "Mobile", os: "Android", contact: "User_7770", issue: "payment",      sentiment: "NEGATIVE", time: "2026-02-11 13:40:00", date: "2026-02-11" },

  // 2026-02-12
  { title: "Server list not refreshing",                     status: "AI Unreplied", role: "FREE",  device: "Mobile", os: "iOS",     contact: "User_8881", issue: "connection",   sentiment: "NEGATIVE", time: "2026-02-12 08:30:00", date: "2026-02-12" },
  { title: "Obfuscation mode feature request",               status: "AI Unreplied", role: "VIP",   device: "PC",     os: "Linux",   contact: "User_9992", issue: "feature",      sentiment: "NEUTRAL",  time: "2026-02-12 10:50:00", date: "2026-02-12" },
  { title: "Really appreciate the quick replies",            status: "Closed",       role: "SVIP",  device: "PC",     os: "MacOS",   contact: "User_1115", issue: "general",      sentiment: "POSITIVE", time: "2026-02-12 13:00:00", date: "2026-02-12" },
  { title: "Referral cashback not received",                 status: "Unreplied",    role: "FREE",  device: "Mobile", os: "Android", contact: "User_2226", issue: "referral",     sentiment: "NEGATIVE", time: "2026-02-12 15:10:00", date: "2026-02-12" },
  { title: "Can I access political news sites?",             status: "Replied",      role: "FREE",  device: "Mobile", os: "iOS",     contact: "User_3337", issue: "political",    sentiment: "NEUTRAL",  time: "2026-02-12 17:00:00", date: "2026-02-12" },

  // 2026-02-13
  { title: "App battery drain is excessive",                 status: "Unreplied",    role: "VIP",   device: "Mobile", os: "Android", contact: "User_4448", issue: "performance",  sentiment: "NEGATIVE", time: "2026-02-13 09:10:00", date: "2026-02-13" },
  { title: "Subscription renewal failed silently",           status: "Replied",      role: "FREE",  device: "PC",     os: "Windows", contact: "User_5559", issue: "subscription", sentiment: "NEGATIVE", time: "2026-02-13 11:30:00", date: "2026-02-13" },
  { title: "Asking for links to adult content",              status: "Cancelled",    role: "FREE",  device: "Mobile", os: "iOS",     contact: "User_6660", issue: "adult",        sentiment: "NEUTRAL",  time: "2026-02-13 13:00:00", date: "2026-02-13" },

  // 2026-02-14
  { title: "Happy Valentine's Day — great VPN service!",    status: "Closed",       role: "SVIP",  device: "PC",     os: "MacOS",   contact: "User_7771", issue: "general",      sentiment: "POSITIVE", time: "2026-02-14 09:00:00", date: "2026-02-14" },
  { title: "Double charged on Feb 14",                       status: "Unreplied",    role: "FREE",  device: "Mobile", os: "Android", contact: "User_8882", issue: "payment",      sentiment: "NEGATIVE", time: "2026-02-14 11:20:00", date: "2026-02-14" },
  { title: "VPN lagging on video calls",                     status: "Unreplied",    role: "VIP",   device: "PC",     os: "Windows", contact: "User_9993", issue: "performance",  sentiment: "NEGATIVE", time: "2026-02-14 13:40:00", date: "2026-02-14" },
  { title: "How do I switch between plans?",                 status: "Replied",      role: "FREE",  device: "Mobile", os: "iOS",     contact: "User_1116", issue: "subscription", sentiment: "NEUTRAL",  time: "2026-02-14 15:00:00", date: "2026-02-14" },

  // 2026-02-15
  { title: "Cannot connect to any Asia servers",             status: "Unreplied",    role: "FREE",  device: "PC",     os: "Windows", contact: "User_2227", issue: "connection",   sentiment: "NEGATIVE", time: "2026-02-15 08:40:00", date: "2026-02-15" },
  { title: "Excellent uptime for last 30 days",              status: "AI Replied",   role: "SVIP",  device: "PC",     os: "MacOS",   contact: "User_3338", issue: "performance",  sentiment: "POSITIVE", time: "2026-02-15 10:00:00", date: "2026-02-15" },
  { title: "Referral system is confusing",                   status: "Replied",      role: "FREE",  device: "Mobile", os: "Android", contact: "User_4449", issue: "referral",     sentiment: "NEUTRAL",  time: "2026-02-15 12:20:00", date: "2026-02-15" },
  { title: "Multi-hop feature not working",                  status: "Unreplied",    role: "VIP",   device: "PC",     os: "Linux",   contact: "User_5550", issue: "feature",      sentiment: "NEGATIVE", time: "2026-02-15 14:30:00", date: "2026-02-15" },

  // 2026-02-16
  { title: "IKEv2 protocol keeps disconnecting",             status: "Unreplied",    role: "VIP",   device: "PC",     os: "Windows", contact: "User_6661", issue: "connection",   sentiment: "NEGATIVE", time: "2026-02-16 09:30:00", date: "2026-02-16" },
  { title: "Payment receipt missing from email",             status: "Replied",      role: "FREE",  device: "Mobile", os: "iOS",     contact: "User_7772", issue: "payment",      sentiment: "NEUTRAL",  time: "2026-02-16 11:10:00", date: "2026-02-16" },
  { title: "Government site blocked, need help",             status: "Replied",      role: "FREE",  device: "PC",     os: "MacOS",   contact: "User_8883", issue: "political",    sentiment: "NEUTRAL",  time: "2026-02-16 13:30:00", date: "2026-02-16" },
  { title: "Best VPN I've tried in years",                   status: "Closed",       role: "SVIP",  device: "PC",     os: "Windows", contact: "User_9994", issue: "general",      sentiment: "POSITIVE", time: "2026-02-16 15:50:00", date: "2026-02-16" },

  // 2026-02-17
  { title: "App freezes when choosing server",               status: "Unreplied",    role: "FREE",  device: "Mobile", os: "Android", contact: "User_1117", issue: "performance",  sentiment: "NEGATIVE", time: "2026-02-17 08:00:00", date: "2026-02-17" },
  { title: "Plan expired, how to renew?",                    status: "AI Unreplied", role: "FREE",  device: "Mobile", os: "iOS",     contact: "User_2228", issue: "subscription", sentiment: "NEUTRAL",  time: "2026-02-17 10:20:00", date: "2026-02-17" },
  { title: "My redemption code invalid again",               status: "Unreplied",    role: "FREE",  device: "PC",     os: "Windows", contact: "User_3339", issue: "referral",     sentiment: "NEGATIVE", time: "2026-02-17 12:50:00", date: "2026-02-17" },

  // 2026-02-18
  { title: "WireGuard protocol slower than OpenVPN",         status: "Replied",      role: "VIP",   device: "PC",     os: "MacOS",   contact: "User_4440", issue: "performance",  sentiment: "NEUTRAL",  time: "2026-02-18 09:20:00", date: "2026-02-18" },
  { title: "App won't install on Windows 11",                status: "Unreplied",    role: "FREE",  device: "PC",     os: "Windows", contact: "User_5551", issue: "connection",   sentiment: "NEGATIVE", time: "2026-02-18 11:40:00", date: "2026-02-18" },
  { title: "Requesting to view inappropriate content",       status: "Cancelled",    role: "FREE",  device: "Mobile", os: "Android", contact: "User_6662", issue: "adult",        sentiment: "NEUTRAL",  time: "2026-02-18 13:00:00", date: "2026-02-18" },
  { title: "Feature request: widgets for iOS",               status: "AI Unreplied", role: "FREE",  device: "Mobile", os: "iOS",     contact: "User_7773", issue: "feature",      sentiment: "POSITIVE", time: "2026-02-18 15:30:00", date: "2026-02-18" },
  { title: "Payment form says session expired",              status: "Unreplied",    role: "FREE",  device: "PC",     os: "Windows", contact: "User_8884", issue: "payment",      sentiment: "NEGATIVE", time: "2026-02-18 17:00:00", date: "2026-02-18" },

  // 2026-02-19
  { title: "Speed is inconsistent during peak hours",        status: "Replied",      role: "VIP",   device: "PC",     os: "Windows", contact: "User_9995", issue: "performance",  sentiment: "NEGATIVE", time: "2026-02-19 09:00:00", date: "2026-02-19" },
  { title: "Cannot find router setup guide",                 status: "AI Unreplied", role: "FREE",  device: "PC",     os: "Linux",   contact: "User_1118", issue: "general",      sentiment: "NEUTRAL",  time: "2026-02-19 11:30:00", date: "2026-02-19" },
  { title: "Awesome service, renewed for 2 years",           status: "Closed",       role: "SVIP",  device: "PC",     os: "MacOS",   contact: "User_2229", issue: "general",      sentiment: "POSITIVE", time: "2026-02-19 14:00:00", date: "2026-02-19" },

  // 2026-02-20
  { title: "Cannot connect to any server after reset",       status: "Unreplied",    role: "FREE",  device: "Mobile", os: "iOS",     contact: "User_3330", issue: "connection",   sentiment: "NEGATIVE", time: "2026-02-20 08:30:00", date: "2026-02-20" },
  { title: "Subscription page keeps timing out",             status: "Unreplied",    role: "FREE",  device: "PC",     os: "Windows", contact: "User_4441", issue: "subscription", sentiment: "NEGATIVE", time: "2026-02-20 10:50:00", date: "2026-02-20" },
  { title: "VPN blocked political commentary site",          status: "Replied",      role: "FREE",  device: "Mobile", os: "Android", contact: "User_5552", issue: "political",    sentiment: "NEUTRAL",  time: "2026-02-20 13:00:00", date: "2026-02-20" },
  { title: "Referral reward applied successfully, thanks!",  status: "Closed",       role: "VIP",   device: "PC",     os: "MacOS",   contact: "User_6663", issue: "referral",     sentiment: "POSITIVE", time: "2026-02-20 15:10:00", date: "2026-02-20" },

  // 2026-02-21
  { title: "IP leaking outside tunnel",                      status: "Unreplied",    role: "VIP",   device: "PC",     os: "Windows", contact: "User_7774", issue: "feature",      sentiment: "NEGATIVE", time: "2026-02-21 09:40:00", date: "2026-02-21" },
  { title: "Charged for plan I didn't select",               status: "Replied",      role: "FREE",  device: "Mobile", os: "iOS",     contact: "User_8885", issue: "payment",      sentiment: "NEGATIVE", time: "2026-02-21 11:20:00", date: "2026-02-21" },
  { title: "Best performance I've seen on Android",          status: "AI Replied",   role: "SVIP",  device: "Mobile", os: "Android", contact: "User_9996", issue: "performance",  sentiment: "POSITIVE", time: "2026-02-21 13:00:00", date: "2026-02-21" },

  // 2026-02-22
  { title: "Outgoing connections blocked by VPN",            status: "Unreplied",    role: "FREE",  device: "PC",     os: "MacOS",   contact: "User_1119", issue: "connection",   sentiment: "NEGATIVE", time: "2026-02-22 08:00:00", date: "2026-02-22" },
  { title: "Account got suspended without warning",          status: "Replied",      role: "FREE",  device: "Mobile", os: "Android", contact: "User_2220", issue: "subscription", sentiment: "NEGATIVE", time: "2026-02-22 10:30:00", date: "2026-02-22" },
  { title: "Support is super responsive",                    status: "Closed",       role: "VIP",   device: "PC",     os: "Windows", contact: "User_3331", issue: "general",      sentiment: "POSITIVE", time: "2026-02-22 12:50:00", date: "2026-02-22" },
  { title: "Requesting adult content bypass",                status: "Cancelled",    role: "FREE",  device: "Mobile", os: "iOS",     contact: "User_4442", issue: "adult",        sentiment: "NEUTRAL",  time: "2026-02-22 14:00:00", date: "2026-02-22" },
  { title: "Ping is unusually high on NL server",            status: "Unreplied",    role: "VIP",   device: "PC",     os: "Linux",   contact: "User_5553", issue: "performance",  sentiment: "NEGATIVE", time: "2026-02-22 16:10:00", date: "2026-02-22" },

  // 2026-02-23
  { title: "Charged but membership not activated",           status: "Closed",       role: "FREE",  device: "PC",     os: "Windows", contact: "User_3320", issue: "payment",      sentiment: "NEGATIVE", time: "2026-02-23 18:44:10", date: "2026-02-23" },
  { title: "Split tunneling not working properly",           status: "Cancelled",    role: "VIP",   device: "Mobile", os: "iOS",     contact: "User_5541", issue: "feature",      sentiment: "NEGATIVE", time: "2026-02-23 10:21:05", date: "2026-02-23" },
  { title: "Speed is slow after switching to WireGuard",     status: "Unreplied",    role: "FREE",  device: "PC",     os: "Windows", contact: "User_6671", issue: "performance",  sentiment: "NEGATIVE", time: "2026-02-23 12:00:00", date: "2026-02-23" },
  { title: "Renewal reminder came too late",                 status: "Replied",      role: "FREE",  device: "Mobile", os: "Android", contact: "User_7782", issue: "subscription", sentiment: "NEUTRAL",  time: "2026-02-23 14:30:00", date: "2026-02-23" },

  // 2026-02-24
  { title: "How to access blocked news websites?",           status: "Unreplied",    role: "FREE",  device: "Mobile", os: "Android", contact: "User_8843", issue: "political",    sentiment: "NEUTRAL",  time: "2026-02-24 09:05:40", date: "2026-02-24" },
  { title: "Threatening support staff over refund",          status: "Unreplied",    role: "FREE",  device: "Mobile", os: "Android", contact: "User_1192", issue: "violence",     sentiment: "NEGATIVE", time: "2026-02-24 08:10:20", date: "2026-02-24" },
  { title: "Speed is fast, very happy with performance",     status: "AI Replied",   role: "VIP",   device: "PC",     os: "Windows", contact: "User_1147", issue: "performance",  sentiment: "POSITIVE", time: "2026-02-24 10:15:55", date: "2026-02-24" },
  { title: "Cannot connect to Japan server",                 status: "Unreplied",    role: "FREE",  device: "Mobile", os: "iOS",     contact: "User_3345", issue: "connection",   sentiment: "NEGATIVE", time: "2026-02-24 13:00:00", date: "2026-02-24" },

  // 2026-02-25
  { title: "Connection is super stable, very satisfied!",    status: "Replied",      role: "SVIP",  device: "PC",     os: "MacOS",   contact: "User_3381", issue: "connection",   sentiment: "POSITIVE", time: "2026-02-25 16:44:30", date: "2026-02-25" },
  { title: "First time using VPN, how do I start?",          status: "AI Unreplied", role: "FREE",  device: "Mobile", os: "iOS",     contact: "User_6629", issue: "general",      sentiment: "NEUTRAL",  time: "2026-02-25 13:22:18", date: "2026-02-25" },
  { title: "Payment failed last 3 times",                    status: "Unreplied",    role: "FREE",  device: "PC",     os: "Windows", contact: "User_7734", issue: "payment",      sentiment: "NEGATIVE", time: "2026-02-25 10:40:00", date: "2026-02-25" },

  // 2026-02-26
  { title: "Ad blocking not working on YouTube",             status: "Unreplied",    role: "VIP",   device: "PC",     os: "Windows", contact: "User_9934", issue: "feature",      sentiment: "NEGATIVE", time: "2026-02-26 09:33:45", date: "2026-02-26" },
  { title: "My referral code shows invalid",                 status: "Replied",      role: "FREE",  device: "Mobile", os: "Android", contact: "User_7712", issue: "referral",     sentiment: "NEGATIVE", time: "2026-02-26 08:20:11", date: "2026-02-26" },
  { title: "Servers in US are lagging a lot",                status: "Unreplied",    role: "FREE",  device: "PC",     os: "MacOS",   contact: "User_5523", issue: "performance",  sentiment: "NEGATIVE", time: "2026-02-26 14:50:00", date: "2026-02-26" },
  { title: "Requesting help circumventing censorship",       status: "Replied",      role: "FREE",  device: "Mobile", os: "iOS",     contact: "User_4432", issue: "political",    sentiment: "NEUTRAL",  time: "2026-02-26 16:10:00", date: "2026-02-26" },

  // 2026-02-27
  { title: "Payment failed but got charged twice",           status: "Replied",      role: "VIP",   device: "Mobile", os: "iOS",     contact: "User_2291", issue: "payment",      sentiment: "NEGATIVE", time: "2026-02-27 14:10:22", date: "2026-02-27" },
  { title: "How do I upgrade to SVIP plan?",                 status: "Replied",      role: "FREE",  device: "PC",     os: "Windows", contact: "User_5513", issue: "subscription", sentiment: "NEUTRAL",  time: "2026-02-27 11:05:10", date: "2026-02-27" },
  { title: "What is the difference between VIP and SVIP?",  status: "Replied",      role: "FREE",  device: "PC",     os: "MacOS",   contact: "User_6612", issue: "subscription", sentiment: "NEUTRAL",  time: "2026-02-27 15:30:10", date: "2026-02-27" },
  { title: "Connection drops on Mac after 1 hour",           status: "Unreplied",    role: "VIP",   device: "PC",     os: "MacOS",   contact: "User_8821", issue: "connection",   sentiment: "NEGATIVE", time: "2026-02-27 17:00:00", date: "2026-02-27" },
  { title: "Requesting violent content access",              status: "Cancelled",    role: "FREE",  device: "Mobile", os: "Android", contact: "User_2231", issue: "violence",     sentiment: "NEGATIVE", time: "2026-02-27 18:30:00", date: "2026-02-27" },

  // 2026-02-28
  { title: "The speed is so slow after update",              status: "Unreplied",    role: "FREE",  device: "PC",     os: "MacOS",   contact: "User_8821", issue: "performance",  sentiment: "NEGATIVE", time: "2026-02-28 22:55:53", date: "2026-02-28" },
  { title: "Cannot connect to US server at all",             status: "Unreplied",    role: "FREE",  device: "Mobile", os: "Android", contact: "User_4432", issue: "connection",   sentiment: "NEGATIVE", time: "2026-02-28 17:29:30", date: "2026-02-28" },
  { title: "App UI is intuitive and clean",                  status: "AI Replied",   role: "SVIP",  device: "Mobile", os: "iOS",     contact: "User_1133", issue: "general",      sentiment: "POSITIVE", time: "2026-02-28 10:00:00", date: "2026-02-28" },
  { title: "Referral system needs improvement",              status: "AI Unreplied", role: "FREE",  device: "PC",     os: "Windows", contact: "User_3342", issue: "referral",     sentiment: "NEUTRAL",  time: "2026-02-28 13:20:00", date: "2026-02-28" },

  // 2026-03-01
  { title: "App crashes on Android after update",            status: "Unreplied",    role: "FREE",  device: "Mobile", os: "Android", contact: "User_5567", issue: "connection",   sentiment: "NEGATIVE", time: "2026-03-01 09:10:00", date: "2026-03-01" },
  { title: "Speed improved after changing protocol",         status: "AI Replied",   role: "VIP",   device: "PC",     os: "Windows", contact: "User_6678", issue: "performance",  sentiment: "POSITIVE", time: "2026-03-01 11:20:00", date: "2026-03-01" },
  { title: "Payment declined without reason",                status: "Unreplied",    role: "FREE",  device: "Mobile", os: "iOS",     contact: "User_7789", issue: "payment",      sentiment: "NEGATIVE", time: "2026-03-01 13:40:00", date: "2026-03-01" },
  { title: "Feature to whitelist apps needed",               status: "AI Unreplied", role: "VIP",   device: "PC",     os: "MacOS",   contact: "User_8890", issue: "feature",      sentiment: "NEUTRAL",  time: "2026-03-01 15:00:00", date: "2026-03-01" },
  { title: "How many devices allowed on VIP?",               status: "Replied",      role: "FREE",  device: "Mobile", os: "Android", contact: "User_9901", issue: "subscription", sentiment: "NEUTRAL",  time: "2026-03-01 17:10:00", date: "2026-03-01" },
];

const TODAY = new Date();
const fmt = d => d.toISOString().split("T")[0];
const addDays = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };

const PRESETS = [
  { label: "Today",        from: () => fmt(TODAY), to: () => fmt(TODAY) },
  { label: "Yesterday",    from: () => fmt(addDays(TODAY,-1)), to: () => fmt(addDays(TODAY,-1)) },
  { label: "This Week",    from: () => { const d=new Date(TODAY); d.setDate(d.getDate()-d.getDay()); return fmt(d); }, to: () => fmt(TODAY) },
  { label: "Last Week",    from: () => { const d=new Date(TODAY); d.setDate(d.getDate()-d.getDay()-7); return fmt(d); }, to: () => { const d=new Date(TODAY); d.setDate(d.getDate()-d.getDay()-1); return fmt(d); } },
  { label: "This Month",   from: () => fmt(new Date(TODAY.getFullYear(),TODAY.getMonth(),1)), to: () => fmt(TODAY) },
  { label: "Last Month",   from: () => fmt(new Date(TODAY.getFullYear(),TODAY.getMonth()-1,1)), to: () => fmt(new Date(TODAY.getFullYear(),TODAY.getMonth(),0)) },
  { label: "Last 10 Days", from: () => fmt(addDays(TODAY,-10)), to: () => fmt(TODAY) },
  { label: "Last 30 Days", from: () => fmt(addDays(TODAY,-30)), to: () => fmt(TODAY) },
  { label: "Last 60 Days", from: () => fmt(addDays(TODAY,-60)), to: () => fmt(TODAY) },
  { label: "Last 90 Days", from: () => fmt(addDays(TODAY,-90)), to: () => fmt(TODAY) },
];

function CalendarPicker({ dateFrom, dateTo, onChange, onClose }) {
  const today = new Date();
  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [hovered,   setHovered]   = useState(null);
  const [activePreset, setActivePreset] = useState("Last 30 Days");

  const daysInMonth = (y,m) => new Date(y,m+1,0).getDate();
  const firstDay    = (y,m) => new Date(y,m,1).getDay();
  const leftYear  = viewMonth===0 ? viewYear-1 : viewYear;
  const leftMonth = viewMonth===0 ? 11 : viewMonth-1;

  const isSel      = d => d===dateFrom||d===dateTo;
  const inRange    = d => dateFrom&&dateTo&&d>dateFrom&&d<dateTo;
  const isHovRange = d => dateFrom&&!dateTo&&hovered&&((d>dateFrom&&d<=hovered)||(d<dateFrom&&d>=hovered));

  const handleDay = d => {
    setActivePreset(null);
    if(!dateFrom||(dateFrom&&dateTo)) onChange(d,"");
    else { if(d<dateFrom) onChange(d,dateFrom); else onChange(dateFrom,d); }
  };
  const applyPreset = p => { setActivePreset(p.label); onChange(p.from(),p.to()); };
  const prevMonth = () => { if(viewMonth===0){setViewYear(y=>y-1);setViewMonth(11);}else setViewMonth(m=>m-1); };
  const nextMonth = () => { if(viewMonth===11){setViewYear(y=>y+1);setViewMonth(0);}else setViewMonth(m=>m+1); };

  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  const renderMonth = (year, month) => {
    const days=daysInMonth(year,month), start=firstDay(year,month), cells=[];
    for(let i=0;i<start;i++) cells.push(null);
    for(let i=1;i<=days;i++) cells.push(fmt(new Date(year,month,i)));
    return (
      <div className="w-64">
        <div className="text-xs font-semibold text-gray-700 mb-2">{MONTHS[month].slice(0,3)} {year}</div>
        <div className="grid grid-cols-7 mb-1">
          {DAYS.map(d=><div key={d} className="text-center text-xs text-gray-400 py-1">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-y-0.5">
          {cells.map((d,i)=>{
            if(!d) return <div key={"e"+i}/>;
            const sel=isSel(d),inR=inRange(d),inHov=isHovRange(d),isFrom=d===dateFrom,isTo=d===dateTo;
            return (
              <div key={d}
                className={"flex items-center justify-center h-7 text-xs cursor-pointer select-none "+
                  (sel?"bg-blue-500 text-white rounded-full z-10 relative ":"")+
                  ((inR||inHov)&&!sel?"bg-blue-100 text-blue-700 ":"")+
                  (!sel&&!inR&&!inHov?"hover:bg-gray-100 rounded-full text-gray-700 ":"")+
                  (isFrom&&dateTo?"rounded-l-full rounded-r-none ":"")+
                  (isTo&&dateFrom?"rounded-r-full rounded-l-none ":"")+
                  ((inR||inHov)?"rounded-none ":"")}
                onClick={()=>handleDay(d)} onMouseEnter={()=>setHovered(d)} onMouseLeave={()=>setHovered(null)}>
                {parseInt(d.split("-")[2])}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="absolute top-8 left-0 z-30 bg-white border border-gray-200 rounded-xl shadow-xl flex" style={{minWidth:620}}>
      <div className="w-28 border-r border-gray-100 py-3 flex flex-col gap-0.5">
        {PRESETS.map(p=>(
          <button key={p.label} onClick={()=>applyPreset(p)}
            className={"text-left px-4 py-1.5 text-xs transition-colors "+(activePreset===p.label?"text-blue-500 font-medium":"text-gray-600 hover:bg-gray-50")}>
            {p.label}
          </button>
        ))}
      </div>
      <div className="p-4 flex flex-col gap-3">
        <div className="flex gap-2 items-center">
          <input type="text" readOnly value={dateFrom||""} placeholder="Start date" className="border border-gray-300 rounded-lg px-3 py-1.5 text-xs w-36 text-center focus:outline-none focus:border-blue-400"/>
          <span className="text-gray-400 text-xs">→</span>
          <input type="text" readOnly value={dateTo||""} placeholder="End date" className="border border-gray-300 rounded-lg px-3 py-1.5 text-xs w-36 text-center focus:outline-none focus:border-blue-400"/>
        </div>
        <div className="flex gap-4 items-start">
          <div>
            <div className="flex items-center mb-2"><button onClick={prevMonth} className="text-gray-400 hover:text-gray-600 px-1">◄</button><div className="flex-1"/></div>
            {renderMonth(leftYear,leftMonth)}
          </div>
          <div>
            <div className="flex items-center mb-2"><div className="flex-1"/><button onClick={nextMonth} className="text-gray-400 hover:text-gray-600 px-1">►</button></div>
            {renderMonth(viewYear,viewMonth)}
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-1">
          <button onClick={()=>{onChange("","");setActivePreset(null);}} className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50">Clear</button>
          <button onClick={onClose} className="px-3 py-1.5 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600">Apply</button>
        </div>
      </div>
    </div>
  );
}

function PieChart({ data, label="items" }) {
  const [tooltip, setTooltip] = useState(null);
  const svgRef = useRef(null);
  const size=120, cx=size/2, cy=size/2, r=50, innerR=28;
  const total = data.reduce((s,d)=>s+d.count,0);

  if(total===0) return <div className="text-xs text-gray-300 py-4">No data</div>;

  let cum = -Math.PI/2;
  const slices = data.map(d => {
    const angle=(d.count/total)*2*Math.PI, start=cum;
    cum+=angle;
    return {...d, startAngle:start, endAngle:cum, angle};
  });

  const pt = (a,rad) => ({x:cx+rad*Math.cos(a), y:cy+rad*Math.sin(a)});
  const arc = s => {
    const s1=pt(s.startAngle,r),e1=pt(s.endAngle,r),s2=pt(s.endAngle,innerR),e2=pt(s.startAngle,innerR),lg=s.angle>Math.PI?1:0;
    return `M${s1.x},${s1.y} A${r},${r} 0 ${lg} 1 ${e1.x},${e1.y} L${s2.x},${s2.y} A${innerR},${innerR} 0 ${lg} 0 ${e2.x},${e2.y} Z`;
  };

  const onMove = (e,slice) => {
    const rect=svgRef.current.getBoundingClientRect();
    setTooltip({x:e.clientX-rect.left, y:e.clientY-rect.top, slice});
  };

  return (
    <div className="relative flex items-center gap-4">
      <div className="relative flex-shrink-0" style={{width:size,height:size}}>
        <svg ref={svgRef} width={size} height={size}>
          {slices.map((s,i)=>(
            <path key={i} d={arc(s)} fill={s.color}
              opacity={tooltip?.slice?.label===s.label?1:0.82}
              style={{cursor:"pointer",transition:"opacity 0.15s"}}
              onMouseMove={e=>onMove(e,s)} onMouseLeave={()=>setTooltip(null)}/>
          ))}
          <text x={cx} y={cy-4} textAnchor="middle" style={{fontSize:9,fill:"#9ca3af"}}>Total</text>
          <text x={cx} y={cy+8} textAnchor="middle" style={{fontSize:13,fill:"#111827",fontWeight:700}}>{total}</text>
        </svg>
        {tooltip && (
          <div className="absolute z-20 bg-gray-900 text-white rounded-lg px-3 py-2.5 text-xs shadow-lg pointer-events-none"
            style={{left:tooltip.x+12, top:tooltip.y-14, minWidth:200}}>
            {tooltip.slice.isOthers ? (
              <div>
                <div className="font-semibold text-gray-300 mb-2">Others breakdown</div>
                <div className="flex flex-col gap-1.5">
                  {tooltip.slice.others.map((o,i)=>(
                    <div key={i} className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{background:o.color}}/>
                        <span className="truncate text-white">{o.label}</span>
                      </div>
                      <span className="text-gray-300 whitespace-nowrap flex-shrink-0">
                        {o.count} {label} ({Math.round(o.count/total*100)}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-1.5 font-semibold mb-1">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{background:tooltip.slice.color}}/>
                  {tooltip.slice.label}
                </div>
                <div className="text-gray-300">{tooltip.slice.count} {label} · {Math.round(tooltip.slice.count/total*100)}%</div>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1.5 min-w-0">
        {slices.map((s,i)=>(
          <div key={i} className="flex items-center gap-1.5 text-xs text-gray-600">
            <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{background:s.color}}/>
            <span className="truncate">{s.label}</span>
            <span className="text-gray-400 ml-auto pl-2 font-medium whitespace-nowrap">{Math.round(s.count/total*100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RefreshIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
    </svg>
  );
}

function useOutsideClick(ref, handler) {
  useEffect(() => {
    const fn = e => { if(ref.current&&!ref.current.contains(e.target)) handler(); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [ref, handler]);
}

export default function App() {
  const [activeIssues,      setActiveIssues]     = useState([]);
  const [activeSentiments,  setActiveSentiments] = useState([]);
  const [statusFilter,      setStatusFilter]      = useState("Unreplied");
  const [issueExpanded,     setIssueExpanded]     = useState(false);
  const [sentimentExpanded, setSentimentExpanded] = useState(false);
  const [statusExpanded,    setStatusExpanded]    = useState(false);
  const [calendarExpanded,  setCalendarExpanded]  = useState(false);
  const [searchId,          setSearchId]          = useState("");
  const [searchTitle,       setSearchTitle]       = useState("");
  const [searchContact,     setSearchContact]     = useState("");
  const [analysisLoaded,    setAnalysisLoaded]    = useState(false);
  const [dateFrom,          setDateFrom]          = useState(fmt(addDays(TODAY,-30)));
  const [dateTo,            setDateTo]            = useState(fmt(TODAY));
  const [refreshing,        setRefreshing]        = useState(false);

  const issueRef     = useRef(null);
  const sentimentRef = useRef(null);
  const statusRef    = useRef(null);
  const calendarRef  = useRef(null);

  useOutsideClick(issueRef,     () => setIssueExpanded(false));
  useOutsideClick(sentimentRef, () => setSentimentExpanded(false));
  useOutsideClick(statusRef,    () => setStatusExpanded(false));
  useOutsideClick(calendarRef,  () => setCalendarExpanded(false));

  useEffect(() => {
    const t = setTimeout(() => setAnalysisLoaded(true), 10000);
    return () => clearTimeout(t);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const toggleIssue     = k => setActiveIssues(p=>p.includes(k)?p.filter(x=>x!==k):[...p,k]);
  const toggleSentiment = k => setActiveSentiments(p=>p.includes(k)?p.filter(x=>x!==k):[...p,k]);

  const inDateRange = d => {
    if(!dateFrom&&!dateTo) return true;
    if(dateFrom&&d<dateFrom) return false;
    if(dateTo&&d>dateTo) return false;
    return true;
  };

  // All filters applied uniformly — used for BOTH table and visualization
  const filtered = ALL_TICKETS.filter(t => {
    const mD = inDateRange(t.date);
    const mS = statusFilter==="All" ? true : t.status===statusFilter;
    const mI = activeIssues.length===0 ? true : activeIssues.includes(t.issue);
    const mSe = activeSentiments.length===0 ? true : activeSentiments.includes(t.sentiment);
    const mId = searchId ? t.contact.toLowerCase().includes(searchId.toLowerCase()) : true;
    const mT  = searchTitle ? t.title.toLowerCase().includes(searchTitle.toLowerCase()) : true;
    const mC  = searchContact ? t.contact.toLowerCase().includes(searchContact.toLowerCase()) : true;
    return mD&&mS&&mI&&mSe&&mId&&mT&&mC;
  });

  // Date-only filtered for the issue filter count badges (independent of other filters)
  const dateFiltered = ALL_TICKETS.filter(t => inDateRange(t.date));

  const total    = filtered.length;
  const negCount = filtered.filter(t=>t.sentiment==="NEGATIVE").length;
  const posCount = filtered.filter(t=>t.sentiment==="POSITIVE").length;
  const neuCount = filtered.filter(t=>t.sentiment==="NEUTRAL").length;

  // Pie chart data derived from the fully-filtered set
  const pieData = (() => {
    const counts={};
    filtered.forEach(t=>{counts[t.issue]=(counts[t.issue]||0)+1;});
    const sorted=ISSUE_TYPES.map(it=>({...it,count:counts[it.key]||0})).filter(it=>it.count>0).sort((a,b)=>b.count-a.count);
    if(sorted.length<=4) return sorted;
    const top4=sorted.slice(0,4),rest=sorted.slice(4);
    return [...top4,{key:"others",label:"Others",color:"#cbd5e1",count:rest.reduce((s,r)=>s+r.count,0),isOthers:true,others:rest}];
  })();

  const issueFilterCounts = ISSUE_TYPES.map(it=>({key:it.key,label:it.label,count:dateFiltered.filter(t=>t.issue===it.key).length}));
  const clearAll = () => { setStatusFilter("All"); setActiveIssues([]); setActiveSentiments([]); };
  const hasActiveFilters = statusFilter!=="All"||activeIssues.length>0||activeSentiments.length>0;
  const hasDateFilter = dateFrom||dateTo;
  const calLabel = hasDateFilter?(dateFrom||"—")+"  →  "+(dateTo||"—"):"Select date range";

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-sm text-gray-700">

      {/* Top bar */}
      <div className="flex items-center gap-2 mb-4">
        <div className="relative" ref={calendarRef}>
          <button onClick={()=>setCalendarExpanded(v=>!v)}
            className={"flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs border transition-all bg-white "+
              (hasDateFilter?"border-blue-400 text-blue-500":"border-gray-300 text-gray-500 hover:bg-gray-50")}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span>{calLabel}</span>
          </button>
          {calendarExpanded && (
            <CalendarPicker dateFrom={dateFrom} dateTo={dateTo}
              onChange={(f,t)=>{setDateFrom(f);setDateTo(t);}}
              onClose={()=>setCalendarExpanded(false)}/>
          )}
        </div>
        <button onClick={handleRefresh}
          className="flex items-center justify-center w-7 h-7 rounded-lg border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all"
          title="Refresh">
          <span style={{display:"inline-block", animation:refreshing?"spin 0.8s linear":"none"}}>
            <RefreshIcon/>
          </span>
        </button>
        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      </div>

      {/* Combined Analytics Card — now reflects ALL active filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-6 py-5 mb-4">
        <div className="flex gap-8 items-center">
          <div className="flex-shrink-0">
            <div className="text-xs font-medium text-gray-500 mb-3">Issue Type Breakdown</div>
            {pieData.length>0?<PieChart data={pieData} label="tickets"/>:<div className="text-xs text-gray-300 py-4">No data</div>}
          </div>
          <div className="w-px self-stretch bg-gray-100"/>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-gray-500 mb-4">Sentiment Breakdown</div>
            <div className="flex flex-col gap-3">
              {[
                {label:"Negative",count:negCount,color:"bg-red-400",  text:"text-red-500",  track:"bg-red-50"  },
                {label:"Positive",count:posCount,color:"bg-green-400",text:"text-green-600",track:"bg-green-50"},
                {label:"Neutral", count:neuCount,color:"bg-gray-300", text:"text-gray-500", track:"bg-gray-50" },
              ].map(s=>{
                const pct=total?Math.round(s.count/total*100):0;
                return (
                  <div key={s.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600 font-medium">{s.label}</span>
                      <div className="flex items-center gap-2">
                        <span className={"text-xs font-bold "+s.text}>{pct}%</span>
                        <span className="text-xs text-gray-400">{s.count} tickets</span>
                      </div>
                    </div>
                    <div className={"w-full h-1.5 rounded-full "+s.track}>
                      <div className={"h-1.5 rounded-full "+s.color} style={{width:pct+"%",transition:"width 0.4s ease"}}/>
                    </div>
                  </div>
                );
              })}
              <div className="pt-2 mt-1 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-400">Matching Tickets</span>
                <span className="text-sm font-bold text-gray-800">{total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Panel */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">Ticket</h2>
          <div className="flex gap-2">
            <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50">⚙ Batch Operation</button>
            <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-900 text-white rounded-lg text-xs hover:bg-gray-700">✉ Ticket Quick Message</button>
            <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50">⛉ Columns</button>
          </div>
        </div>

        <div className="px-5 py-3 border-b border-gray-100 flex flex-wrap gap-2 items-center">
          <input value={searchId}      onChange={e=>setSearchId(e.target.value)}      placeholder="(Enter) Search by ID..."           className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs w-44 focus:outline-none focus:border-gray-400"/>
          <input value={searchTitle}   onChange={e=>setSearchTitle(e.target.value)}   placeholder="(Enter) Search by Title..."        className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs w-48 focus:outline-none focus:border-gray-400"/>
          <input value={searchContact} onChange={e=>setSearchContact(e.target.value)} placeholder="(Enter) Search by Contact Name..." className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs w-52 focus:outline-none focus:border-gray-400"/>
        </div>

        <div className="px-5 py-2.5 border-b border-gray-100 flex flex-wrap items-center gap-2 min-h-10">
          <span className="text-xs text-gray-500 font-medium">Active Filters:</span>
          {statusFilter!=="All"&&(
            <span className="flex items-center gap-1 px-2.5 py-1 bg-white border border-gray-300 rounded-full text-xs text-gray-600">
              Status: {statusFilter}
              <button onClick={()=>setStatusFilter("All")} className="ml-1 text-gray-400 hover:text-gray-600">✕</button>
            </span>
          )}
          {activeIssues.map(k=>{
            const it=issueFilterCounts.find(i=>i.key===k);
            return(
              <span key={k} className="flex items-center gap-1 px-2.5 py-1 bg-white border border-gray-300 rounded-full text-xs text-gray-600">
                {it?it.label+" ("+it.count+")":k}
                <button onClick={()=>toggleIssue(k)} className="ml-1 text-gray-400 hover:text-gray-600">✕</button>
              </span>
            );
          })}
          {activeSentiments.map(k=>(
            <span key={k} className="flex items-center gap-1 px-2.5 py-1 bg-white border border-gray-300 rounded-full text-xs text-gray-600">
              {k.charAt(0)+k.slice(1).toLowerCase()}
              <button onClick={()=>toggleSentiment(k)} className="ml-1 text-gray-400 hover:text-gray-600">✕</button>
            </span>
          ))}
          {hasActiveFilters&&<button onClick={clearAll} className="text-xs text-gray-400 hover:text-gray-600">Clear all</button>}
        </div>

        <div className="px-5 py-2.5 border-b border-gray-100 flex flex-wrap items-center gap-2">
          <div className="relative" ref={issueRef}>
            <button onClick={()=>{setIssueExpanded(v=>!v);setSentimentExpanded(false);}}
              className={"flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border transition-all "+(activeIssues.length>0?"border-gray-800 bg-gray-800 text-white":"border-gray-300 text-gray-600 hover:bg-gray-50")}>
              {"Issue"+(activeIssues.length>0?" ("+activeIssues.length+")":"")} <span>{issueExpanded?"▲":"▼"}</span>
            </button>
            {issueExpanded&&(
              <div className="absolute top-8 left-0 z-10 bg-white border border-gray-200 rounded-xl shadow-lg p-3 w-80">
                <div className="text-xs text-gray-400 font-medium mb-2 px-1">Filter by Issue Type — select multiple</div>
                <div className="flex flex-wrap gap-1.5">
                  {issueFilterCounts.map(it=>(
                    <button key={it.key} onClick={()=>toggleIssue(it.key)}
                      className={"px-2.5 py-1 rounded-full text-xs border transition-all "+(activeIssues.includes(it.key)?"border-gray-800 bg-gray-800 text-white":"border-gray-200 text-gray-600 hover:bg-gray-50")}>
                      {activeIssues.includes(it.key)?"✓ ":""}{it.label} <span className={activeIssues.includes(it.key)?"text-gray-300":"text-gray-400"}>({it.count})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="relative" ref={sentimentRef}>
            <button onClick={()=>{setSentimentExpanded(v=>!v);setIssueExpanded(false);}}
              className={"flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border transition-all "+(activeSentiments.length>0?"border-gray-800 bg-gray-800 text-white":"border-gray-300 text-gray-600 hover:bg-gray-50")}>
              {"Sentiment"+(activeSentiments.length>0?" ("+activeSentiments.length+")":"")} <span>{sentimentExpanded?"▲":"▼"}</span>
            </button>
            {sentimentExpanded&&(
              <div className="absolute top-8 left-0 z-10 bg-white border border-gray-200 rounded-xl shadow-lg p-3 w-48">
                <div className="text-xs text-gray-400 font-medium mb-2 px-1">Filter by Sentiment — select multiple</div>
                <div className="flex flex-wrap gap-1.5">
                  {SENTIMENT_OPTIONS.map(s=>(
                    <button key={s} onClick={()=>toggleSentiment(s)}
                      className={"px-2.5 py-1 rounded-full text-xs border transition-all "+(activeSentiments.includes(s)?"border-gray-800 bg-gray-800 text-white":"border-gray-200 text-gray-600 hover:bg-gray-50")}>
                      {activeSentiments.includes(s)?"✓ ":""}{s.charAt(0)+s.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 text-left">
                <th className="px-5 py-3 font-medium w-6"><input type="checkbox" className="rounded"/></th>
                <th className="px-3 py-3 font-medium">Title</th>
                <th className="px-3 py-3 font-medium">
                  <div className="relative" ref={statusRef}>
                    <button onClick={()=>setStatusExpanded(v=>!v)} className="flex items-center gap-1 hover:text-gray-600">
                      Status <span className="text-gray-300">{statusExpanded?"▲":"▼"}</span>
                    </button>
                    {statusExpanded&&(
                      <div className="absolute top-6 left-0 z-10 bg-white border border-gray-200 rounded-xl shadow-lg p-2 w-40">
                        {STATUS_OPTIONS.map(s=>(
                          <button key={s} onClick={()=>{setStatusFilter(s);setStatusExpanded(false);}}
                            className={"w-full text-left px-3 py-1.5 rounded-lg text-xs transition-all "+(statusFilter===s?"bg-gray-800 text-white":"text-gray-600 hover:bg-gray-50")}>
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </th>
                <th className="px-3 py-3 font-medium">Sentiment</th>
                <th className="px-3 py-3 font-medium">Last Replied Time</th>
                <th className="px-3 py-3 font-medium">Role</th>
                <th className="px-3 py-3 font-medium">Device Type</th>
                <th className="px-3 py-3 font-medium">Device OS</th>
                <th className="px-3 py-3 font-medium">Contact Name</th>
                <th className="px-3 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length===0&&(
                <tr><td colSpan={10} className="text-center py-10 text-gray-300">No tickets found</td></tr>
              )}
              {filtered.map((t,i)=>{
                const sc=SENTIMENT_COLORS[t.sentiment];
                const ic=ISSUE_TAG_COLORS[t.issue];
                const found=ISSUE_TYPES.find(x=>x.key===t.issue);
                return(
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3"><input type="checkbox" className="rounded"/></td>
                    <td className="px-3 py-3 max-w-64">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-gray-700 font-medium leading-snug">{t.title}</span>
                        {analysisLoaded
                          ?<span className={"px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap "+ic}>{found?found.label:""}</span>
                          :<span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-400 whitespace-nowrap">Pending...</span>}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className={"px-2 py-0.5 rounded-md text-xs font-semibold whitespace-nowrap "+(
                        t.status==="Unreplied"?"bg-gray-200 text-gray-600":
                        t.status==="AI Unreplied"?"bg-yellow-100 text-yellow-700":
                        t.status==="AI Replied"?"bg-blue-100 text-blue-700":
                        t.status==="Replied"?"bg-green-100 text-green-700":
                        t.status==="Closed"?"bg-purple-100 text-purple-700":
                        "bg-red-100 text-red-400"
                      )}>{t.status}</span>
                    </td>
                    <td className="px-3 py-3">
                      {analysisLoaded
                        ?<span className={"flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium w-fit "+sc.bg+" "+sc.text}>
                            <span className={"w-1.5 h-1.5 rounded-full "+sc.dot}/>{t.sentiment}
                          </span>
                        :<span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-400 whitespace-nowrap">Pending...</span>}
                    </td>
                    <td className="px-3 py-3 text-gray-400 whitespace-nowrap">{t.time}</td>
                    <td className="px-3 py-3">
                      <span className={"px-2 py-0.5 rounded-full text-xs font-semibold "+(
                        t.role==="FREE"?"bg-green-100 text-green-700":
                        t.role==="VIP"?"bg-indigo-100 text-indigo-700":
                        "bg-yellow-100 text-yellow-700"
                      )}>{t.role}</span>
                    </td>
                    <td className="px-3 py-3 text-gray-500">{t.device}</td>
                    <td className="px-3 py-3 text-gray-500">{t.os}</td>
                    <td className="px-3 py-3 text-gray-500">{t.contact}</td>
                    <td className="px-3 py-3"><button className="text-gray-400 hover:text-gray-600">➤</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 flex items-center justify-between text-xs text-gray-400 border-t border-gray-100">
          <span>0 of {filtered.length} row(s) selected</span>
          <div className="flex items-center gap-2">
            <span>50 ▾ Items per page</span>
            <span>Page 1 of 1</span>
            <button className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50">‹</button>
            <button className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50">›</button>
          </div>
        </div>
      </div>
    </div>
  );
}
