# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files and local workspace packages
COPY package.json package-lock.json ./
COPY packages/ ./packages/

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build args
ARG VITE_DATABASE_URL
ARG VITE_ADMIN_PASSWORD
ENV VITE_DATABASE_URL=$VITE_DATABASE_URL
ENV VITE_ADMIN_PASSWORD=$VITE_ADMIN_PASSWORD

# Build the app
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

# Copy custom nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
