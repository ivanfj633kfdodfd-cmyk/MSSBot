module.exports = (req, res) => {
  const token = process.env.BOT_TOKEN || 'NOT SET';
  res.status(200).json({
    token_set: token !== 'NOT SET',
    token_preview: token.slice(0, 10) + '...',
    token_length: token.length
  });
};
