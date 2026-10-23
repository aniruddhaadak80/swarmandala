# Stage 1 — install + build
FROM oven/bun:1.3.14 AS builder
WORKDIR /app
COPY . .
RUN bun install --frozen-lockfile
RUN bun run build

# Stage 2 — runtime
FROM oven/bun:1.3.14-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/package.json ./apps/web/package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
EXPOSE 3000
CMD ["bun", "--cwd", "apps/web", "run", "start"]
