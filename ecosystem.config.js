module.exports = {
  apps: [
    {
      name: "FoodGenie", // process name
      script: "node_modules/next/dist/bin/next", // Next.js binary
      args: "start -p 3600", // production port
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};