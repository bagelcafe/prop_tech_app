import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon,
  ListItemText, Typography, Divider, Avatar, Chip, Tooltip,
  Collapse, IconButton, useMediaQuery, useTheme,
} from '@mui/material'
import ApartmentIcon from '@mui/icons-material/Apartment'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import BarChartIcon from '@mui/icons-material/BarChart'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import CoffeeIcon from '@mui/icons-material/Coffee'
import MenuIcon from '@mui/icons-material/Menu'
import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import ManageSearchIcon from '@mui/icons-material/ManageSearch'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { fetchStats } from '../api'

const DRAWER_WIDTH = 260

const NAV_ITEMS = [
  { label: '부동산 실거래가', path: '/', icon: <ApartmentIcon /> },
  { label: '접속 통계', path: '/stats', icon: <BarChartIcon /> },
]

const EXTERNAL_LINKS = [
  { label: '티스토리 블로그', href: 'https://baeglyeonsan.tistory.com/' },
  { label: '네이버 블로그', href: 'https://blog.naver.com/bagelcafe' },
]

interface Props { children: React.ReactNode }

export default function AppShell({ children }: Props) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  // PC: 기본 열림, 모바일: 기본 닫힘
  const [open, setOpen] = useState(!isMobile)
  const [kiwoomOpen, setKiwoomOpen] = useState(pathname.startsWith('/kiwoom'))

  const [todayVisitors, setTodayVisitors] = useState<string>('-')
  const [totalVisitors, setTotalVisitors] = useState<string>('-')

  // 화면 크기 변경 시 사이드바 상태 자동 조정
  useEffect(() => {
    setOpen(!isMobile)
  }, [isMobile])

  useEffect(() => {
    fetchStats().then((data) => {
      let uniqueIPs = 0
      const today = new Date().toISOString().slice(0, 10)
      const todayRecord = data.history?.find((h) => h.date === today)

      if (todayRecord?.visitors) {
        uniqueIPs = todayRecord.visitors
      } else if (data.today_logs && data.today_logs.length > 0) {
        uniqueIPs = new Set(data.today_logs.map((l) => l.ip)).size
      }

      setTodayVisitors(uniqueIPs.toLocaleString())
      setTotalVisitors(data.summary.total_visitors.toLocaleString())
    }).catch(() => { /* silent */ })
  }, [])

  const handleToggle = () => setOpen((v) => !v)

  // 모바일에서 메뉴 클릭 시 자동 닫기
  const handleNavClick = (path: string) => {
    navigate(path)
    if (isMobile) setOpen(false)
  }

  const drawerContent = (
    <>
      {/* Header with toggle */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar
          src="/static/profile_icon.png"
          sx={{ width: 40, height: 40, border: '2px solid rgba(255,255,255,0.15)' }}
        />
        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" color="text.secondary" display="block">
            Welcome Back,
          </Typography>
          <Typography variant="subtitle2" fontWeight={700}>
            백련산넷돌이
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* Nav */}
      <Box sx={{ px: 1, pt: 1 }}>
        <Typography
          variant="caption"
          color="text.disabled"
          sx={{ px: 1.5, display: 'block', mb: 0.5, fontWeight: 600, letterSpacing: '0.08em' }}
        >
          MENU
        </Typography>
        <List disablePadding>
          {NAV_ITEMS.map((item) => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                selected={pathname === item.path}
                onClick={() => handleNavClick(item.path)}
              >
                <ListItemIcon sx={{ minWidth: 36, color: pathname === item.path ? 'primary.main' : 'text.secondary' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: pathname === item.path ? 600 : 400 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
          <ListItem disablePadding>
            <ListItemButton selected={pathname.startsWith('/kiwoom')} onClick={() => setKiwoomOpen((value) => !value)}>
              <ListItemIcon sx={{ minWidth: 36, color: pathname.startsWith('/kiwoom') ? 'primary.main' : 'text.secondary' }}>
                <ShowChartIcon />
              </ListItemIcon>
              <ListItemText primary="키움주식" primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: pathname.startsWith('/kiwoom') ? 600 : 400 }} />
              {kiwoomOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemButton>
          </ListItem>
          <Collapse in={kiwoomOpen} timeout="auto" unmountOnExit>
            <List disablePadding>
              <ListItem disablePadding>
                <ListItemButton sx={{ pl: 4.5 }} selected={pathname === '/kiwoom'} onClick={() => handleNavClick('/kiwoom')}>
                  <ListItemIcon sx={{ minWidth: 32, color: pathname === '/kiwoom' ? 'primary.main' : 'text.secondary' }}><ShowChartIcon fontSize="small" /></ListItemIcon>
                  <ListItemText primary="종목 조회" primaryTypographyProps={{ fontSize: '0.825rem', fontWeight: pathname === '/kiwoom' ? 600 : 400 }} />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton sx={{ pl: 4.5 }} selected={pathname === '/kiwoom/conditions'} onClick={() => handleNavClick('/kiwoom/conditions')}>
                  <ListItemIcon sx={{ minWidth: 32, color: pathname === '/kiwoom/conditions' ? 'primary.main' : 'text.secondary' }}><ManageSearchIcon fontSize="small" /></ListItemIcon>
                  <ListItemText primary="조건 검색" primaryTypographyProps={{ fontSize: '0.825rem', fontWeight: pathname === '/kiwoom/conditions' ? 600 : 400 }} />
                </ListItemButton>
              </ListItem>
            </List>
          </Collapse>
        </List>
      </Box>

      <Divider sx={{ my: 1 }} />

      {/* External links */}
      <Box sx={{ px: 1 }}>
        <List disablePadding>
          {EXTERNAL_LINKS.map((link) => (
            <ListItem key={link.href} disablePadding>
              <ListItemButton component="a" href={link.href} target="_blank" rel="noopener">
                <ListItemIcon sx={{ minWidth: 36, color: 'text.secondary' }}>
                  <OpenInNewIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={link.label}
                  primaryTypographyProps={{ fontSize: '0.8rem' }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      <Box sx={{ flexGrow: 1 }} />

      {/* Buy me a coffee */}
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Tooltip title="Buy me a coffee ☕">
          <a href="https://www.buymeacoffee.com/bagelcafe" target="_blank" rel="noopener">
            <CoffeeIcon sx={{ color: '#FFDD00', fontSize: 28 }} />
          </a>
        </Tooltip>
      </Box>

      <Divider />

      {/* Visitor stats */}
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="caption" color="text.secondary">오늘 방문자</Typography>
          <Chip label={todayVisitors} size="small" color="primary" variant="outlined" sx={{ height: 20, fontSize: '0.7rem' }} />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption" color="text.secondary">누적 방문자</Typography>
          <Chip label={totalVisitors} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.7rem' }} />
        </Box>
      </Box>
    </>
  )

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      {/* 모바일: temporary drawer (오버레이) */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={open}
          onClose={() => setOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        /* PC: persistent drawer (밀어내기) */
        <Drawer
          variant="persistent"
          open={open}
          sx={{
            width: open ? DRAWER_WIDTH : 0,
            flexShrink: 0,
            transition: 'width 0.3s ease',
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              transition: 'transform 0.3s ease',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          minHeight: '100vh',
          transition: 'margin-left 0.3s ease',
        }}
      >
        {/* Toggle button (항상 표시) */}
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            px: 1.5,
            py: 0.75,
            bgcolor: 'background.default',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <IconButton
            onClick={handleToggle}
            size="small"
            sx={{ mr: 1 }}
            aria-label={open ? '사이드바 닫기' : '사이드바 열기'}
          >
            {open ? <MenuOpenIcon /> : <MenuIcon />}
          </IconButton>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
            Menu
          </Typography>
        </Box>

        {children}
      </Box>
    </Box>
  )
}
