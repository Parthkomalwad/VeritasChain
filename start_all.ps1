# Stop and remove any existing containers
Write-Host "Stopping and removing existing containers..." -ForegroundColor Yellow
docker-compose -f infrastructure-compose.yml -f application-compose.yml down -v
docker system prune -f

# Start infrastructure services first (IPFS and Ganache)
Write-Host "Starting infrastructure services (IPFS and Ganache)..." -ForegroundColor Green
docker-compose -f infrastructure-compose.yml up -d --build --force-recreate

# Wait for Ganache to be fully up and running
Write-Host "Waiting for Ganache to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Create a temporary Docker container to deploy the contract
Write-Host "Deploying smart contract to Ganache..." -ForegroundColor Green
cd contracts
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing contract dependencies..." -ForegroundColor Yellow
    npm install
}
Write-Host "Migrating contracts to blockchain..." -ForegroundColor Green
npx truffle migrate --network docker --reset
cd ..

# Start the application services with force-recreate to ensure clean rebuilds
Write-Host "Starting application services (backend and frontend)..." -ForegroundColor Green
docker-compose -f application-compose.yml up -d --build --force-recreate

Write-Host "All services are now running!" -ForegroundColor Cyan
Write-Host "- Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "- Backend API: http://localhost:8000" -ForegroundColor Cyan
Write-Host "- IPFS interface: http://localhost:5001/webui" -ForegroundColor Cyan
Write-Host "- Ganache blockchain: http://localhost:7545" -ForegroundColor Cyan