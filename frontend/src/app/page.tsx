"use client"

import React, { useState, useEffect, useCallback } from "react"
import { 
  Users, 
  GraduationCap, 
  TrendingUp, 
  AlertTriangle, 
  LayoutDashboard, 
  UserCircle, 
  ClipboardCheck, 
  PieChart as PieChartIcon,
  Search,
  Bell,
  CheckCircle2,
  Clock,
  Code2,
  BrainCircuit,
  MessagesSquare,
  Trophy,
  Filter,
  Lock,
  Mail,
  ArrowRight,
  LogOut,
  ShieldCheck,
  History,
  Info,
  Plus,
  FileText,
  Download,
  Calendar,
  Phone,
  MapPin,
  BookOpen,
  Hash,
  Briefcase,
  Menu
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts'

type Section = 'overview' | 'students' | 'academics' | 'attendance' | 'placement' | 'analytics' | 'admin' | 'profile'
type Role = 'admin' | 'faculty' | 'student' | null

interface User {
  email: string
  full_name: string
  role: Role
  uid?: string
  id?: string
  department?: string
}

const API_URL = "/api"

export default function ERPDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [activeSection, setActiveSection] = useState<Section>('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setIsAuthenticated(false)
    setUser(null)
  }, [])

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token")
      if (token) {
        try {
          const res = await fetch(`${API_URL}/users/me`, {
            headers: { "Authorization": `Bearer ${token}` }
          })
          if (res.ok) {
            const userData = await res.json()
            setIsAuthenticated(true)
            setUser(userData)
          } else {
            handleLogout()
          }
        } catch (e) {
          handleLogout()
        }
      }
    }
    checkAuth()
  }, [handleLogout])

  if (!isAuthenticated) {
    return <LoginView onLogin={(user) => {
      setIsAuthenticated(true)
      setUser(user)
    }} />
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-zinc-950 font-sans">
      {/* Mobile Nav Trigger */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-72 p-0 border-none bg-white dark:bg-zinc-900">
          <div className="p-6">
            <h2 className="text-2xl font-black text-blue-600 dark:text-blue-400 tracking-tighter italic">EduPulse</h2>
            <p className="text-[10px] text-zinc-400 font-bold tracking-[0.2em] uppercase mt-1">Institutional ERP</p>
          </div>
          <nav className="flex-1 px-4 space-y-1">
            <NavItem 
              icon={<LayoutDashboard size={18} />} 
              label="Overview" 
              active={activeSection === 'overview'} 
              onClick={() => { setActiveSection('overview'); setIsMobileMenuOpen(false); }}
            />
            
            {(user?.role === 'admin' || user?.role === 'faculty') && (
              <NavItem 
                icon={<Users size={18} />} 
                label={user?.role === 'admin' ? "User Management" : "My Students"} 
                active={activeSection === 'students'} 
                onClick={() => { setActiveSection('students'); setIsMobileMenuOpen(false); }}
              />
            )}

            <NavItem 
              icon={<GraduationCap size={18} />} 
              label="Academics" 
              active={activeSection === 'academics'} 
              onClick={() => { setActiveSection('academics'); setIsMobileMenuOpen(false); }}
            />
            
            <NavItem 
              icon={<ClipboardCheck size={18} />} 
              label="Attendance" 
              active={activeSection === 'attendance'} 
              onClick={() => { setActiveSection('attendance'); setIsMobileMenuOpen(false); }}
            />
            
            <NavItem 
              icon={<TrendingUp size={18} />} 
              label="Placement Cell" 
              active={activeSection === 'placement'} 
              onClick={() => { setActiveSection('placement'); setIsMobileMenuOpen(false); }}
            />

            {user?.role === 'admin' && (
              <>
                <NavItem 
                  icon={<PieChartIcon size={18} />} 
                  label="Advanced Analytics" 
                  active={activeSection === 'analytics'} 
                  onClick={() => { setActiveSection('analytics'); setIsMobileMenuOpen(false); }}
                />
                <NavItem 
                  icon={<ShieldCheck size={18} />} 
                  label="System Settings" 
                  active={activeSection === 'admin'} 
                  onClick={() => { setActiveSection('admin'); setIsMobileMenuOpen(false); }}
                />
              </>
            )}
          </nav>
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <div className="flex items-center justify-between p-2 rounded-xl">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setActiveSection('profile'); setIsMobileMenuOpen(false); }}>
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                  {user?.full_name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate tracking-tight dark:text-zinc-200">{user?.full_name}</p>
                  <p className="text-[10px] text-zinc-500 uppercase font-black tracking-tighter">{user?.role}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout} className="text-zinc-400 hover:text-red-500">
                <LogOut size={14} />
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="w-64 border-r bg-white dark:bg-zinc-900 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <h2 className="text-2xl font-black text-blue-600 dark:text-blue-400 tracking-tighter italic">EduPulse</h2>
          <p className="text-[10px] text-zinc-400 font-bold tracking-[0.2em] uppercase mt-1">Institutional ERP</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <NavItem 
            icon={<LayoutDashboard size={18} />} 
            label="Overview" 
            active={activeSection === 'overview'} 
            onClick={() => setActiveSection('overview')}
          />
          
          {(user?.role === 'admin' || user?.role === 'faculty') && (
            <NavItem 
              icon={<Users size={18} />} 
              label={user?.role === 'admin' ? "User Management" : "My Students"} 
              active={activeSection === 'students'} 
              onClick={() => setActiveSection('students')}
            />
          )}

          <NavItem 
            icon={<GraduationCap size={18} />} 
            label="Academics" 
            active={activeSection === 'academics'} 
            onClick={() => setActiveSection('academics')}
          />
          
          <NavItem 
            icon={<ClipboardCheck size={18} />} 
            label="Attendance" 
            active={activeSection === 'attendance'} 
            onClick={() => setActiveSection('attendance')}
          />
          
          <NavItem 
            icon={<TrendingUp size={18} />} 
            label="Placement Cell" 
            active={activeSection === 'placement'} 
            onClick={() => setActiveSection('placement')}
          />

          {user?.role === 'admin' && (
            <>
              <NavItem 
                icon={<PieChartIcon size={18} />} 
                label="Advanced Analytics" 
                active={activeSection === 'analytics'} 
                onClick={() => setActiveSection('analytics')}
              />
              <NavItem 
                icon={<ShieldCheck size={18} />} 
                label="System Settings" 
                active={activeSection === 'admin'} 
                onClick={() => setActiveSection('admin')}
              />
            </>
          )}
        </nav>

        <div className="p-4 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveSection('profile')}>
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                {user?.full_name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate tracking-tight dark:text-zinc-200">{user?.full_name}</p>
                <p className="text-[10px] text-zinc-500 uppercase font-black tracking-tighter">{user?.role}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-zinc-400 hover:text-red-500 rounded-lg h-8 w-8">
              <LogOut size={14} />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 border-b bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md flex items-center justify-between px-4 md:px-8 sticky top-0 z-20">
          <div className="flex items-center gap-4 w-full md:w-1/3">
            <Button variant="ghost" size="icon" className="md:hidden text-zinc-500" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} />
            </Button>
            <div className="relative w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
              <Input 
                placeholder="Search ERP..." 
                className="pl-10 bg-slate-50 dark:bg-zinc-800 border-none h-10 w-full focus-visible:ring-2 focus-visible:ring-blue-500/20 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-6 ml-4">
            <Button variant="ghost" size="icon" className="relative h-10 w-10 text-zinc-500 hidden sm:flex">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900"></span>
            </Button>
            <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block" />
            <Badge variant="outline" className="h-7 md:h-8 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-blue-100 uppercase text-[9px] md:text-[10px] font-black px-2 md:px-3 tracking-widest whitespace-nowrap">
              {user?.role}
            </Badge>
          </div>
        </header>

          <div className="p-3 md:p-6 max-w-7xl mx-auto pb-20">
            {activeSection === 'overview' && <OverviewView setActiveSection={setActiveSection} user={user} />}
            {activeSection === 'profile' && <StudentProfileView />}
            {activeSection === 'students' && <StudentManagementView userRole={user?.role} />}
            {activeSection === 'academics' && <AcademicsView user={user} />}
            {activeSection === 'attendance' && <AttendanceView user={user} />}
            {activeSection === 'placement' && <PlacementCellView user={user} />}
            {activeSection === 'analytics' && <AnalyticsView userRole={user?.role} />}
            {activeSection === 'admin' && <AdminControlView />}
          </div>
      </main>
    </div>
  )
}

// --- Views ---

function LoginView({ onLogin }: { onLogin: (user: User) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const formData = new URLSearchParams()
      formData.append('username', email)
      formData.append('password', password)

      const tokenRes = await fetch(`${API_URL}/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData
      })

      if (!tokenRes.ok) throw new Error('Invalid credentials')
      const { access_token } = await tokenRes.json()
      localStorage.setItem("token", access_token)

      const userRes = await fetch(`${API_URL}/users/me`, {
        headers: { "Authorization": `Bearer ${access_token}` }
      })
      
      if (!userRes.ok) throw new Error('Failed to fetch user profile')
      const userData = await userRes.json()
      onLogin(userData)
    } catch (err: any) {
      setError(err.message || 'Authentication failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-zinc-950 p-4">
      <Card className="w-full max-w-md shadow-2xl border-none overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
        <CardHeader className="space-y-1 text-center pb-8 pt-10">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20 rotate-6 hover:rotate-0 transition-transform duration-300">
              <ShieldCheck size={36} />
            </div>
          </div>
          <CardTitle className="text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 italic">EduPulse</CardTitle>
          <CardDescription className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-[10px]">Institutional ERP Portal</CardDescription>
        </CardHeader>
        <CardContent className="px-10 pb-12">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
                <Input 
                  type="email" 
                  placeholder="Institutional Email" 
                  className="pl-11 h-12 bg-zinc-50 border-zinc-100 focus-visible:ring-blue-500 font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
                <Input 
                  type="password" 
                  placeholder="Secret Password" 
                  className="pl-11 h-12 bg-zinc-50 border-zinc-100 focus-visible:ring-blue-500 font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            {error && <p className="text-[10px] text-red-500 font-black uppercase text-center bg-red-50 py-3 rounded-xl border border-red-100">{error}</p>}
            <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base font-bold shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98] rounded-xl" disabled={isLoading}>
              {isLoading ? "Authenticating..." : "Login to ERP"}
              {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
            </Button>
          </form>
          
          <div className="mt-10 pt-8 border-t border-zinc-100 space-y-5">
            <p className="text-[9px] text-zinc-400 uppercase font-black text-center tracking-[0.3em]">Institutional Demo Access</p>
            <div className="grid grid-cols-3 gap-3">
              <DemoAccessBtn icon={<ShieldCheck size={16}/>} label="ADMIN" onClick={() => setEmail('admin@edupulse.edu')} color="blue" />
              <DemoAccessBtn icon={<Users size={16}/>} label="FACULTY" onClick={() => setEmail('faculty@edupulse.edu')} color="emerald" />
              <DemoAccessBtn icon={<GraduationCap size={16}/>} label="STUDENT" onClick={() => setEmail('student@edupulse.edu')} color="purple" />
            </div>
            <p className="text-[10px] text-zinc-400 text-center font-medium">Default Password: <span className="text-blue-600 font-bold">admin123</span></p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function DemoAccessBtn({ icon, label, onClick, color }: { icon: React.ReactNode, label: string, onClick: () => void, color: 'blue' | 'emerald' | 'purple' }) {
  const colors = {
    blue: "hover:bg-blue-50 hover:border-blue-100 text-blue-600 bg-blue-50/50",
    emerald: "hover:bg-emerald-50 hover:border-emerald-100 text-emerald-600 bg-emerald-50/50",
    purple: "hover:bg-purple-50 hover:border-purple-100 text-purple-600 bg-purple-50/50"
  }
  return (
    <button onClick={onClick} className={cn("flex flex-col items-center gap-2 p-3 rounded-2xl border border-transparent transition-all group", colors[color])}>
      <div className="group-hover:scale-110 transition-transform">{icon}</div>
      <span className="text-[9px] font-black tracking-widest">{label}</span>
    </button>
  )
}

function OverviewView({ setActiveSection, user }: { setActiveSection: (s: Section) => void, user: User | null }) {
  const isAdmin = user?.role === 'admin'
  const isFaculty = user?.role === 'faculty'
  const isStudent = user?.role === 'student'

  const [isPlacementModalOpen, setIsPlacementModalOpen] = useState(false)
  const [isCGPAModalOpen, setIsCGPAModalOpen] = useState(false)
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)

  const [placedCompanies, setPlacedCompanies] = useState<any[]>([])
  const [academicResults, setAcademicResults] = useState<any[]>([])
  const [alerts, setAlerts] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [reportData, setReportData] = useState<any>(null)

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token")
      try {
        const res = await fetch(`${API_URL}/admin/stats`, {
          headers: { "Authorization": `Bearer ${token}` }
        })
        if (res.ok) setStats(await res.json())
      } catch (e) {}
    }
    fetchStats()
  }, [])

  const fetchPlacementStats = async () => {
    const token = localStorage.getItem("token")
    try {
      const res = await fetch(`${API_URL}/placement/placed-2024`, {
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (res.ok) setPlacedCompanies(await res.json())
    } catch (e) {}
  }

  const fetchAcademicResults = async () => {
    const token = localStorage.getItem("token")
    try {
      const res = await fetch(`${API_URL}/student/academic-results`, {
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (res.ok) setAcademicResults(await res.json())
    } catch (e) {}
  }

  const fetchAlerts = async () => {
    const token = localStorage.getItem("token")
    try {
      const res = await fetch(`${API_URL}/alerts`, {
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (res.ok) setAlerts(await res.json())
    } catch (e) {}
  }

  const fetchReport = async () => {
    const token = localStorage.getItem("token")
    try {
      const res = await fetch(`${API_URL}/admin/report`, {
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (res.ok) {
        setReportData(await res.json())
        setIsReportModalOpen(true)
      }
    } catch (e) {}
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50 italic">
            {isAdmin ? "Institutional HQ" : isFaculty ? "Academic Hub" : "My Learning Path"}
          </h1>
          <p className="text-zinc-500 font-medium mt-1">
            {isAdmin ? "Global oversight and decision intelligence center." : isFaculty ? "Managing institutional academic operations." : "Your personalized education roadmap."}
          </p>
        </div>
        <div className="flex gap-3">
          {isAdmin && <Button variant="outline" className="rounded-xl font-bold" onClick={() => setActiveSection('admin')}><ShieldCheck size={18} className="mr-2"/> SYSTEM AUDIT</Button>}
          <Button className="bg-blue-600 rounded-xl font-bold shadow-lg shadow-blue-500/20 px-6" onClick={() => isStudent ? setActiveSection('profile') : fetchReport()}>
            {isStudent ? "MY PROFILE" : "QUICK REPORT"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="TOTAL STUDENTS" 
          value={stats?.total_students?.toString() || "30"} 
          change="Institutional Capacity" 
          icon={<Users size={20} className="text-blue-600"/>} 
          trend="up" 
          onClick={() => setActiveSection('students')}
        />
        <StatCard 
          title="PLACED (2024)" 
          value={stats?.placement_rate || "84.2%"} 
          change="Avg CTC: 12.4L" 
          icon={<Trophy size={20} className="text-emerald-600"/>} 
          trend="up" 
          onClick={() => {
            fetchPlacementStats()
            setIsPlacementModalOpen(true)
          }}
        />
        <StatCard 
          title="AVG CGPA" 
          value="7.84" 
          change="Target: 8.0" 
          icon={<GraduationCap size={20} className="text-purple-600"/>} 
          trend="neutral" 
          onClick={() => {
            fetchAcademicResults()
            setIsCGPAModalOpen(true)
          }}
        />
        <StatCard 
          title="ALERTS" 
          value="156" 
          change="Requires attention" 
          icon={<AlertTriangle size={20} className="text-amber-600"/>} 
 trend="down" 
          onClick={() => {
            fetchAlerts()
            setIsAlertsModalOpen(true)
          }}
        />
      </div>

      {/* Quick Report Modal */}
      <Dialog open={isReportModalOpen} onOpenChange={setIsReportModalOpen}>
        <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto rounded-[32px] p-6 md:p-10">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600" />
          <DialogHeader>
            <div className="flex items-center justify-between mb-4">
              <Badge className="bg-blue-50 text-blue-700 border-blue-100 font-black px-3 py-1">REAL-TIME DATA</Badge>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{new Date().toLocaleDateString()}</span>
            </div>
            <DialogTitle className="text-3xl md:text-4xl font-black tracking-tighter italic mb-2">{reportData?.title}</DialogTitle>
            <DialogDescription className="font-medium text-zinc-500 text-base md:text-lg">Instant snapshot of institutional health and KPIs.</DialogDescription>
          </DialogHeader>

          <div className="mt-8 md:mt-10 space-y-8 md:space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {reportData?.metrics.map((metric: any, i: number) => (
                <div key={i} className="p-4 md:p-6 bg-slate-50 rounded-[24px] border border-transparent hover:border-blue-100 transition-all group">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1 group-hover:text-blue-500 transition-colors">{metric.label}</p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tighter">{metric.value}</span>
                    <Badge variant="outline" className="text-[9px] font-black uppercase text-emerald-600 border-emerald-100 bg-emerald-50">{metric.status}</Badge>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Critical Highlights</h4>
              <div className="space-y-3">
                {reportData?.highlights.map((h: string, i: number) => (
                  <div key={i} className="flex items-start md:items-center gap-3 md:gap-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/30">
                    <CheckCircle2 size={18} className="text-blue-600 shrink-0 mt-0.5 md:mt-0" />
                    <p className="text-sm font-bold text-zinc-700 leading-tight md:leading-normal">{h}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-[10px] font-medium text-zinc-400 italic">Auth ID: {user?.id?.slice(0, 8)}...</p>
              <Button className="w-full md:w-auto bg-blue-600 rounded-xl font-bold px-8 shadow-lg shadow-blue-500/20" onClick={() => setIsReportModalOpen(false)}>DISMISS</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Placement Details Modal */}
      <Dialog open={isPlacementModalOpen} onOpenChange={setIsPlacementModalOpen}>
        <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto rounded-[32px] p-6 md:p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl md:text-3xl font-black tracking-tighter italic mb-2">Placement Record 2024</DialogTitle>
            <DialogDescription className="font-medium text-zinc-500 text-sm md:text-base">Comprehensive overview of company-wise recruitment statistics.</DialogDescription>
          </DialogHeader>
          <div className="mt-6 md:mt-8 space-y-4">
            {placedCompanies.map((company, i) => (
              <Card key={i} className="border-none bg-slate-50/50 rounded-3xl p-4 md:p-6 hover:bg-slate-50 transition-colors">
                <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-6">
                  <div className="space-y-2">
                    <h3 className="text-xl font-black tracking-tight text-blue-600">{company.company_name}</h3>
                    <p className="text-sm font-medium text-zinc-600 leading-relaxed">{company.description}</p>
                    <div className="flex gap-2 pt-2">
                      <Badge className="bg-white text-zinc-600 border-zinc-100 hover:bg-white px-3 font-bold">{company.location}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-6 md:gap-8 items-center md:min-w-fit">
                    <div className="text-left md:text-center">
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Placed</p>
                      <p className="text-xl md:text-2xl font-black text-zinc-900">{company.total_placed}</p>
                    </div>
                    <div className="text-left md:text-center">
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Avg Package</p>
                      <p className="text-xl md:text-2xl font-black text-emerald-600 italic">{company.avg_package}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* CGPA & Marks Details Modal */}
      <Dialog open={isCGPAModalOpen} onOpenChange={setIsCGPAModalOpen}>
        <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto rounded-[32px] p-6 md:p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl md:text-3xl font-black tracking-tighter italic mb-2">Academic Transcript</DialogTitle>
            <DialogDescription className="font-medium text-zinc-500 text-sm md:text-base">Semester-wise performance and subject level assessment.</DialogDescription>
          </DialogHeader>
          <div className="mt-6 md:mt-8 space-y-6 md:space-y-8">
            {academicResults.map((result, i) => (
              <div key={i} className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                  <h3 className="text-lg md:text-xl font-black tracking-tight italic text-purple-600">Semester {result.semester}</h3>
                  <Badge className="bg-purple-50 text-purple-700 font-black text-base md:text-lg px-3 md:px-4 h-8 md:h-10 border-purple-100">{result.sgpa} SGPA</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  {result.subjects.map((sub: any, j: number) => (
                    <div key={j} className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-transparent hover:border-purple-100 transition-all">
                      <div>
                        <p className="text-[9px] md:text-[10px] font-black text-zinc-400 uppercase tracking-widest">{sub.subject_code}</p>
                        <p className="font-bold text-zinc-800 text-sm md:text-base">{sub.subject_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-base md:text-lg font-black text-zinc-900">{sub.marks}/{sub.total_marks}</p>
                        <Badge variant="outline" className="font-black text-blue-600 border-blue-100 h-6 text-[10px]">Grade: {sub.grade}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Alerts Details Modal */}
      <Dialog open={isAlertsModalOpen} onOpenChange={setIsAlertsModalOpen}>
        <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto rounded-[32px] p-6 md:p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl md:text-3xl font-black tracking-tighter italic mb-2">Critical Alerts</DialogTitle>
            <DialogDescription className="font-medium text-zinc-500 text-sm md:text-base">Operational notifications requiring immediate attention.</DialogDescription>
          </DialogHeader>
          <div className="mt-6 md:mt-8 space-y-3 md:space-y-4">
            {alerts.map((alert, i) => (
              <div key={i} className={cn(
                "p-4 md:p-6 rounded-3xl border flex gap-3 md:gap-4 transition-all",
                alert.severity === 'critical' ? "bg-red-50/50 border-red-100 text-red-900" : 
                alert.severity === 'warning' ? "bg-amber-50/50 border-amber-100 text-amber-900" : 
                "bg-blue-50/50 border-blue-100 text-blue-900"
              )}>
                <div className={cn(
                  "h-10 w-10 md:h-12 md:w-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                  alert.severity === 'critical' ? "bg-red-100 text-red-600" : 
                  alert.severity === 'warning' ? "bg-amber-100 text-amber-600" : 
                  "bg-blue-100 text-blue-600"
                )}>
                  {alert.severity === 'critical' ? <AlertTriangle size={20}/> : alert.severity === 'warning' ? <Info size={20}/> : <Bell size={20}/>}
                </div>
                <div className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                    <h3 className="font-black tracking-tight text-base md:text-lg leading-tight">{alert.title}</h3>
                    <span className="text-[9px] md:text-[10px] font-bold opacity-50">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-xs md:text-sm font-medium leading-relaxed opacity-80">{alert.description}</p>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <Card className="lg:col-span-2 border-none shadow-sm rounded-[32px] bg-white overflow-hidden">
          <CardHeader className="p-8 pb-4">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl font-black tracking-tight">Department Readiness</CardTitle>
                <CardDescription className="font-medium text-zinc-400">Placement potential across branches.</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-blue-600 font-black tracking-widest text-[10px]" onClick={() => setActiveSection('analytics')}>FULL ANALYTICS</Button>
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <div className="space-y-6 pt-4">
              <DeptProgress dept="Computer Science" value={78} color="bg-blue-600" />
              <DeptProgress dept="Information Tech" value={72} color="bg-cyan-500" />
              <DeptProgress dept="Electronics" value={65} color="bg-indigo-600" />
              <DeptProgress dept="Mechanical" value={58} color="bg-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-[32px] bg-white overflow-hidden">
          <CardHeader className="p-8 pb-4">
            <CardTitle className="text-2xl font-black tracking-tight">Bulletins</CardTitle>
            <CardDescription className="font-medium text-zinc-400">Institutional Broadcasts</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0 space-y-2">
            <AnnouncementItem title="Mid-Sem Evaluation Schedule" time="1h ago" type="academic" />
            <AnnouncementItem title="Goldman Sachs Drive Phase 1" time="4h ago" type="placement" onClick={() => setActiveSection('placement')} />
            <AnnouncementItem title="System Maintenance: Sunday" time="1d ago" type="system" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StudentProfileView() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token")
      try {
        const res = await fetch(`${API_URL}/student/profile`, {
          headers: { "Authorization": `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setProfile(data)
        }
      } catch (e) {
        console.error("Failed to fetch profile")
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  if (loading) return <div className="h-96 flex items-center justify-center italic font-bold text-zinc-400">Loading profile...</div>

  return (
    <div className="space-y-10">
      <div className="relative h-48 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[32px] overflow-hidden">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-3xl" />
        <div className="absolute bottom-8 left-10 flex items-center gap-6">
          <div className="h-24 w-24 rounded-3xl bg-white p-1 shadow-2xl">
            <div className="h-full w-full rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-black">
              {profile?.full_name?.charAt(0) || "A"}
            </div>
          </div>
          <div className="text-white">
            <h2 className="text-3xl font-black tracking-tighter italic">{profile?.full_name}</h2>
            <p className="text-blue-100 font-bold uppercase tracking-widest text-[10px]">Student ID: {profile?.roll_number}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-sm rounded-[32px] bg-white p-8">
          <CardHeader className="p-0 mb-8">
            <CardTitle className="text-xl font-black tracking-tight italic">Personal Intelligence</CardTitle>
          </CardHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ProfileItem icon={<Mail size={18}/>} label="Institutional Email" value="student@edupulse.edu" />
            <ProfileItem icon={<Phone size={18}/>} label="Contact Number" value={profile?.contact_number} />
            <ProfileItem icon={<MapPin size={18}/>} label="Residential Address" value={profile?.address} />
            <ProfileItem icon={<Hash size={18}/>} label="Roll Number" value={profile?.roll_number} />
          </div>
        </Card>

        <Card className="border-none shadow-sm rounded-[32px] bg-white p-8">
          <CardHeader className="p-0 mb-6">
            <CardTitle className="text-xl font-black tracking-tight italic">Registrations</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            {profile?.registered_courses?.map((course: string, i: number) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-blue-100 transition-all">
                <div className="h-2 w-2 rounded-full bg-blue-600" />
                <span className="text-sm font-bold tracking-tight text-zinc-700">{course}</span>
              </div>
            ))}
            <div className="pt-4 border-t border-zinc-100">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Current Semester</p>
              <p className="text-2xl font-black text-blue-600 italic">Semester {profile?.current_semester}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

function ProfileItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="space-y-1 group">
      <div className="flex items-center gap-2 text-zinc-400">
        <div className="group-hover:text-blue-600 transition-colors">{icon}</div>
        <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-sm font-bold text-zinc-800 ml-6">{value}</p>
    </div>
  )
}

function NavItem({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all cursor-pointer group",
        active 
          ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
          : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
      )}
    >
      <div className={cn("transition-transform group-hover:scale-110", active ? "text-white" : "text-zinc-400 group-hover:text-blue-600")}>{icon}</div>
      <span className={cn("text-xs font-bold tracking-tight", active ? "font-black" : "font-medium")}>{label}</span>
    </div>
  )
}

function StatCard({ title, value, change, icon, trend, onClick }: { title: string, value: string, change: string, icon: React.ReactNode, trend: 'up' | 'down' | 'neutral', onClick?: () => void }) {
  return (
    <Card 
      onClick={onClick}
      className={cn(
        "border-none shadow-sm rounded-[24px] hover:shadow-md transition-shadow group overflow-hidden bg-white",
        onClick && "cursor-pointer active:scale-[0.98] transition-all"
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[10px] font-black text-zinc-400 tracking-widest uppercase">{title}</p>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-900 group-hover:scale-110 transition-transform">{icon}</div>
        </div>
        <h3 className="text-3xl font-black tracking-tighter text-zinc-900">{value}</h3>
        <p className={cn(
          "text-[10px] font-bold mt-2",
          trend === 'up' ? "text-emerald-500" : trend === 'down' ? "text-red-500" : "text-zinc-500"
        )}>{change}</p>
      </CardContent>
    </Card>
  )
}

function DeptProgress({ dept, value, color }: { dept: string, value: number, color: string }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <span className="text-sm font-bold tracking-tight text-zinc-700 dark:text-zinc-300">{dept}</span>
        <span className="text-xs font-black text-blue-600 font-mono">{value}% READY</span>
      </div>
      <div className="h-2.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden p-0.5">
        <div className={cn("h-full rounded-full transition-all duration-1000", color)} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

function AnnouncementItem({ title, time, type, onClick }: { title: string, time: string, type: 'academic' | 'placement' | 'system', onClick?: () => void }) {
  const styles = {
    academic: "border-blue-100 bg-blue-50/30 text-blue-700",
    placement: "border-purple-100 bg-purple-50/30 text-purple-700",
    system: "border-amber-100 bg-amber-50/30 text-amber-700"
  }
  return (
    <div 
      onClick={onClick}
      className={cn("flex items-center justify-between p-4 rounded-2xl border border-transparent hover:border-zinc-100 hover:bg-slate-50 transition-all cursor-pointer group", styles[type])}
    >
      <div className="flex items-center gap-3">
        <div className={cn("h-2 w-2 rounded-full", type === 'academic' ? 'bg-blue-600' : type === 'placement' ? 'bg-purple-600' : 'bg-amber-600')} />
        <span className="text-xs font-bold tracking-tight">{title}</span>
      </div>
      <span className="text-[10px] font-bold opacity-60 group-hover:opacity-100 transition-opacity whitespace-nowrap">{time}</span>
    </div>
  )
}

function StudentManagementView({ userRole }: { userRole: Role }) {
  const isAdmin = userRole === 'admin'
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [newUser, setNewUser] = useState({
    email: '',
    full_name: '',
    password: 'admin123',
    role: 'student' as Role,
    department: 'Computer Science'
  })

  const fetchUsers = useCallback(async () => {
    const token = localStorage.getItem("token")
    try {
      const res = await fetch(`${API_URL}/admin/users`, {
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setUsers(data)
      }
    } catch (e) {
      console.error("Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.roll_number?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem("token")
    try {
      const res = await fetch(`${API_URL}/admin/users`, {
        method: 'POST',
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newUser)
      })
      if (res.ok) {
        setIsAddUserOpen(false)
        fetchUsers()
        setNewUser({
          email: '',
          full_name: '',
          password: 'admin123',
          role: 'student',
          department: 'Computer Science'
        })
      }
    } catch (e) {
      console.error("Failed to add user")
    }
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    const token = localStorage.getItem("token")
    try {
      const res = await fetch(`${API_URL}/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ role: newRole })
      })
      if (res.ok) {
        fetchUsers()
      }
    } catch (e) {
      console.error("Failed to update role")
    }
  }

  const handleDeleteUser = async () => {
    if (!deleteId) return
    const token = localStorage.getItem("token")
    try {
      const res = await fetch(`${API_URL}/admin/users/${deleteId}`, {
        method: 'DELETE',
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (res.ok) {
        fetchUsers()
        setDeleteId(null)
      }
    } catch (e) {
      console.error("Failed to delete user")
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tighter italic">{isAdmin ? "User Management" : "My Students"}</h2>
          <p className="text-zinc-500 font-medium">
            Displaying <span className="text-blue-600 font-black">{filteredUsers.length}</span> members.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <Input 
              placeholder="Search by name or UID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-white border-zinc-100 rounded-xl"
            />
          </div>
          {isAdmin && (
            <Button 
              onClick={() => setIsAddUserOpen(true)}
              className="bg-blue-600 rounded-xl font-bold px-6 h-11 shadow-lg shadow-blue-500/20 whitespace-nowrap"
            >
              <Plus size={18} className="mr-2"/> NEW USER
            </Button>
          )}
        </div>
      </div>

      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="rounded-[32px] p-8 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tighter italic">Add Institutional User</DialogTitle>
            <DialogDescription className="font-medium text-zinc-500">
              Create a new account with specific role and department access.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddUser} className="space-y-4 mt-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Full Name</label>
              <Input 
                required
                placeholder="e.g. John Doe"
                value={newUser.full_name}
                onChange={(e) => setNewUser({...newUser, full_name: e.target.value})}
                className="bg-slate-50 border-zinc-100 rounded-xl h-11"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Email Address</label>
              <Input 
                required
                type="email"
                placeholder="institutional@edupulse.edu"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                className="bg-slate-50 border-zinc-100 rounded-xl h-11"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Role</label>
                <select 
                  className="w-full h-11 bg-slate-50 border border-zinc-100 rounded-xl px-3 text-sm font-bold outline-none"
                  value={newUser.role || 'student'}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value as Role})}
                >
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Department</label>
                <select 
                  className="w-full h-11 bg-slate-50 border border-zinc-100 rounded-xl px-3 text-sm font-bold outline-none"
                  value={newUser.department}
                  onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                >
                  <option value="Computer Science">CS</option>
                  <option value="Information Technology">IT</option>
                  <option value="Electronics">ECE</option>
                  <option value="Mechanical">MECH</option>
                </select>
              </div>
            </div>
            <Button type="submit" className="w-full bg-blue-600 rounded-xl font-bold h-12 shadow-lg shadow-blue-500/20 mt-4">
              CREATE USER ACCOUNT
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Card className="border-none shadow-sm rounded-[32px] overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-none whitespace-nowrap">
                <TableHead className="font-black text-[10px] uppercase pl-8">Name/UID</TableHead>
                <TableHead className="font-black text-[10px] uppercase">Email</TableHead>
                <TableHead className="font-black text-[10px] uppercase">Department</TableHead>
                <TableHead className="font-black text-[10px] uppercase text-center">Role</TableHead>
                {isAdmin && <TableHead className="text-right pr-8 font-black text-[10px] uppercase">Action</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((u) => (
                <TableRow key={u.id || u._id} className="border-zinc-50 hover:bg-slate-50/50 transition-colors whitespace-nowrap">
                  <TableCell className="pl-8">
                    <p className="font-bold tracking-tight">{u.full_name}</p>
                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{u.roll_number || 'STAFF'}</p>
                  </TableCell>
                  <TableCell className="text-xs text-zinc-500">{u.email}</TableCell>
                  <TableCell className="text-xs font-bold text-zinc-600">{u.department || 'N/A'}</TableCell>
                  <TableCell className="text-center">
                    <Badge className={cn(
                      "text-[9px] font-black uppercase tracking-widest px-2 h-6",
                      u.role === 'admin' ? "bg-red-500" : u.role === 'faculty' ? "bg-emerald-500" : "bg-blue-600"
                    )}>
                      {u.role}
                    </Badge>
                  </TableCell>
                  {isAdmin && (
                    <TableCell className="text-right pr-8">
                      <div className="flex items-center justify-end gap-3">
                        <select 
                          className="text-[10px] font-bold bg-slate-100 rounded-lg px-2 py-1 outline-none border-none cursor-pointer"
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id || u._id, e.target.value)}
                        >
                          <option value="student">Student</option>
                          <option value="faculty">Faculty</option>
                          <option value="admin">Admin</option>
                        </select>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg" onClick={() => setDeleteId(u.id || u._id)}>
                          <AlertTriangle size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="rounded-[32px] p-8 max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tighter italic text-red-600">Delete User?</DialogTitle>
            <DialogDescription className="font-medium text-zinc-500">
              This will permanently revoke institutional access for this user. This action is irreversible.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 mt-6">
            <Button variant="outline" className="flex-1 rounded-2xl font-bold" onClick={() => setDeleteId(null)}>CANCEL</Button>
            <Button className="flex-1 bg-red-600 hover:bg-red-700 rounded-2xl font-bold" onClick={handleDeleteUser}>DELETE</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}


function AcademicsView({ user }: { user: User | null }) {
  const [subjects, setSubjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubject, setSelectedSubject] = useState<any>(null)
  const [selectedDept, setSelectedDept] = useState<string | null>(
    user?.role === 'student' ? user.department || null : null
  )

  useEffect(() => {
    if (user?.role === 'student' && user.department) {
      setSelectedDept(user.department)
    }
  }, [user])

  useEffect(() => {
    const fetchSubjects = async () => {
      const token = localStorage.getItem("token")
      try {
        const res = await fetch(`${API_URL}/student/academics`, {
          headers: { "Authorization": `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setSubjects(data)
        }
      } catch (e) {
        console.error("Failed to fetch subjects")
      } finally {
        setLoading(false)
      }
    }
    fetchSubjects()
  }, [])

  const departments = Array.from(new Set(subjects.map(s => s.department)))

  if (loading) return <div className="h-96 flex items-center justify-center italic font-bold text-zinc-400 text-xl tracking-tighter">Initializing Hub...</div>

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-4xl font-black tracking-tighter italic">Academics Hub</h2>
          <p className="text-zinc-500 font-medium">
            {selectedDept ? `Institutional curriculum for ${selectedDept}.` : "Select a department to view modules."}
          </p>
        </div>
        {selectedDept && (user?.role === 'admin' || user?.role === 'faculty') && (
          <Button variant="outline" className="rounded-xl font-bold border-zinc-200" onClick={() => setSelectedDept(null)}>
            VIEW ALL DEPARTMENTS
          </Button>
        )}
      </div>
      
      {!selectedDept ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {departments.map((dept, i) => (
            <Card key={i} onClick={() => setSelectedDept(dept)} className="border-none shadow-sm rounded-[32px] bg-white overflow-hidden group cursor-pointer hover:shadow-xl hover:shadow-blue-500/5 transition-all active:scale-[0.98]">
              <div className="p-8 h-full flex flex-col justify-between min-h-[220px]">
                <div>
                  <div className="h-16 w-16 rounded-3xl bg-slate-50 flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-sm">
                    <GraduationCap size={32} />
                  </div>
                  <h3 className="text-2xl font-black tracking-tight mb-2 italic">{dept}</h3>
                  <p className="text-zinc-400 font-bold text-[10px] uppercase tracking-widest">
                    {subjects.filter(s => s.department === dept).length} Subjects Active
                  </p>
                </div>
                <div className="mt-8 flex items-center gap-2 group/btn">
                  <span className="text-blue-600 font-black text-[10px] tracking-[0.2em] uppercase">Enter Dept</span>
                  <ArrowRight size={14} className="text-blue-600 group-hover/btn:translate-x-1 transition-transform" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {subjects.filter(s => s.department === selectedDept).map((subject, i) => (
            <Card key={i} className="border-none shadow-sm rounded-[32px] bg-white overflow-hidden group hover:shadow-md transition-all">
              <CardHeader className="bg-slate-50 p-6 border-b border-zinc-100">
                <Badge className="w-fit mb-2 bg-blue-100 text-blue-700 hover:bg-blue-100 font-black text-[9px] tracking-widest uppercase">
                  {subject.code}
                </Badge>
                <CardTitle className="text-lg font-black tracking-tight">{subject.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <UserCircle size={16} className="text-zinc-400" />
                  <span className="text-xs font-bold text-zinc-600">{subject.instructor}</span>
                </div>
                <div className="flex items-center gap-3">
                  <BookOpen size={16} className="text-zinc-400" />
                  <span className="text-xs font-bold text-zinc-600">{subject.credits} Credits</span>
                </div>
                <div className="pt-4 flex justify-between items-center border-t border-zinc-50">
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Semester {subject.semester}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-blue-600 font-black text-[10px] tracking-tighter"
                    onClick={() => setSelectedSubject(subject)}
                  >
                    VIEW DETAILS
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Sheet open={!!selectedSubject} onOpenChange={() => setSelectedSubject(null)}>
        <SheetContent side="right" className="sm:max-w-xl p-0 border-none rounded-l-[40px] overflow-hidden">
          <div className="h-full flex flex-col bg-white">
            <div className="p-8 bg-slate-50 border-b border-zinc-100">
              <SheetHeader className="p-0">
                <div className="flex items-center gap-3 mb-2">
                  <Badge className="bg-blue-600 font-black tracking-widest text-[10px] uppercase px-3 py-1">{selectedSubject?.code}</Badge>
                </div>
                <SheetTitle className="text-4xl font-black tracking-tighter italic text-zinc-900">{selectedSubject?.name}</SheetTitle>
                <SheetDescription className="font-medium text-zinc-500 text-base">Comprehensive course intelligence and curriculum structure.</SheetDescription>
              </SheetHeader>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-10">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Faculty Intelligence</h4>
                  <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100/50">
                    <p className="font-black text-blue-700 text-lg mb-2">{selectedSubject?.instructor}</p>
                    <p className="text-sm font-medium text-zinc-600 leading-relaxed">{selectedSubject?.faculty_details}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Semester Overview</h4>
                  <div className="p-6 bg-purple-50/50 rounded-3xl border border-purple-100/50">
                    <p className="text-sm font-medium text-purple-900 leading-relaxed italic">"{selectedSubject?.semester_overview}"</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Curriculum Roadmap</h4>
                <div className="space-y-3">
                  {selectedSubject?.curriculum?.map((item: string, i: number) => (
                    <div key={i} className="flex items-center gap-4 p-5 bg-zinc-50 rounded-[24px] border border-transparent hover:border-zinc-200 transition-all group">
                      <div className="h-10 w-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-600 font-black text-sm group-hover:scale-110 transition-transform">{i+1}</div>
                      <span className="text-sm font-bold text-zinc-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-zinc-100 bg-slate-50/50">
              <Button className="w-full bg-zinc-900 text-white rounded-2xl font-black h-12 hover:bg-zinc-800 transition-all" onClick={() => setSelectedSubject(null)}>
                CLOSE MODULE
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

function AttendanceView({ user }: { user: User | null }) {
  const [attendance, setAttendance] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDept, setSelectedDept] = useState<string | null>(
    user?.role === 'student' ? user.department || null : null
  )
  const [searchQuery, setSearchQuery] = useState('')
  const isFacultyOrAdmin = user?.role === 'faculty' || user?.role === 'admin'
  const isStudent = user?.role === 'student'

  useEffect(() => {
    const fetchAttendance = async () => {
      const token = localStorage.getItem("token")
      try {
        const res = await fetch(`${API_URL}/student/attendance`, {
          headers: { "Authorization": `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setAttendance(data)
        }
      } catch (e) {
        console.error("Failed to fetch attendance")
      } finally {
        setLoading(false)
      }
    }
    fetchAttendance()
  }, [])

  if (loading) return <div className="h-96 flex items-center justify-center italic font-bold text-zinc-400">Fetching Attendance Data...</div>

  // Filter attendance by department and search query
  const filteredAttendance = attendance.filter(a => {
    const matchesDept = selectedDept ? (a.department === selectedDept || !a.department) : true
    const matchesSearch = a.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         a.roll_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         a.subject_name?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesDept && matchesSearch
  })

  // Group by student
  const groupedAttendance = filteredAttendance.reduce((acc: any, curr: any) => {
    if (!acc[curr.user_id]) acc[curr.user_id] = { name: curr.user_name, roll: curr.roll_number, records: [] }
    acc[curr.user_id].records.push(curr)
    return acc
  }, {})

  const departments = ["Computer Science", "Information Technology", "Electronics", "Mechanical"]

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tighter italic">Attendance Monitor</h2>
          <p className="text-zinc-500 font-medium">
            {isStudent 
              ? `Personal presence tracking for ${user?.department}.`
              : selectedDept ? `Institutional presence tracking for ${selectedDept}.` : "Select a department to monitor student presence."
            }
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          {selectedDept && !isStudent && (
            <div className="relative md:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
              <Input 
                placeholder="Search student or UID..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-white border-zinc-100 rounded-xl"
              />
            </div>
          )}
          {selectedDept && !isStudent && (
            <Button variant="outline" className="rounded-xl font-bold border-zinc-200" onClick={() => setSelectedDept(null)}>
              VIEW ALL DEPARTMENTS
            </Button>
          )}
        </div>
      </div>

      {!selectedDept ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {departments.map((dept, i) => (
            <Card key={i} onClick={() => setSelectedDept(dept)} className="border-none shadow-sm rounded-[32px] bg-white overflow-hidden group cursor-pointer hover:shadow-xl hover:shadow-blue-500/5 transition-all active:scale-[0.98]">
              <div className="p-8 h-full flex flex-col justify-between min-h-[220px]">
                <div>
                  <div className="h-16 w-16 rounded-3xl bg-slate-50 flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-sm">
                    <ClipboardCheck size={32} />
                  </div>
                  <h3 className="text-2xl font-black tracking-tight mb-2 italic">{dept}</h3>
                  <p className="text-zinc-400 font-bold text-[10px] uppercase tracking-widest">
                    Presence Intelligence
                  </p>
                </div>
                <div className="mt-8 flex items-center gap-2 group/btn">
                  <span className="text-blue-600 font-black text-[10px] tracking-[0.2em] uppercase">Monitor Records</span>
                  <ArrowRight size={14} className="text-blue-600 group-hover/btn:translate-x-1 transition-transform" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {Object.values(groupedAttendance).length > 0 ? (
            Object.values(groupedAttendance).map((student: any, idx: number) => (
              <div key={idx} className="space-y-4">
                <div className="flex items-center gap-3 border-b border-zinc-100 pb-2">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-black">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-black tracking-tight leading-none mb-1">{student.name}</h3>
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{student.roll}</p>
                  </div>
                  <Badge variant="outline" className="ml-auto text-[9px] font-black uppercase tracking-widest border-blue-100 text-blue-600">
                    {student.records.length} SUBJECTS
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {student.records.map((record: any, i: number) => (
                    <AttendanceCard key={i} record={record} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-zinc-400 gap-4 bg-slate-50 rounded-[40px] border-2 border-dashed border-zinc-200">
              <ClipboardCheck size={48} className="opacity-20" />
              <p className="font-bold italic text-center px-4">No matching records found for {selectedDept}.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function AttendanceCard({ record }: { record: any }) {
  return (
    <Card className="border-none shadow-sm rounded-[32px] bg-white p-6 hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{record.subject_code}</p>
          <h3 className="text-lg font-black tracking-tight">{record.subject_name}</h3>
        </div>
        <div className={cn(
          "h-12 w-12 rounded-2xl flex flex-col items-center justify-center font-black",
          record.percentage >= 75 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
        )}>
          <span className="text-base">{Math.round(record.percentage)}%</span>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-end text-[10px] font-bold">
          <span className="text-zinc-500">Lectures: {record.lectures_attended}/{record.total_lectures}</span>
          <span className={record.percentage >= 75 ? "text-emerald-600" : "text-red-600"}>
            {record.percentage >= 75 ? "SAFE" : "CRITICAL"}
          </span>
        </div>
        <Progress value={record.percentage} className={cn("h-1.5", record.percentage >= 75 ? "bg-emerald-100" : "bg-red-100")} />
      </div>
    </Card>
  )
}

function PlacementCellView({ user }: { user: User | null }) {
  const [drives, setDrives] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDrive, setSelectedDrive] = useState<any>(null)
  const [appliedDrives, setAppliedDrives] = useState<string[]>([])
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)
  const isStudent = user?.role === 'student'

  useEffect(() => {
    const fetchDrives = async () => {
      const token = localStorage.getItem("token")
      try {
        const res = await fetch(`${API_URL}/placement/drives`, {
          headers: { "Authorization": `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setDrives(data)
        }
      } catch (e) {
        console.error("Failed to fetch drives")
      } finally {
        setLoading(false)
      }
    }
    fetchDrives()
  }, [])

  const handleApply = (driveId: string) => {
    if (!appliedDrives.includes(driveId)) {
      setAppliedDrives([...appliedDrives, driveId])
      setIsSuccessOpen(true)
    }
  }

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h2 className="text-5xl font-black tracking-tighter italic text-zinc-900 leading-none mb-1">Placement Cell</h2>
        <p className="text-zinc-500 font-bold text-sm">Active recruitment drives and career opportunities.</p>
      </div>

      <div className="space-y-2">
        {drives.map((drive, i) => (
          <Card key={i} className="border-none shadow-sm rounded-[24px] bg-white overflow-hidden group hover:shadow-md transition-all border border-transparent hover:border-blue-100">
            <CardContent className="py-1 px-8">
              <div className="grid grid-cols-1 lg:grid-cols-5 items-center gap-4">
                {/* Company Icon & Info */}
                <div className="lg:col-span-2 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-zinc-100">
                    <Briefcase size={20} className="text-zinc-400" />
                  </div>
                  <div className="space-y-0.5">
                    <Badge className={cn(
                      "text-[8px] font-black uppercase tracking-widest px-2 py-0 border-none rounded-full",
                      drive.status === 'open' ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
                    )}>
                      {drive.status}
                    </Badge>
                    <h3 className="text-lg font-black italic text-blue-600 leading-none">
                      {drive.role}
                    </h3>
                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest leading-none">
                      {drive.company_name} • {drive.package}
                    </p>
                  </div>
                </div>

                {/* Eligibility */}
                <div className="lg:col-span-1 text-center">
                  <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-0.5">ELIGIBILITY</p>
                  <p className="text-lg font-black text-zinc-900 italic leading-tight">{drive.eligibility}</p>
                </div>

                {/* Deadline */}
                <div className="lg:col-span-1 text-center">
                  <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-0.5">DEADLINE</p>
                  <p className="text-lg font-black text-zinc-900 italic">
                    {new Date(drive.deadline).toLocaleDateString('en-GB')}
                  </p>
                </div>

                {/* Actions */}
                <div className="lg:col-span-1 flex flex-col gap-1 w-full">
                  <Button 
                    onClick={() => setSelectedDrive(drive)}
                    variant="outline"
                    className="rounded-lg font-black text-[10px] tracking-widest h-7 border-zinc-200 hover:bg-slate-50 uppercase w-full"
                  >
                    DETAILS
                  </Button>
                  <Button 
                    onClick={() => isStudent ? handleApply(drive.id || i.toString()) : null}
                    disabled={drive.status !== 'open' || appliedDrives.includes(drive.id || i.toString())}
                    className={cn(
                      "rounded-lg font-black text-[11px] italic tracking-widest h-8 shadow-lg uppercase w-full",
                      appliedDrives.includes(drive.id || i.toString())
                        ? "bg-zinc-100 text-zinc-400"
                        : drive.status === 'open' 
                          ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20" 
                          : "bg-zinc-200 text-zinc-400"
                    )}
                  >
                    {appliedDrives.includes(drive.id || i.toString()) ? "APPLIED" : "APPLY NOW"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
        <DialogContent className="rounded-[40px] p-12 max-w-md text-center">
          <div className="flex justify-center mb-8">
            <div className="h-24 w-24 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner">
              <CheckCircle2 size={56} />
            </div>
          </div>
          <DialogHeader>
            <DialogTitle className="text-4xl font-black tracking-tighter italic text-center">Application Sent!</DialogTitle>
            <DialogDescription className="font-medium text-zinc-500 text-xl text-center mt-4">
              Your institutional profile has been submitted to the recruitment team. Good luck!
            </DialogDescription>
          </DialogHeader>
          <Button className="w-full bg-blue-600 hover:bg-blue-700 rounded-2xl font-black h-14 shadow-xl shadow-blue-500/20 mt-10 text-lg tracking-tight" onClick={() => setIsSuccessOpen(false)}>
            AWESOME
          </Button>
        </DialogContent>
      </Dialog>

      <Sheet open={!!selectedDrive} onOpenChange={() => setSelectedDrive(null)}>
        <SheetContent side="right" className="sm:max-w-2xl p-0 border-none rounded-l-[60px] overflow-hidden">
          <div className="h-full flex flex-col bg-white font-sans">
            <div className="p-16 bg-gradient-to-br from-zinc-950 to-zinc-900 text-white relative">
              <div className="absolute top-10 right-16">
                <Badge className={cn(
                  "font-black tracking-widest uppercase text-[11px] px-5 py-2 border-none rounded-full",
                  selectedDrive?.status === 'open' ? "bg-emerald-500" : "bg-red-500"
                )}>
                  {selectedDrive?.status}
                </Badge>
              </div>
              <div className="flex items-center gap-10 mb-10">
                <div className="h-28 w-28 rounded-[36px] bg-white/10 p-4 flex items-center justify-center overflow-hidden shrink-0 shadow-2xl backdrop-blur-md border border-white/10">
                  <Briefcase size={56} className="text-white/40" />
                </div>
                <div>
                  <SheetTitle className="text-6xl font-black tracking-tighter italic text-white mb-3 leading-none">{selectedDrive?.company_name}</SheetTitle>
                  <p className="text-blue-400 font-black uppercase text-[13px] tracking-[0.4em]">{selectedDrive?.role}</p>
                </div>
              </div>
              <div className="flex gap-16">
                <div>
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-2">Offer Package</p>
                  <p className="text-4xl font-black italic tracking-tighter">{selectedDrive?.package}</p>
                </div>
                <div className="w-px h-16 bg-white/10" />
                <div>
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-2">Application Deadline</p>
                  <p className="text-4xl font-black italic tracking-tighter">
                    {selectedDrive ? new Date(selectedDrive.deadline).toLocaleDateString('en-GB') : ""}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-16 space-y-16">
              <div className="space-y-8">
                <div className="flex items-center gap-5">
                  <div className="h-2.5 w-10 bg-blue-600 rounded-full" />
                  <h4 className="text-[12px] font-black text-zinc-400 uppercase tracking-[0.5em]">Opportunity Brief</h4>
                </div>
                <div className="p-12 bg-slate-50 rounded-[48px] border border-zinc-100 relative group overflow-hidden">
                  <p className="text-lg font-bold text-zinc-700 leading-relaxed relative z-10">
                    {selectedDrive?.job_description}
                  </p>
                  <div className="absolute -bottom-10 -right-10 opacity-[0.03] group-hover:opacity-[0.07] transition-all duration-700">
                    <FileText size={240} />
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center gap-5">
                  <div className="h-2.5 w-10 bg-purple-600 rounded-full" />
                  <h4 className="text-[12px] font-black text-zinc-400 uppercase tracking-[0.5em]">Selection Filters</h4>
                </div>
                <div className="flex items-center gap-10 p-10 bg-purple-50/50 rounded-[40px] border border-purple-100/50">
                  <div className="h-20 w-20 rounded-[28px] bg-white flex items-center justify-center text-purple-600 shadow-xl shadow-purple-500/10 shrink-0">
                    <Trophy size={40} />
                  </div>
                  <div>
                    <p className="text-[11px] font-black text-purple-400 uppercase tracking-[0.3em] mb-1">Minimum Merit Requirement</p>
                    <span className="text-3xl font-black text-purple-900 italic tracking-tighter">CGPA {selectedDrive?.eligibility}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-16 border-t border-zinc-100 bg-white flex gap-6">
              <Button 
                disabled={selectedDrive?.status !== 'open' || appliedDrives.includes(selectedDrive?.id || "temp")}
                onClick={() => {
                  if (isStudent) {
                    handleApply(selectedDrive?.id || "temp")
                    setSelectedDrive(null)
                  }
                }}
                className={cn(
                  "flex-1 rounded-[32px] font-black h-20 shadow-2xl text-2xl tracking-tight transition-all active:scale-[0.98]",
                  appliedDrives.includes(selectedDrive?.id || "temp")
                    ? "bg-zinc-100 text-zinc-400 cursor-default shadow-none border border-zinc-200"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30"
                )}
              >
                {appliedDrives.includes(selectedDrive?.id || "temp") ? "ALREADY APPLIED" : "SUBMIT APPLICATION"}
              </Button>
              <Button variant="ghost" className="w-24 h-20 rounded-[32px] border border-zinc-100 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 font-black text-sm uppercase tracking-widest" onClick={() => setSelectedDrive(null)}>
                EXIT
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}


function AnalyticsView({ userRole }: { userRole: Role }) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token")
      try {
        const res = await fetch(`${API_URL}/admin/analytics`, {
          headers: { "Authorization": `Bearer ${token}` }
        })
        if (res.ok) setData(await res.json())
      } catch (e) {} finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <div className="h-96 flex items-center justify-center italic font-bold text-zinc-400">Synthesizing Analytics...</div>

  const COLORS = ['#2563eb', '#06b6d4', '#4f46e5', '#f59e0b', '#ef4444']

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-4xl font-black tracking-tighter italic">Enterprise Intelligence</h2>
        <p className="text-zinc-500 font-medium">Data-driven institutional insights.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-sm rounded-[32px] bg-white p-8">
          <CardHeader className="p-0 mb-8">
            <CardTitle className="text-xl font-black tracking-tight italic">Hiring Trends (2024)</CardTitle>
          </CardHeader>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.hiring_trends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 700}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 700}} />
                <RechartsTooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Line type="monotone" dataKey="hires" stroke="#2563eb" strokeWidth={4} dot={{r: 6, fill: '#2563eb', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 8}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="border-none shadow-sm rounded-[32px] bg-white p-8">
          <CardHeader className="p-0 mb-8">
            <CardTitle className="text-xl font-black tracking-tight italic">Department Readiness</CardTitle>
          </CardHeader>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.department_readiness}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="dept" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 700}} />
                <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="value" fill="#2563eb" radius={[10, 10, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="border-none shadow-sm rounded-[32px] bg-white p-8 lg:col-span-2">
          <CardHeader className="p-0 mb-8">
            <CardTitle className="text-xl font-black tracking-tight italic">Performance Distribution (CGPA)</CardTitle>
          </CardHeader>
          <div className="flex flex-col md:flex-row items-center justify-around h-full py-10">
            <div className="h-[300px] w-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.performance_distribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="range"
                  >
                    {data?.performance_distribution.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {data?.performance_distribution.map((entry: any, index: number) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                  <div className="h-4 w-4 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}} />
                  <div>
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{entry.range}</p>
                    <p className="text-sm font-black text-zinc-900">{entry.count} Students</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

function AdminControlView() {
  const [logs, setLogs] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token")
      try {
        const [logsRes, statsRes] = await Promise.all([
          fetch(`${API_URL}/admin/logs`, { headers: { "Authorization": `Bearer ${token}` } }),
          fetch(`${API_URL}/admin/stats`, { headers: { "Authorization": `Bearer ${token}` } })
        ])
        if (logsRes.ok) setLogs(await logsRes.json())
        if (statsRes.ok) setStats(await statsRes.json())
      } catch (e) {
        console.error("Failed to fetch admin data")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <div className="h-96 flex items-center justify-center italic font-bold text-zinc-400">Loading control panel...</div>

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black tracking-tighter italic">System Management</h2>
          <p className="text-zinc-500 font-medium">Real-time institutional audit and infrastructure health.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="INSTITUTIONAL DB" value={stats?.db_health} change="Low Latency" icon={<ShieldCheck size={20} className="text-emerald-600"/>} trend="up" />
        <StatCard title="API GATEWAY" value={stats?.api_latency} change="99.9% Uptime" icon={<Code2 size={20} className="text-blue-600"/>} trend="up" />
        <StatCard title="ACTIVE USERS" value={stats?.active_sessions.toString()} change="Current Sessions" icon={<Users size={20} className="text-purple-600"/>} trend="neutral" />
        <StatCard title="STORAGE" value={stats?.storage_status} change="Clustered" icon={<BrainCircuit size={20} className="text-amber-600"/>} trend="up" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <Card className="lg:col-span-2 border-none shadow-sm rounded-[32px] overflow-hidden bg-white">
          <CardHeader className="p-8 border-b border-zinc-50">
            <CardTitle className="text-xl font-black tracking-tight italic">Institutional Activity Log</CardTitle>
          </CardHeader>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="border-none">
                  <TableHead className="font-black text-[10px] uppercase pl-8">User</TableHead>
                  <TableHead className="font-black text-[10px] uppercase">Action</TableHead>
                  <TableHead className="font-black text-[10px] uppercase">Details</TableHead>
                  <TableHead className="font-black text-[10px] uppercase pr-8 text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log, i) => (
                  <TableRow key={log.id || log._id || i} className="border-zinc-50 hover:bg-slate-50 transition-colors">
                    <TableCell className="pl-8 font-bold text-zinc-900">{log.user_id}</TableCell>
                    <TableCell><Badge variant="outline" className="font-mono text-[9px] font-black border-zinc-200">{log.action}</Badge></TableCell>
                    <TableCell className="text-zinc-500 font-medium text-xs tracking-tight">{log.details}</TableCell>
                    <TableCell className="pr-8 text-right">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-zinc-100">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-black uppercase text-zinc-600 tracking-tighter">SUCCESS</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="border-none shadow-sm rounded-[32px] bg-white p-8">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="text-lg font-black tracking-tight">Infrastructure Health</CardTitle>
            </CardHeader>
            <div className="space-y-5">
              <InfrastructureMetric label="Core API Gateway" status="Healthy" val={stats?.api_latency} />
              <InfrastructureMetric label="Institutional DB" status="Healthy" val={stats?.db_health} />
              <InfrastructureMetric label="Storage Clusters" status="Healthy" val={stats?.storage_status} />
              <InfrastructureMetric label="Total Students" status="Healthy" val={stats?.total_students?.toString() || "0"} />
              <InfrastructureMetric label="Total Faculty" status="Healthy" val={stats?.total_faculty?.toString() || "0"} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function InfrastructureMetric({ label, status, val }: { label: string, status: string, val: string }) {
  const badgeClass = cn(
    "text-[9px] font-black uppercase tracking-tighter px-2 h-5",
    status === 'Healthy' ? "bg-emerald-100 text-emerald-700 shadow-none" : "bg-amber-100 text-amber-700 shadow-none"
  )
  return (
    <div className="flex items-center justify-between group">
      <div>
        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{label}</p>
        <p className="text-sm font-black tracking-tight">{val}</p>
      </div>
      <Badge className={badgeClass}>
        {status}
      </Badge>
    </div>
  )
}
