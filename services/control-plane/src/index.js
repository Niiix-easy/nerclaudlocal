const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use((req, res, next) => {
  if (req.path === "/health") return next();
  const isInternal = req.headers["x-neercloud-internal"] === "true";
  const isFromDashboard = req.headers["referer"] && req.headers["referer"].includes("3000");
  // Simplistic auth check for simulation, assuming Kong or internal routing protects it
  next();
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

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

const simulateMigration = async (projectName, source) => {
  console.log(`Starting migration from ${source} for project: ${projectName}`);

  const schemaName = `project_${projectName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`;

  try {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      console.log(`Creating schema: ${schemaName}`);
      await client.query(`CREATE SCHEMA IF NOT EXISTS ${schemaName}`);
      // Simulate creating some tables or running migrations
      await client.query(`
        CREATE TABLE IF NOT EXISTS ${schemaName}.users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);
      await client.query('COMMIT');
      console.log(`Migration completed for schema: ${schemaName}`);
      return { success: true, schema: schemaName };
    } catch (e) {
      await client.query('ROLLBACK');
      console.error('Migration transaction failed:', e);
      throw e;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(`Database connection error during migration:`, err);
    throw err;
  }
};

app.post('/migrate/github', async (req, res) => {
  const { repoUrl, projectName } = req.body;
  if (!repoUrl || !projectName) {
    return res.status(400).json({ error: 'repoUrl and projectName are required' });
  }

  try {
    // Simulate downloading repo and extracting migrations
    console.log(`Downloading repository from ${repoUrl}...`);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const result = await simulateMigration(projectName, 'GitHub');
    res.status(200).json({ message: 'GitHub project migrated successfully', ...result });
  } catch (error) {
    res.status(500).json({ error: 'Failed to migrate GitHub project', details: error.message });
  }
});

app.post('/migrate/lovable', async (req, res) => {
  const { projectId, projectName } = req.body;
  if (!projectId || !projectName) {
    return res.status(400).json({ error: 'projectId and projectName are required' });
  }

  try {
    // Simulate fetching project from Lovable API
    console.log(`Fetching Lovable project ${projectId}...`);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const result = await simulateMigration(projectName, 'Lovable');
    res.status(200).json({ message: 'Lovable project migrated successfully', ...result });
  } catch (error) {
    res.status(500).json({ error: 'Failed to migrate Lovable project', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Control plane running on port ${port}`);
});
