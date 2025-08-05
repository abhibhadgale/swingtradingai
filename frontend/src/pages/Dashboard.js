import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Paper,
  Typography,
  TextField,
  Stack,
  Chip,
  Tooltip,
  CircularProgress,
  List,
  ListItem,
  Fade,
  Slide,
  Grow,
  Autocomplete
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import UpdateIcon from '@mui/icons-material/Update';
import SearchIcon from '@mui/icons-material/Search';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import {
  fetchStockBySymbol,
  getShortlist,
  scanShortlist,
  fetchAllStocks,
  updateAllStocks,
  fetchTrackedStocks as getTrackedStocks,
  addTrackedStock as addToTracked,
  deleteTrackedStock as removeFromTracked,
  fetchBSEStocks
} from '../api';
import StockChart from '../components/StockChart';
import '../styles/Dashboard.css';

function Dashboard() {
  const [symbol, setSymbol] = useState('');
  const [selectedStock, setSelectedStock] = useState('');
  const [shortlist, setShortlist] = useState([]);
  const [dbStocks, setDbStocks] = useState([]);
  const [updating, setUpdating] = useState(false);
  const [tracked, setTracked] = useState([]);
  const [showShortlist, setShowShortlist] = useState(false);
  const [bseStocks, setBseStocks] = useState([]);


  const navigate = useNavigate();

  const loadStocks = async () => {
    try {
      const { data } = await fetchAllStocks();
      setDbStocks(data);
    } catch (err) {
      console.error('Failed to fetch DB stocks:', err);
    }
  };

  const loadTrackedStocks = async () => {
    try {
      const { data } = await getTrackedStocks();
      setTracked(data);
    } catch (err) {
      console.error('Failed to fetch tracked stocks:', err);
    }
  };

  const loadBSEStocks = async () => {
    try {
      const { data } = await fetchBSEStocks();
      setBseStocks(data);
    } catch (err) {
      console.error('Failed to load BSE stocks:', err);
    }
  };

  useEffect(() => {
    loadStocks();
    loadTrackedStocks();
    loadBSEStocks();
  }, []);

  const handleFetch = async () => {
    try {
      await fetchStockBySymbol(`${symbol}.BSE`);
      setSymbol('');
      await loadStocks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleShortlist = async () => {
    try {
      const { data } = await scanShortlist();
      setShortlist(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStocks = async () => {
    setUpdating(true);
    try {
      const res = await updateAllStocks();
      alert(res.data.message);
      await loadStocks();
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update stocks. Please try again later.');
    } finally {
      setUpdating(false);
    }
  };

  const handleTrack = async (stock) => {
    const trackedItem = tracked.find((t) => t.symbol === stock.symbol);

    if (trackedItem) {
      // 🛠 Use _id from tracked item for deletion
      await removeFromTracked(trackedItem._id);
    } else {
      await addToTracked(stock);
    }

    await loadTrackedStocks();
  };

  const handleGoToTrack = () => {
    navigate('/track');
  };

  return (
    <Grow in={true} timeout={700}>
      <Paper elevation={6} sx={{ maxWidth: 1100, mx: 'auto', p: 4, borderRadius: 4 }}>
        <Typography variant="h3" align="center" fontWeight={700} gutterBottom sx={{ mb: 4 }}>
          <TrackChangesIcon fontSize="large" sx={{ verticalAlign: 'middle', mr: 1 }} />
          Stock Dashboard
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" alignItems="center" sx={{ mb: 3 }}>
          <Autocomplete
            options={bseStocks}
            getOptionLabel={(option) => `${option["Security Id"]} - ${option["Security Name"]}`}
            onChange={(event, newValue) => {
              if (newValue) setSymbol(newValue["Security Id"]);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search BSE stock"
                variant="outlined"
                size="small"
                sx={{ width: 300 }}
              />
            )}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleFetch}
            startIcon={<SearchIcon />}
            sx={{ fontWeight: 600 }}
          >
            Fetch Stock
          </Button>
        </Stack>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ flexWrap: 'wrap', mt: 4 }}>
          {/* Left: Stock List */}
          <Box sx={{ minWidth: { xs: '100%', sm: 220, md: 260 }, maxWidth: { xs: '100%', md: 320 }, flex: 1, mb: { xs: 2, md: 0 } }}>
            <Paper elevation={2} sx={{ p: 2, borderRadius: 3, minHeight: 400 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>
                  <PlaylistAddCheckIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Available Stocks
                </Typography>
                <Box flexGrow={1} />
                <Tooltip title="Update all stocks">
                  <span>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={handleUpdateStocks}
                      startIcon={<UpdateIcon />}
                      disabled={updating}
                      sx={{ fontWeight: 600, px: 3 }}
                    >
                      {updating ? <CircularProgress size={22} color="inherit" /> : 'Update All Stocks'}
                    </Button>
                  </span>
                </Tooltip>
              </Stack>
              <List sx={{ width: '100%', bgcolor: 'transparent' }}>
                {dbStocks.map((stk, i) => {
                  const shortlisted = shortlist.find((s) => s.symbol === stk.symbol);
                  const trackedSymbols = tracked.map(t => t.symbol);
                  const isTracked = trackedSymbols.includes(stk.symbol);
                  const trendIcon = shortlisted
                    ? shortlisted.trend === 'rising'
                      ? <TrendingUpIcon color="success" />
                      : <TrendingDownIcon color="error" />
                    : null;
                  return (
                    <ListItem
                      key={stk.symbol}
                      selected={selectedStock === stk.symbol}
                      sx={{
                        background: selectedStock === stk.symbol ? '#e3f2fd' : '#f8f9fa',
                        borderLeft: '5px solid #1976d2',
                        borderRadius: 2,
                        mb: 1,
                        transition: 'background 0.2s',
                        cursor: 'pointer',
                        '&:hover': { background: '#e9ecef' },
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap'
                      }}
                    >
                      <Box
                        sx={{ flexGrow: 1, minWidth: 0 }}
                        onClick={() => setSelectedStock(stk.symbol)}
                      >
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography variant="subtitle1" fontWeight={700} sx={{ letterSpacing: 1, wordBreak: 'break-all' }}>
                            {stk.symbol}
                          </Typography>
                          {trendIcon}
                        </Stack>
                      </Box>
                      <Button
                        variant={isTracked ? 'outlined' : 'contained'}
                        color={isTracked ? 'error' : 'primary'}
                        size="small"
                        onClick={e => { e.stopPropagation(); handleTrack(stk); }}
                        startIcon={isTracked ? <PlaylistAddCheckIcon /> : <PlaylistAddIcon />}
                        sx={{ fontWeight: 600, minWidth: 110 }}
                      >
                        {isTracked ? 'Remove' : 'Track'}
                      </Button>
                    </ListItem>
                  );
                })}
              </List>
            </Paper>
          </Box>
          {/* Right: Chart */}
          <Box sx={{ flex: 3, minWidth: 0, width: { xs: '100%', md: 'auto' } }}>
            <Stack spacing={2}>
              <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" spacing={2} sx={{ mb: 1, justifyContent: 'flex-end' }}>
                <Chip
                  label={`Tracked: ${tracked.length} stock(s)`}
                  color="primary"
                  icon={<TrackChangesIcon />}
                  sx={{ fontWeight: 600, fontSize: 16, display: { xs: 'none', md: 'inline-flex' } }}
                />
                <Button
                  variant="contained"
                  color="info"
                  onClick={handleGoToTrack}
                  startIcon={<ArrowForwardIcon />}
                  sx={{ fontWeight: 600, minWidth: 180 }}
                >
                  Go to Track Page
                </Button>
              </Stack>
              {selectedStock ? (
                <Slide direction="up" in={!!selectedStock} mountOnEnter unmountOnExit timeout={500}>
                  <Fade in={!!selectedStock} timeout={700}>
                    <Box>
                      <Paper elevation={3} sx={{ p: { xs: 1, sm: 2, md: 3 }, borderRadius: 3, mb: 2, width: '100%', boxSizing: 'border-box', overflowX: 'auto' }}>
                        <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
                          <ShowChartIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                          Chart for {selectedStock}
                        </Typography>
                        <Box sx={{ width: '100%', minWidth: 0, maxWidth: '100%', overflowX: 'auto', display: 'flex', justifyContent: 'center' }}>
                          <Box sx={{ width: { xs: '100%', sm: '100%', md: '90%' }, maxWidth: 800 }}>
                            <StockChart key={selectedStock} symbol={selectedStock} />
                          </Box>
                        </Box>
                      </Paper>
                    </Box>
                  </Fade>
                </Slide>
              ) : (
                <Paper elevation={1} sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 3, textAlign: 'center', color: 'text.secondary' }}>
                  <Typography variant="h6">Select a stock to view chart.</Typography>
                </Paper>
              )}
            </Stack>
          </Box>
        </Stack>

        <Box className="stock-section" sx={{ mt: 4 }}>
          <Button
            variant="contained"
            color={showShortlist ? 'secondary' : 'primary'}
            onClick={() => {
              if (!showShortlist) handleShortlist();
              setShowShortlist((prev) => !prev);
            }}
            startIcon={<SearchIcon />}
            sx={{ fontWeight: 600 }}
          >
            {showShortlist ? 'Hide Shortlist' : 'Show Shortlist'}
          </Button>
          {showShortlist && shortlist.length > 0 && (
            <Paper elevation={1} sx={{ mt: 2, p: 2 }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                Shortlisted Stocks
              </Typography>
              <Stack spacing={1}>
                {shortlist.map((stk, i) => (
                  <Box key={i}>
                    <Chip
                      label={`${stk.symbol} - ${stk.trend} (MA: ${stk.latestMA})`}
                      color={stk.trend === 'rising' ? 'success' : 'error'}
                      icon={stk.trend === 'rising' ? <TrendingUpIcon /> : <TrendingDownIcon />}
                      sx={{ fontWeight: 600, fontSize: 15 }}
                    />
                  </Box>
                ))}
              </Stack>
            </Paper>
          )}
        </Box>
      </Paper>
    </Grow>
  );
}

export default Dashboard;