FROM node:16-alpine as build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage with Nginx
FROM nginx:alpine

# Copy built files from build stage to nginx serve directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration if needed
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Add runtime environment variable support
# This creates a script that replaces environment variables in the index.html at runtime
RUN apk add --no-cache bash
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Create docker-entrypoint.sh if it doesn't exist in the repo
RUN echo '#!/bin/bash\n\
# Replace env vars in JavaScript files\n\
echo "Replacing environment variables"\n\
for file in /usr/share/nginx/html/static/js/*.js; do\n\
  echo "Processing $file ..."\n\
  sed -i "s|REACT_APP_API_URL_PLACEHOLDER|$REACT_APP_API_URL|g" $file\n\
done\n\
\n\
echo "Starting Nginx"\n\
exec nginx -g "daemon off;"' > /usr/local/bin/docker-entrypoint.sh

# Expose port
EXPOSE 80

# Start Nginx server
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
