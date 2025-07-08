const createExpressApp = require('./createExpressApp');
const app = createExpressApp();
const PORT = process.env.PORT || 8000;
const routes = require('./routes');

app.use('/api', routes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
