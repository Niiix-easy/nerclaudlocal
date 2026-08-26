const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.post('/projects', (req, res) => {
  const { name, organizationId } = req.body;
  console.log(`Creating project: ${name} in org: ${organizationId}`);
  res.status(201).json({
    message: 'Project created successfully',
    project: { name, organizationId },
    urls: {
      api: `http://localhost:8000/rest/v1`,
      auth: `http://localhost:8000/auth/v1`
    }
  });
});

app.listen(port, () => {
  console.log(`Control plane running on port ${port}`);
});
