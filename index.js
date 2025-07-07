const createExpressApp = require('./createExpressApp');
const app = createExpressApp();
const PORT = process.env.PORT || 8000;
const usersRouter = require('./routes/users');

app.use('/api', usersRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
