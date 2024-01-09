FROM --platform=linux/x86_64 node:21-alpine

WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./
COPY ./prisma/schema.prisma ./prisma/
# COPY .env ./

RUN yarn install
RUN npx prisma generate

COPY . .

CMD ["yarn", "start"]