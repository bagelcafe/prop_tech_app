import { useState, useCallback, useRef, useEffect } from 'react'
import {
  Box, TextField, InputAdornment, List, ListItem,
  Paper, CircularProgress, Typography, IconButton,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'

interface SuggestionItem { label: string; extra?: string; value: string }

interface Props {
  placeholder?: string
  onSelect: (value: string, label: string, extra?: string) => void
  fetchSuggestions: (query: string) => Promise<SuggestionItem[]>
  disabled?: boolean
  minLength?: number
}

export default function AutocompleteInput({
  placeholder = '검색어를 입력하세요',
  onSelect,
  fetchSuggestions,
  disabled,
  minLength = 2,
}: Props) {
  const [input, setInput] = useState('')
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const handleInput = useCallback(
    (value: string) => {
      setInput(value)
      if (timerRef.current) clearTimeout(timerRef.current)
      if (!value.trim() || value.trim().length < minLength) {
        setSuggestions([])
        setOpen(false)
        return
      }
      timerRef.current = setTimeout(async () => {
        setLoading(true)
        try {
          const results = await fetchSuggestions(value.trim())
          setSuggestions(results.slice(0, 10))
          setOpen(results.length > 0)
        } catch {
          setSuggestions([])
          setOpen(false)
        } finally {
          setLoading(false)
        }
      }, 300)
    },
    [fetchSuggestions, minLength],
  )

  const handleSelect = (item: SuggestionItem) => {
    setInput(item.label)
    setOpen(false)
    setSuggestions([])
    onSelect(item.value, item.label, item.extra)
  }

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <Box ref={wrapperRef} sx={{ position: 'relative', width: '100%' }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder={placeholder}
        value={input}
        disabled={disabled}
        onChange={(e) => handleInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
        autoComplete="off"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {loading ? <CircularProgress size={18} /> : <SearchIcon sx={{ color: 'text.secondary' }} />}
            </InputAdornment>
          ),
          endAdornment: input ? (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => { setInput(''); setOpen(false) }}>
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : undefined,
        }}
      />

      {open && (
        <Paper
          elevation={8}
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            mt: 0.5,
            zIndex: 1300,
            maxHeight: 320,
            overflowY: 'auto',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <List disablePadding>
            {suggestions.length > 0 ? (
              suggestions.map((item) => (
                <ListItem
                  key={item.value}
                  component="li"
                  onClick={() => handleSelect(item)}
                  sx={{
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 1.5,
                    px: 2,
                    '&:hover': { bgcolor: 'action.hover' },
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    '&:last-child': { borderBottom: 'none' },
                  }}
                >
                  <Typography variant="body2" fontWeight={600} fontSize="0.9rem">{item.label}</Typography>
                  {item.extra && (
                    <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace', fontSize: '0.8rem', ml: 1 }}>
                      {item.extra}
                    </Typography>
                  )}
                </ListItem>
              ))
            ) : (
              <ListItem sx={{ py: 1.5, px: 2 }}>
                <Typography variant="body2" color="text.secondary">검색 결과가 없습니다.</Typography>
              </ListItem>
            )}
          </List>
        </Paper>
      )}
    </Box>
  )
}
