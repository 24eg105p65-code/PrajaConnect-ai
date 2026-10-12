"use client";

import React, { useState, useRef } from "react";
import {
  Shield, Globe, MapPin, Camera, Mic, Phone, CheckCircle2,
  Clock, Send, BarChart3, Users, FileText, ChevronRight,
  Sparkles, Star, Search, Menu, X, Building2, Wrench, Droplets,
  Zap, Trash2, School, Sprout, AlertOctagon
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type Role = "CITIZEN" | "WARD_MEMBER" | "SARPANCH" | "OFFICER" | "ADMIN";
type ComplaintStatus =
  | "SUBMITTED"
  | "ACKNOWLEDGED"
  | "UNDER_REVIEW"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "RESOLVED_PENDING_CONFIRMATION"
  | "RESOLVED_CONFIRMED"
  | "REOPENED";

interface Complaint {
  id: string;
  complaintNumber: string;
  citizenName: string;
  citizenPhone: string;
  title: string;
  category: string;
  description: string;
  wardNumber: number;
  locationDescription: string;
  latitude: number | null;
  longitude: number | null;
  urgency: "NORMAL" | "HIGH" | "URGENT";
  status: ComplaintStatus;
  photoUrl?: string;
  timeline: { stage: string; description: string; actor: string; timestamp: string }[];
  submittedAt: string;
}

const INITIAL_WARDS = [
  { number: 1, locality: "North Cheruvu Catchment", representative: "Smt. K. Lakshmi", contact: "+91 98480 12001" },
  { number: 2, locality: "Main Bazaar Road", representative: "Sri B. Rajesh", contact: "+91 98480 12002" },
  { number: 3, locality: "Old Gram Chavadi", representative: "Smt. M. Anitha", contact: "+91 98480 12003" },
  { number: 4, locality: "Zilla Parishad School Colony", representative: "Sri P. Srinivas", contact: "+91 98480 12004" },
  { number: 5, locality: "Weavers & Artisans Enclave", representative: "Sri V. Mahesh", contact: "+91 98480 12005" },
  { number: 6, locality: "Primary Health Center Area", representative: "Smt. T. Sunitha", contact: "+91 98480 12006" },
  { number: 7, locality: "South Rythu Seva Kendram", representative: "Sri K. Naresh", contact: "+91 98480 12007" },
  { number: 8, locality: "Anganwadi West Cluster", representative: "Smt. G. Sarada", contact: "+91 98480 12008" },
  { number: 9, locality: "SC/ST Colony Ring Road", representative: "Sri D. Ramesh", contact: "+91 98480 12009" },
  { number: 10, locality: "East Agricultural Belt", representative: "Smt. E. Bhavani", contact: "+91 98480 12010" },
];

const CATEGORIES = [
  { id: "roads", name: "Roads & Transportation", nameTe: "రోడ్లు మరియు రవాణా", icon: Wrench },
  { id: "water", name: "Drinking Water Supply", nameTe: "తాగునీటి సరఫరా", icon: Droplets },
  { id: "sanitation", name: "Drainage & Sanitation", nameTe: "డ్రైనేజీ మరియు పారిశుధ్యం", icon: Trash2 },
  { id: "electricity", name: "Electricity & Streetlights", nameTe: "విద్యుత్ & వీధి దీపాలు", icon: Zap },
  { id: "schemes", name: "Govt Schemes & Documents", nameTe: "ప్రభుత్వ పథకాలు & పత్రాలు", icon: FileText },
  { id: "facilities", name: "Schools & Infrastructure", nameTe: "పాఠశాలలు & ప్రజా భవనాలు", icon: School },
  { id: "agriculture", name: "Agriculture & Farmers", nameTe: "వ్యవసాయం & రైతు సేవలు", icon: Sprout },
  { id: "safety", name: "Public Safety & Emergency", nameTe: "ప్రజా రక్షణ & అత్యవసరాలు", icon: AlertOctagon },
];

export default function PrajaConnectApp() {
  const [lang, setLang] = useState<"en" | "te">("en");
  const [currentRole, setCurrentRole] = useState<Role>("CITIZEN");
  const [activeTab, setActiveTab] = useState<string>("landing");
  const [searchQuery, setSearchQuery] = useState("");

  const [complaints, setComplaints] = useState<Complaint[]>([
    {
      id: "c-101",
      complaintNumber: "PC-VIL-2026-4091",
      citizenName: "Raju Kurva",
      citizenPhone: "+91 98491 55210",
      title: "Broken Streetlight near ZP High School Gate",
      category: "Electricity & Streetlights",
      description: "Streetlight fixture fallen down after rain, entire stretch dark for 3 nights.",
      wardNumber: 4,
      locationDescription: "Opposite School Main Gate, Pole #24",
      latitude: 17.2403,
      longitude: 78.4294,
      urgency: "HIGH",
      status: "IN_PROGRESS",
      timeline: [
        { stage: "SUBMITTED", description: "Complaint filed online by citizen", actor: "Citizen", timestamp: "10 Oct 2026, 09:15 AM" },
        { stage: "ACKNOWLEDGED", description: "Ward Member verified site location", actor: "Ward Member (Ward 4)", timestamp: "10 Oct 2026, 11:30 AM" },
        { stage: "IN_PROGRESS", description: "Replacement LED bulb and bracket issued", actor: "DISCOM Lineman", timestamp: "12 Oct 2026, 10:00 AM" }
      ],
      submittedAt: "10 Oct 2026"
    },
    {
      id: "c-102",
      complaintNumber: "PC-VIL-2026-4092",
      citizenName: "Anil Kumar",
      citizenPhone: "+91 99887 76655",
      title: "Drinking water pipe crack near market junction",
      category: "Drinking Water Supply",
      description: "Severe pipeline leakage causing drinking water wastage and road inundation.",
      wardNumber: 2,
      locationDescription: "Main Market Crossroad, near Milk Booth",
      latitude: 17.2415,
      longitude: 78.4312,
      urgency: "URGENT",
      status: "RESOLVED_PENDING_CONFIRMATION",
      timeline: [
        { stage: "SUBMITTED", description: "Complaint registered with geotagged photo", actor: "Citizen", timestamp: "08 Oct 2026, 08:00 AM" },
        { stage: "RESOLVED_PENDING_CONFIRMATION", description: "Leak sealed and test flow verified normal", actor: "Panchayat Secretary", timestamp: "09 Oct 2026, 04:30 PM" }
      ],
      submittedAt: "08 Oct 2026"
    }
  ]);

  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("roads");
  const [formDesc, setFormDesc] = useState("");
  const [formWard, setFormWard] = useState(1);
  const [formLandmark, setFormLandmark] = useState("");
  const [formCitizenName, setFormCitizenName] = useState("");
  const [formCitizenPhone, setFormCitizenPhone] = useState("");
  const [formUrgency, setFormUrgency] = useState<"NORMAL" | "HIGH" | "URGENT">("NORMAL");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleFetchGps = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: parseFloat(pos.coords.latitude.toFixed(5)), lng: parseFloat(pos.coords.longitude.toFixed(5)) }),
      () => setCoords({ lat: 17.2405, lng: 78.4298 }),
      { enableHighAccuracy: true }
    );
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
      }
    } catch {
      alert("Camera unavailable.");
    }
  };

  const captureSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      setPhotoPreview(canvas.toDataURL("image/jpeg"));
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const handleSubmitComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDesc.trim() || !formCitizenName.trim()) {
      alert("Please fill in required fields.");
      return;
    }

    const randomTicket = "PC-VIL-2026-" + Math.floor(1000 + Math.random() * 9000);
    const catObj = CATEGORIES.find((c) => c.id === formCategory);

    const newTicket: Complaint = {
      id: "c-" + Date.now(),
      complaintNumber: randomTicket,
      citizenName: formCitizenName,
      citizenPhone: formCitizenPhone || "+91 98480 00000",
      title: formTitle,
      category: catObj ? catObj.name : "Public Infrastructure",
      description: formDesc,
      wardNumber: formWard,
      locationDescription: formLandmark || "Village Center",
      latitude: coords ? coords.lat : 17.2405,
      longitude: coords ? coords.lng : 78.4298,
      urgency: formUrgency,
      status: "SUBMITTED",
      photoUrl: photoPreview || undefined,
      timeline: [
        {
          stage: "SUBMITTED",
          description: `Grievance officially filed online by ${formCitizenName}`,
          actor: "Citizen",
          timestamp: new Date().toLocaleString()
        }
      ],
      submittedAt: "Today"
    };

    setComplaints([newTicket, ...complaints]);
    alert(`Complaint submitted successfully! ID: ${randomTicket}`);

    setFormTitle("");
    setFormDesc("");
    setFormLandmark("");
    setPhotoPreview(null);
    setActiveTab("track");
  };

  const updateComplaintStatus = (id: string, nextStatus: ComplaintStatus, actorRole: string) => {
    setComplaints(complaints.map((c) => {
      if (c.id === id) {
        return {
          ...c,
          status: nextStatus,
          timeline: [
            ...c.timeline,
            {
              stage: nextStatus,
              description: `Status updated to ${nextStatus}`,
              actor: actorRole,
              timestamp: new Date().toLocaleString()
            }
          ]
        };
      }
      return c;
    }));
  };

  const totalCount = complaints.length;
  const resolvedCount = complaints.filter((c) => c.status === "RESOLVED_CONFIRMED" || c.status === "RESOLVED_PENDING_CONFIRMATION").length;
  const pendingCount = totalCount - resolvedCount;

  const wardChartData = INITIAL_WARDS.map((w) => ({
    ward: `Ward ${w.number}`,
    count: complaints.filter((c) => c.wardNumber === w.number).length
  }));

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-900">
      <div className="bg-gradient-to-r from-orange-600 via-white to-green-700 h-1.5 w-full"></div>
      
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("landing")}>
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center font-bold text-orange-400">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="text-lg font-bold tracking-tight flex items-center gap-2">
                PrajaConnect AI
                <span className="text-[10px] bg-orange-500 text-white px-2 py-0.5 rounded font-mono">PILOT</span>
              </div>
              <p className="text-xs text-slate-400">Praja Village (Gram Panchayat) • 10 Wards</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 text-sm">
            <button onClick={() => setActiveTab("landing")} className={`px-3 py-1.5 rounded-lg transition ${activeTab === "landing" ? "bg-slate-800 text-orange-400 font-semibold" : "text-slate-300 hover:text-white"}`}>Home</button>
            <button onClick={() => setActiveTab("report")} className={`px-3 py-1.5 rounded-lg transition ${activeTab === "report" ? "bg-orange-600 text-white font-semibold" : "text-slate-300 hover:text-white"}`}>+ Report Issue</button>
            <button onClick={() => setActiveTab("track")} className={`px-3 py-1.5 rounded-lg transition ${activeTab === "track" ? "bg-slate-800 text-orange-400 font-semibold" : "text-slate-300 hover:text-white"}`}>Track Status</button>
            <button onClick={() => setActiveTab("dashboard")} className={`px-3 py-1.5 rounded-lg transition ${activeTab === "dashboard" ? "bg-slate-800 text-orange-400 font-semibold" : "text-slate-300 hover:text-white"}`}>Public Stats</button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setLang(lang === "en" ? "te" : "en")}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-semibold text-slate-200"
            >
              <Globe className="w-3.5 h-3.5 text-orange-400" />
              <span>{lang === "en" ? "తెలుగు" : "English"}</span>
            </button>

            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value as Role)}
              className="bg-slate-800 border border-slate-700 rounded-lg text-xs font-semibold text-orange-400 px-3 py-1.5 focus:outline-none"
            >
              <option value="CITIZEN">Citizen</option>
              <option value="WARD_MEMBER">Ward Member</option>
              <option value="SARPANCH">Sarpanch / GP</option>
              <option value="OFFICER">Dept Officer</option>
            </select>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {activeTab === "landing" && (
          <div className="space-y-12">
            <div className="text-center space-y-4 max-w-3xl mx-auto py-8">
              <span className="text-xs uppercase tracking-wider font-bold bg-orange-100 text-orange-800 px-3 py-1 rounded-full border border-orange-200">
                Gram Panchayat Public Service Platform
              </span>
              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
                {lang === "en" ? "Your Village. Your Voice. Better Public Services." : "మీ గ్రామం. మీ గొంతుక. మెరుగైన ప్రజా సేవలు."}
              </h1>
              <p className="text-base sm:text-lg text-slate-600">
                {lang === "en"
                  ? "Report local problems, track progress in real-time, connect with responsible ward representatives, and view transparent resolution statistics."
                  : "గ్రామ సమస్యలను ఆన్‌లైన్‌లో నమోదు చేయండి, వార్డు సభ్యులతో సంప్రదించండి మరియు పారదర్శక పరిష్కారాన్ని పొందండి."}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <button
                  onClick={() => setActiveTab("report")}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-orange-600/20 transition flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {lang === "en" ? "Report a Problem" : "సమస్యను నమోదు చేయండి"}
                </button>
                <button
                  onClick={() => setActiveTab("track")}
                  className="bg-white hover:bg-slate-100 text-slate-900 font-bold px-6 py-3 rounded-xl border border-slate-300 shadow-sm transition flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  {lang === "en" ? "Track Complaint" : "ఫిర్యాదు స్థితి తెలుసుకోండి"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
                <div className="text-3xl font-black text-slate-900">{totalCount}</div>
                <div className="text-xs font-semibold text-slate-500 mt-1">Total Complaints</div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
                <div className="text-3xl font-black text-emerald-600">{resolvedCount}</div>
                <div className="text-xs font-semibold text-slate-500 mt-1">Resolved Issues</div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
                <div className="text-3xl font-black text-amber-600">{pendingCount}</div>
                <div className="text-xs font-semibold text-slate-500 mt-1">In Progress</div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
                <div className="text-3xl font-black text-indigo-600">2.4 Days</div>
                <div className="text-xs font-semibold text-slate-500 mt-1">Avg Resolution Time</div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900">Civic Problem Categories</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <div
                      key={cat.id}
                      onClick={() => { setFormCategory(cat.id); setActiveTab("report"); }}
                      className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-orange-500 hover:shadow-md transition cursor-pointer group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-orange-50 flex items-center justify-center text-slate-700 group-hover:text-orange-600 transition mb-3">
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm group-hover:text-orange-600 transition">
                        {lang === "en" ? cat.name : cat.nameTe}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">Lodge grievance &rarr;</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === "report" && (
          <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                {lang === "en" ? "Report a Public Problem" : "గ్రామ సమస్యను నమోదు చేయండి"}
              </h2>
              <p className="text-xs text-slate-500 mt-1">Provide details, landmark, and attach evidence photos or location.</p>
            </div>

            <form onSubmit={handleSubmitComplaint} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Citizen Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formCitizenName}
                    onChange={(e) => setFormCitizenName(e.target.value)}
                    placeholder="e.g. Ramesh Goud"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    value={formCitizenPhone}
                    onChange={(e) => setFormCitizenPhone(e.target.value)}
                    placeholder="+91 98480 XXXXX"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Complaint Title *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Broken streetlight or drainage blockage"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Civic Category *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>{lang === "en" ? c.name : c.nameTe}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Village Ward (1 - 10) *</label>
                  <select
                    value={formWard}
                    onChange={(e) => setFormWard(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  >
                    {INITIAL_WARDS.map((w) => (
                      <option key={w.number} value={w.number}>Ward {w.number} - {w.locality}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Landmark / Location *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={formLandmark}
                    onChange={(e) => setFormLandmark(e.target.value)}
                    placeholder="Nearby pole, shop, or building"
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleFetchGps}
                    className="bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <MapPin className="w-4 h-4 text-orange-600" />
                    {coords ? `${coords.lat}, ${coords.lng}` : "Fetch GPS"}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Describe the problem in detail..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="text-xs font-bold text-slate-700">Photo Evidence</div>
                {!cameraActive ? (
                  <button
                    type="button"
                    onClick={startCamera}
                    className="bg-white hover:bg-slate-100 border border-slate-300 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5"
                  >
                    <Camera className="w-4 h-4 text-blue-600" /> Open Camera
                  </button>
                ) : (
                  <div className="space-y-2">
                    <video ref={videoRef} className="w-full h-44 bg-black rounded-xl object-cover" />
                    <div className="flex gap-2">
                      <button type="button" onClick={captureSnapshot} className="bg-green-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex-1">Take Snapshot</button>
                      <button type="button" onClick={stopCamera} className="bg-slate-300 text-slate-800 px-4 py-2 rounded-xl text-xs font-bold">Cancel</button>
                    </div>
                  </div>
                )}
                {photoPreview && (
                  <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-200">
                    <img src={photoPreview} alt="Evidence" className="w-16 h-16 rounded object-cover" />
                    <span className="text-xs font-bold text-emerald-600">Photo Attached</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-lg shadow-orange-600/20 transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Submit Grievance
              </button>
            </form>
          </div>
        )}

        {activeTab === "track" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Complaints Directory</h2>
                <p className="text-xs text-slate-500">Track registered issues across all wards</p>
              </div>
              <input
                type="text"
                placeholder="Search ticket number or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div className="space-y-4">
              {complaints
                .filter((c) => c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.complaintNumber.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((ticket) => (
                  <div key={ticket.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm bg-slate-100 px-2.5 py-1 rounded-lg text-slate-800">{ticket.complaintNumber}</span>
                        <span className="text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full">Ward {ticket.wardNumber}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-500">{ticket.submittedAt}</span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-slate-900">{ticket.title}</h3>
                      <p className="text-xs text-slate-600">{ticket.description}</p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                      <div className="text-xs font-bold text-slate-700">Timeline</div>
                      <div className="space-y-1.5">
                        {ticket.timeline.map((step, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-slate-800">{step.stage}</span> - {step.description}
                              <span className="text-[10px] text-slate-400 block">{step.timestamp}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg border border-indigo-200">{ticket.status}</span>
                      {currentRole === "WARD_MEMBER" && ticket.status === "SUBMITTED" && (
                        <button
                          onClick={() => updateComplaintStatus(ticket.id, "ACKNOWLEDGED", "Ward Member")}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg"
                        >
                          Acknowledge Issue
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-slate-900">Gram Panchayat Public Stats</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-bold text-sm text-slate-800">Complaints Volume by Ward</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={wardChartData}>
                      <XAxis dataKey="ward" fontSize={10} />
                      <YAxis allowDecimals={false} fontSize={10} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#ea580c" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-bold text-sm text-slate-800">Ward Representatives</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1 text-xs">
                  {INITIAL_WARDS.map((w) => (
                    <div key={w.number} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                        <div className="font-bold text-slate-900">Ward {w.number} - {w.locality}</div>
                        <div className="text-[11px] text-slate-500">{w.representative} • {w.contact}</div>
                      </div>
                      <a href={`tel:${w.contact}`} className="p-1.5 bg-white border border-slate-200 rounded-lg text-emerald-600">
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-slate-900 text-slate-400 text-xs py-6 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>PrajaConnect AI — Gram Panchayat Civic Portal</div>
          <div>Version 1.0 (Village Edition) • Next.js 14</div>
        </div>
      </footer>
    </div>
  );
}