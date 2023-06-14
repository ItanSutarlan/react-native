# based image yang akan digunakan
FROM node:lts-hydrogen

# untuk set ENV dalam aplikasi kita
ENV PORT=4001
ENV NODE_ENV=
ENV MONGODB_URL=

# path di container dimana berisi codingan kita (path bebas sesuai kesepakatan bersama)
WORKDIR /users

# copy deps yang ada di apps ke WORKDIR
COPY ["package.json", "package-lock.json*", "./"]

# Install npm & Mengapus cache
RUN npm install --production && npm cache clean --force

# copy semua file & folder ke WORKDIR
COPY . .

# execute apps: production
CMD ["npm", "start"]
