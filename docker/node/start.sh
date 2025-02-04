#!/bin/bash

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Check if Vue project exists
if [ ! -d "vue" ]; then
    echo "Creating Vue project..."
    npm create vue@latest vue -- --typescript --router --pinia --eslint --prettier
    cd vue
    npm install
    npm install laravel-vite-plugin --save-dev
fi

# Start development server
npm run dev 