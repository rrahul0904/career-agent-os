FROM node:22-slim
WORKDIR /app
COPY . .
ENV PORT=4310 DATABASE_PATH=/data/career-agent.db
RUN mkdir -p /data
EXPOSE 4310
CMD ["node","apps/api/src/server.js"]
