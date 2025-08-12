#* Image Size = 631MB

# FROM node:18-alpine

# WORKDIR /app

# COPY package*.json ./

# RUN npm install 

# COPY . .

# EXPOSE 3000

# CMD [ "node", "dist/index.js" ]



# =================================================================================


# #* Image Size = 601MB
# # -------- STAGE 1: Build --------
# FROM node:18-alpine AS builder

# WORKDIR /app

# # Copy only package files to install dependencies
# COPY package*.json tsconfig.json ./

# # Install all dependencies (including dev) to build
# RUN npm install

# # Copy source files
# COPY . .

# # Transpile TypeScript to JavaScript
# RUN npm run build

# # -------- STAGE 2: Production --------
# FROM node:18-alpine AS runner

# WORKDIR /app

# # Set environment to production
# ENV NODE_ENV=production

# # Only install production deps
# COPY package*.json ./
# RUN npm install --omit=dev

# # Copy built JS files from previous stage
# COPY --from=builder /app/dist ./dist

# # If needed, copy any static files/configs (optional)
# COPY --from=builder /app/images ./images
# COPY --from=builder /app/.env.prod ./.env.prod

# EXPOSE 3000

# CMD ["node", "dist/index.js"]


# =================================================================================


#* Image Size = 212MB

# -------- STAGE 1: Build -------- 
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json tsconfig.json ./

# Install all dependencies (including dev) to build
RUN npm install

COPY . .

# Transpile TypeScript to JavaScript
RUN npm run build


# -------- STAGE 2: Production --------
FROM node:22-alpine AS runner


# Assigning development as the default value for TARGET_ENV
ARG TARGET_ENV=development 
ENV NODE_ENV=$TARGET_ENV

WORKDIR /app

COPY package*.json ./

RUN if [ "$TARGET_ENV" = "production" ]; then \
      npm install --omit=dev \
      && npm cache clean --force \
      && rm -rf /root/.npm /root/.cache; \
    else \
      npm install; \
    fi


COPY --from=builder /app/dist ./dist
COPY --from=builder /app/images ./images

EXPOSE 3000

CMD ["node", "dist/index.js"]


