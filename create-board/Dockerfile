FROM golang:1.21-alpine as builder

WORKDIR /home

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build

FROM alpine

EXPOSE 80

WORKDIR /app

COPY --from=builder /home/*.ttf ./
COPY --from=builder /home/templates ./templates
COPY --from=builder /home/create-board ./

CMD [ "./create-board" ]
