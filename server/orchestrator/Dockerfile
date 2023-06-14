# based image yang akan digunakan
FROM node:lts-hydrogen

# untuk set ENV dalam aplikasi kita
ENV PORT=4000
ENV NODE_ENV=production
ENV USER_BASE_URL=http://localhost:4001
ENV APP_BASE_URL=http://localhost:4002
ENV REDIS_HOST=redis-14066.c295.ap-southeast-1-1.ec2.cloud.redislabs.com
ENV REDIS_PASSWORD=1dc19z6Fc9hKcdCtb708pEIK3mP2SVU8
ENV REDIS_PORT=14066

# path di container dimana berisi codingan kita (path bebas sesuai kesepakatan bersama)
WORKDIR /orchestrator

# copy deps yang ada di apps ke WORKDIR
COPY ["package.json", "package-lock.json*", "./"]

# Install npm & Mengapus cache
RUN npm install --production && npm cache clean --force

# copy semua file & folder ke WORKDIR
COPY . .

# execute apps: production
CMD ["npm", "start"]