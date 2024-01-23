module.exports = {
  apps: [
    {
      name: 'frontend',          // Change 'frontend' to your application name
      script: 'npm',
      args: 'start',
      cwd: '/home/ubuntu/flashcard/frontend',  // Replace with the actual path to your React project
      interpreter: 'none',
      watch: true,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
