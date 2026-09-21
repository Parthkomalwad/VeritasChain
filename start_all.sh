#!/bin/bash

# Stop and remove any existing containers
echo -e "\033[33mStopping and removing existing containers...\033[0m"
docker compose -f infrastructure-compose.yml -f application-compose.yml down -v
docker system prune -f

# Start infrastructure services first (IPFS and Ganache)
echo -e "\033[32mStarting infrastructure services (IPFS and Ganache)...\033[0m"
docker compose -f infrastructure-compose.yml up -d --build --force-recreate

# Wait for Ganache to be fully up and running
echo -e "\033[33mWaiting for Ganache to be ready...\033[0m"
sleep 15

# Deploy contracts
echo -e "\033[32mDeploying smart contract to Ganache...\033[0m"
cd contracts
if [ ! -d "node_modules" ]; then
    echo -e "\033[33mInstalling contract dependencies...\033[0m"
    npm install
fi
echo -e "\033[32mMigrating contracts to blockchain...\033[0m"
npx truffle migrate --network docker --reset
cd ..

# Start the application services with force-recreate to ensure clean rebuilds
echo -e "\033[32mStarting application services (backend and frontend)...\033[0m"
docker compose -f application-compose.yml up -d --build --force-recreate

echo -e "\033[36mAll services are now running!\033[0m"
echo -e "\033[36m- Frontend: http://localhost:3000\033[0m"
echo -e "\033[36m- Backend API: http://localhost:8000\033[0m"
echo -e "\033[36m- IPFS interface: http://localhost:5001/webui\033[0m"
echo -e "\033[36m- Ganache blockchain: http://localhost:7545\033[0m"