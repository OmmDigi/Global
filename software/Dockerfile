FROM electronuserland/builder:wine

WORKDIR /app

ENV npm_config_arch=ia32
ENV npm_config_target_arch=ia32
ENV npm_config_platform=win32

COPY package*.json ./
RUN npm install --force

COPY . .

RUN npm rebuild --arch=ia32

CMD ["npm", "run", "build"]
