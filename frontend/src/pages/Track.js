// /workspaces/codespaces-blank/frontend/src/pages/Track.js
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  fetchTrackedStocks,
  addTrackedStock,
  deleteTrackedStock,
  fetchOhlcBySymbol,
  fetchTrendBySymbol,
  createTrade
} from '../api';
import StockChart from '../components/StockChart';
import { suggestEntry } from '../utils/entryStrategy';
import AddTradeModal from '../components/AddTradeModal';
import {
  Box,
  Paper,
  Typography,
  Stack,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress,
  Fade,
  Slide,
  Grow,
  Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import '../styles/Track.css';

function Track() {
  const location = useLocation();
  const cart = location.state?.cart || [];

  const [tracked, setTracked] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState(null); // Track clicked stock
  const [entrySuggestion, setEntrySuggestion] = useState(null);
  const [entryLog, setEntryLog] = useState([]);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);

  const loadTrackedStocks = async () => {
    try {
      const { data } = await fetchTrackedStocks();
      setTracked(data);
    } catch (err) {
      console.error('Error loading tracked stocks:', err);
    }
  };

  const syncCartToTrackedStocks = async () => {
    try {
      const { data: current } = await fetchTrackedStocks();
      const trackedSymbols = new Set(current.map((s) => s.symbol));
      const newStocks = cart.filter((s) => !trackedSymbols.has(s.symbol));

      for (const stock of newStocks) {
        await addTrackedStock(stock);
      }

      loadTrackedStocks();
    } catch (err) {
      console.error('Sync failed:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTrackedStock(id);
      if (tracked.find((s) => s._id === id)?.symbol === selectedSymbol) {
        setSelectedSymbol(null); // Reset chart if deleted
      }
      loadTrackedStocks();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const handleSelect = async (symbol) => {
    setSelectedSymbol(symbol);
    setLoadingSuggestion(true);
    try {
      const { data } = await fetchOhlcBySymbol(symbol);
      const result = suggestEntry(data);
      if (result.entry) {
        setEntrySuggestion({ symbol, ...result });
      } else {
        setEntrySuggestion({ symbol });
      }
      setEntryLog(result.log || []);
    } catch (err) {
      setEntrySuggestion(null);
      setEntryLog(['❌ Error fetching or processing data.']);
    } finally {
      setLoadingSuggestion(false);
    }
  };

  const handleAddTradeClick = (symbol) => {
    const suggestion = entrySuggestion;
    if (!suggestion) return;

    setModalData({
      symbol,
      entry: suggestion.entry || '',
      stopLoss: suggestion.stopLoss || '',
      target: suggestion.target || '',
      volume: suggestion.quantity || '',
      tradeDate: new Date().toISOString().split('T')[0],
      note: '',
    });
    setShowModal(true);
  };

  const saveTrade = async (trade) => {
    try {
      await createTrade(trade);
      alert('✅ Trade saved!');
      setShowModal(false);
    } catch (err) {
      console.error('Trade save failed:', err);
      alert('❌ Failed to save trade.');
    }
  };

  useEffect(() => {
    syncCartToTrackedStocks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
      py: 4
    }}>
      <Grow in={true} timeout={700}>
        <Paper elevation={6} sx={{ maxWidth: 1200, mx: 'auto', p: 4, borderRadius: 4, minHeight: 600 }}>
          <Typography variant="h3" align="center" fontWeight={700} gutterBottom sx={{ mb: 4 }}>
            <ShowChartIcon fontSize="large" sx={{ verticalAlign: 'middle', mr: 1 }} />
            Tracked Stocks
          </Typography>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ flexWrap: 'wrap' }}>
            {/* Left: Stock List */}
            <Box sx={{ minWidth: { xs: '100%', sm: 220, md: 260 }, maxWidth: { xs: '100%', md: 320 }, flex: 1, mb: { xs: 2, md: 0 } }}>
              <Paper elevation={2} sx={{ p: 2, borderRadius: 3, minHeight: 400 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                  Stocks
                </Typography>
                {tracked.length === 0 ? (
                  <Typography align="center" color="text.secondary" sx={{ mt: 4 }}>
                    No stocks are currently tracked.
                  </Typography>
                ) : (
                  <List sx={{ width: '100%', bgcolor: 'transparent' }}>
                    {tracked.map((stock) => (
                      <ListItem
                        key={stock._id}
                        selected={selectedSymbol === stock.symbol}
                        sx={{
                          background: selectedSymbol === stock.symbol ? '#e3f2fd' : '#f8f9fa',
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
                          onClick={() => handleSelect(stock.symbol)}
                        >
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography variant="subtitle1" fontWeight={700} sx={{ letterSpacing: 1, wordBreak: 'break-all' }}>
                              {stock.symbol}
                            </Typography>
                            <Chip
                              label={new Date(stock.addedAt).toLocaleString()}
                              size="small"
                              color="info"
                            />
                          </Stack>
                        </Box>
                        <IconButton edge="end" color="error" onClick={e => { e.stopPropagation(); handleDelete(stock._id); }}>
                          <DeleteIcon />
                        </IconButton>
                      </ListItem>
                    ))}
                  </List>
                )}
              </Paper>
            </Box>
            {/* Right: Chart and Suggestion */}
            <Box sx={{ flex: 3, minWidth: 0, width: { xs: '100%', md: 'auto' } }}>
              {selectedSymbol ? (
                <Slide direction="up" in={!!selectedSymbol} mountOnEnter unmountOnExit timeout={500}>
                  <Fade in={!!selectedSymbol} timeout={700}>
                    <Box>
                      <Paper elevation={3} sx={{ p: { xs: 1, sm: 2, md: 3 }, borderRadius: 3, mb: 2, width: '100%', boxSizing: 'border-box', overflowX: 'auto' }}>
                        <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
                          <ShowChartIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                          Chart for {selectedSymbol}
                        </Typography>
                        <Box sx={{ width: '100%', minWidth: 0, maxWidth: '100%', overflowX: 'auto', display: 'flex', justifyContent: 'center' }}>
                          <Box sx={{ width: { xs: '100%', sm: '100%', md: '90%' }, maxWidth: 800 }}>
<StockChart key={selectedSymbol} symbol={selectedSymbol} />
                          </Box>
                        </Box>
                      </Paper>
                      {/* Entry Suggestion Section */}
                      <Paper elevation={2} sx={{ p: { xs: 1, sm: 2, md: 3 }, borderRadius: 3, mb: 2, mt: 2 }}>
                        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                          Entry Suggestion
                        </Typography>
                        <Button
                          variant="contained"
                          color="info"
                          onClick={() => handleSelect(selectedSymbol)}
                          sx={{ fontWeight: 600, mb: 2 }}
                          disabled={loadingSuggestion}
                        >
                          {loadingSuggestion ? <CircularProgress size={22} color="inherit" /> : 'Suggest Entry'}
                        </Button>
                        {entryLog.length > 0 && (
                          <List>
                            {entryLog.map((line, i) => (
                              <ListItem key={i}>
                                <ListItemText primary={line} />
                              </ListItem>
                            ))}
                          </List>
                        )}
                        {entrySuggestion && entrySuggestion.entry && (
                          <Box sx={{ mt: 2 }}>
                            <Typography><strong>Entry:</strong> ₹{entrySuggestion.entry}</Typography>
                            <Typography><strong>Stop Loss:</strong> ₹{entrySuggestion.stopLoss}</Typography>
                            <Typography><strong>Target:</strong> ₹{entrySuggestion.target}</Typography>
                            <Typography><strong>Qty (@ ₹1000 risk):</strong> {entrySuggestion.quantity}</Typography>
                            <Button
                              variant="contained"
                              color="success"
                              sx={{ mt: 2 }}
                              onClick={() => handleAddTradeClick(selectedSymbol)}
                            >
                              ➕ Add Trade
                            </Button>
                          </Box>
                        )}
                      </Paper>
                    </Box>
                  </Fade>
                </Slide>
              ) : (
                <Paper elevation={1} sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 3, textAlign: 'center', color: 'text.secondary' }}>
                  <Typography variant="h6">Select a stock to view chart and entry suggestion.</Typography>
                </Paper>
              )}
            </Box>
          </Stack>
        </Paper>
      </Grow>
      {showModal && modalData && (
        <AddTradeModal
          symbol={modalData.symbol}
          defaultData={modalData}
          onClose={() => setShowModal(false)}
          onSave={saveTrade}
        />
      )}
    </Box>
  );
}

export default Track;
