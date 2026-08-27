#!/usr/bin/env node

const { Command } = require('commander');
const axios = require('axios');

const program = new Command();
program.version('1.0.0').description('NeerCloud CLI');

const CONTROL_PLANE_URL = process.env.CONTROL_PLANE_URL || 'http://localhost:3001';

// CLI automatically bypasses the simple auth if we set the local internal header
const getHeaders = () => ({
  headers: {
    'Cookie': 'neercloud_admin_auth=authenticated',
    'X-NeerCloud-Internal': 'true'
  }
});

program
  .command('project <action>')
  .description('Manage projects (actions: migrate)')
  .option('--github <url>', 'GitHub repository URL')
  .option('--lovable <id>', 'Lovable project ID')
  .option('--name <name>', 'Project name')
  .action(async (action, options) => {
    if (action === 'migrate') {
      if (options.github) {
        if (!options.name) {
          console.error("Error: --name is required when migrating from GitHub.");
          process.exit(1);
        }
        try {
          console.log(`Migrating GitHub project ${options.name}...`);
          const res = await axios.post(`${CONTROL_PLANE_URL}/migrate/github`, {
            repoUrl: options.github,
            projectName: options.name
          }, getHeaders());
          console.log('Success:', res.data);
        } catch (err) {
          console.error('Migration failed:', err.response?.data || err.message);
        }
      } else if (options.lovable) {
        if (!options.name) {
          console.error("Error: --name is required when migrating from Lovable.");
          process.exit(1);
        }
        try {
          console.log(`Migrating Lovable project ${options.name}...`);
          const res = await axios.post(`${CONTROL_PLANE_URL}/migrate/lovable`, {
            projectId: options.lovable,
            projectName: options.name
          }, getHeaders());
          console.log('Success:', res.data);
        } catch (err) {
          console.error('Migration failed:', err.response?.data || err.message);
        }
      } else {
        console.error('Please specify a source: --github or --lovable');
      }
    } else {
      console.log(`Unknown action: ${action}`);
    }
  });

program.parse(process.argv);
