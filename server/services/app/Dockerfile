# based image yang akan digunakan
FROM node:lts-hydrogen

# untuk set ENV dalam aplikasi kita
ENV PORT=4002
ENV NODE_ENV=production
ENV DATABASE_URL=postgresql://postgres:b_V9RXcXFjureXd@db.albxijdfsvdpyuhdcjsf.supabase.co:5432/postgres

# path di container dimana berisi codingan kita (path bebas sesuai kesepakatan bersama)
WORKDIR /app

# copy deps yang ada di apps ke WORKDIR
COPY ["package.json", "package-lock.json*", "./"]

# Install npm & Mengapus cache
RUN npm install --production && npm cache clean --force

# copy semua file & folder ke WORKDIR
COPY . .

# execute apps: production
CMD ["npm", "start"]